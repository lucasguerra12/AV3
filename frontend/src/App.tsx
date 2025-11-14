import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';

// 1. REMOVER MOCKS
// import { mockAeronaves, mockFuncionarios } from './data/mockData';

// 2. IMPORTAR A API
import * as api from './services/api'; 

import { Aeronave } from './models/Aeronave';
import { Funcionario } from './models/Funcionario';
import { NivelPermissao } from './models/enums';

// Lazy loading das páginas (isto já estava bom na AV2)
const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard'));
const AircraftDetails = React.lazy(() => import('./pages/AircraftDetails/AircraftDetails'));
const Funcionarios = React.lazy(() => import('./pages/Funcionarios/Funcionarios'));

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<Funcionario | null>(null);
  
  // O estado agora começa vazio e é preenchido pela API
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  
  // 3. (NOVO) Efeito para carregar dados iniciais da API
  useEffect(() => {
    // Só carrega os dados se o utilizador estiver logado
    if (isAuthenticated) {
      
      // Busca aeronaves
      api.apiListarAeronaves()
        .then(data => setAeronaves(data))
        .catch(err => console.error("Erro ao carregar aeronaves:", err));

      // Busca funcionários (apenas se for ADMIN)
      if (currentUser?.nivelPermissao === NivelPermissao.ADMINISTRADOR) {
        api.apiListarFuncionarios()
          .then(data => setFuncionarios(data))
          .catch(err => console.error("Erro ao carregar funcionários:", err));
      }
    }
  }, [isAuthenticated, currentUser?.nivelPermissao]); // Re-executa se o login mudar


  // 4. (ATUALIZADO) Login agora usa API e pede senha
  const handleLogin = async (email: string, senha: string) => {
    try {
      const user = await api.apiLogin(email, senha);
      setCurrentUser(user);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error("Erro no login:", error);
      alert(`Erro no login: ${error.message}`);
    }
  };

  // 5. (ATUALIZADO) Funções de manipulação agora chamam a API
  const handleAdicionarAeronave = async (novaAeronave: Omit<Aeronave, 'id' | 'pecas' | 'etapas' | 'testes'>) => {
    try {
      const aeronaveCriada = await api.apiAdicionarAeronave(novaAeronave);
      // Adiciona a nova aeronave (vazia) ao estado local
      setAeronaves(estadoAnterior => [...estadoAnterior, { ...aeronaveCriada, pecas: [], etapas: [], testes: [] }]);
    } catch (error: any) {
      alert(`Erro ao adicionar aeronave: ${error.message}`);
    }
  };

  const handleAdicionarFuncionario = async (novoFuncionario: Omit<Funcionario, 'id'>) => {
    try {
      const funcionarioCriado = await api.apiAdicionarFuncionario(novoFuncionario);
      setFuncionarios(estadoAnterior => [...estadoAnterior, funcionarioCriado]);
    } catch (error: any) {
      alert(`Erro ao adicionar funcionário: ${error.message}`);
    }
  };

  const handleRemoverFuncionario = async (id: number) => {
    try {
      await api.apiRemoverFuncionario(id);
      setFuncionarios(estadoAnterior => estadoAnterior.filter(f => f.id !== id));
    } catch (error: any) {
      alert(`Erro ao remover funcionário: ${error.message}`);
    }
  };

  // Esta função de 'update' é complexa.
  // A página de Detalhes vai buscar os seus próprios dados,
  // mas quando voltarmos ao Dashboard, podemos querer os dados atualizados.
  // Por agora, vamos simplificar e deixar a página de Detalhes gerir o seu próprio estado.
  const handleUpdateAeronave = (aeronaveAtualizada: Aeronave) => {
    setAeronaves(estadoAnterior => 
      estadoAnterior.map(a => 
        a.id === aeronaveAtualizada.id ? aeronaveAtualizada : a
      )
    );
  };

  return (
    <Router>
      <Suspense fallback={<div className="loading-fullscreen">A carregar...</div>}>
        <Routes>
          <Route 
            path="/login" 
            // 6. (ATUALIZADO) Passa a função de login atualizada
            element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
          />
          
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard currentUser={currentUser!} aeronaves={aeronaves} onAdicionarAeronave={handleAdicionarAeronave} /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/aeronave/:codigo" 
            element={isAuthenticated ? (
                <AircraftDetails 
                  currentUser={currentUser!} 
                  // Não passamos mais aeronaves; a página vai buscar os seus dados
                  onUpdateAeronave={handleUpdateAeronave} 
                  todosFuncionarios={funcionarios} // Ainda precisamos disto para o modal
                />
              ) : <Navigate to="/login" />
            } 
          />
          
          <Route 
            path="/funcionarios" 
            element={isAuthenticated ? <Funcionarios currentUser={currentUser!} funcionarios={funcionarios} onAdicionarFuncionario={handleAdicionarFuncionario} onRemoverFuncionario={handleRemoverFuncionario} /> : <Navigate to="/login" />} 
          />
          
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;