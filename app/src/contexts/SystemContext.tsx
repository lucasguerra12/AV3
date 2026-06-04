import { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react'; 
// Importe também o Funcionario e Peca para não quebrar outras páginas da AV2
import type { Aeronave, Funcionario, Peca } from '../domain/types'; 
import { api } from '../services/api';

interface SystemContextType {
  aeronaves: Aeronave[];
  carregando: boolean;
  recarregarDados: () => void;
  
  // Propriedades do sistema original (AV2) restauradas:
  usuarioLogado: Funcionario | null;
  login: (usuario: string, senha?: string) => boolean;
  logout: () => void;
  
  // Caso tenha tabelas de equipe/inventario no contexto:
  funcionarios: Funcionario[];
  pecas: Peca[];
}

export const SystemContext = createContext<SystemContextType>({} as SystemContextType);

export function useSystem() {
  return useContext(SystemContext);
}

export function SystemProvider({ children }: { children: ReactNode }) {
  // Estados da Aplicação
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [carregando, setCarregando] = useState(true);
  
  // Estado de Autenticação (Restaurado)
  const [usuarioLogado, setUsuarioLogado] = useState<Funcionario | null>(null);

  // Função que busca dados reais do MySQL (AV3)
  const carregarDados = async () => {
    setCarregando(true);
    try {
      const dados = await api.getAeronaves();
      setAeronaves(dados);
    } catch (error) {
      console.error("Erro ao buscar aeronaves da API", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // --- Funções de Autenticação (Restauradas) ---
  const login = (usuario: string, senha?: string) => {
    // Mock simplificado para permitir a entrada no sistema
    if (usuario) {
      setUsuarioLogado({
        id: '1',
        nome: 'Administrador (Logado)',
        telefone: '(00) 0000-0000',
        endereco: 'Sede Aerocode',
        usuario: usuario,
        nivelPermissao: 'ADMINISTRADOR'
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUsuarioLogado(null);
  };

  return (
    <SystemContext.Provider value={{ 
      aeronaves, 
      carregando, 
      recarregarDados: carregarDados,
      usuarioLogado,
      login,
      logout,
      funcionarios,
      pecas
    }}>
      {children}
    </SystemContext.Provider>
  );
}