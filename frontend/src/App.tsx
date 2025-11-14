import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';

import * as api from './services/api'; 

import { Aeronave } from './models/Aeronave';
import { Funcionario } from './models/Funcionario';
import { NivelPermissao } from './models/enums';
import './App.css';

const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard'));
const AircraftDetails = React.lazy(() => import('./pages/AircraftDetails/AircraftDetails'));
const Funcionarios = React.lazy(() => import('./pages/Funcionarios/Funcionarios'));

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<Funcionario | null>(null);
  
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  
  useEffect(() => {
    if (isAuthenticated) {
      api.apiListarAeronaves()
        .then((data: Aeronave[]) => setAeronaves(data))
        .catch((err: any) => console.error("Erro ao carregar aeronaves:", err)); 

      if (currentUser?.nivelPermissao === NivelPermissao.ADMINISTRADOR) {
        api.apiListarFuncionarios()
          .then((data: Funcionario[]) => setFuncionarios(data))
          .catch((err: any) => console.error("Erro ao carregar funcionários:", err));
      }
    }
  }, [isAuthenticated, currentUser?.nivelPermissao]); 
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
  const handleAdicionarAeronave = async (novaAeronave: Aeronave) => {
    try {
      const aeronaveCriada = await api.apiAdicionarAeronave({
        codigo: novaAeronave.codigo,
        modelo: novaAeronave.modelo,
        tipo: novaAeronave.tipo,
        capacidade: novaAeronave.capacidade,
        alcance: novaAeronave.alcance
      });
      
      setAeronaves(estadoAnterior => [
        ...estadoAnterior, 
        { ...aeronaveCriada, pecas: [], etapas: [], testes: [] } 
      ]);
    } catch (error: any) {
      alert(`Erro ao adicionar aeronave: ${error.message}`);
    }
  };
  const handleAdicionarFuncionario = async (novoFuncionario: Funcionario) => {
    try {
        if (!novoFuncionario.senha) {
            alert("Erro interno: A senha é obrigatória.");
            return;
        }
        const dataParaApi = {
            nome: novoFuncionario.nome,
            email: novoFuncionario.email,
            senha: novoFuncionario.senha, 
            nivelPermissao: novoFuncionario.nivelPermissao,
            telefone: novoFuncionario.telefone,
            endereco: novoFuncionario.endereco
        };
        const funcionarioCriado = await api.apiAdicionarFuncionario(dataParaApi);
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
            element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard currentUser={currentUser} aeronaves={aeronaves} onAdicionarAeronave={handleAdicionarAeronave} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/aeronave/:codigo" 
            element={isAuthenticated ? (
                <AircraftDetails 
                  currentUser={currentUser!} 
                  onUpdateAeronave={handleUpdateAeronave} 
                  todosFuncionarios={funcionarios} 
                />
              ) : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/funcionarios" 
            element={isAuthenticated ? <Funcionarios currentUser={currentUser} funcionarios={funcionarios} onAdicionarFuncionario={handleAdicionarFuncionario} onRemoverFuncionario={handleRemoverFuncionario} /> : <Navigate to="/login" />} 
          />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;