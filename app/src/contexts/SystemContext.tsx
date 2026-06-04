import { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react'; // CORREÇÃO 1: Importação exclusiva de tipo
import type { Aeronave, Funcionario, Peca } from '../domain/types'; 
import { api } from '../services/api';

interface SystemContextType {
  aeronaves: Aeronave[];
  carregando: boolean;
  recarregarDados: () => void;
  usuarioLogado: Funcionario | null;
  login: (usuario: string, senha?: string) => boolean;
  logout: () => void;
  funcionarios: Funcionario[];
  pecas: Peca[];
  logs: any[];
  inventario: Peca[];
}

export const SystemContext = createContext<SystemContextType>({} as SystemContextType);

export function useSystem() {
  return useContext(SystemContext);
}

export function SystemProvider({ children }: { children: ReactNode }) {
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([]);
  
  // CORREÇÃO 2: Removido setFuncionarios e setPecas para evitar erro de "variável não lida"
  const [funcionarios] = useState<Funcionario[]>([]);
  const [pecas] = useState<Peca[]>([]);
  
  const [carregando, setCarregando] = useState(true);
  const [usuarioLogado, setUsuarioLogado] = useState<Funcionario | null>(null);

  // Mock de Logs para a Dashboard funcionar
  const logsMock = [
    { id: 1, time: new Date().toLocaleTimeString(), tag: 'DB', color: 'bg-emerald-500/20 text-emerald-500', text: 'Conexão Prisma/MySQL estabelecida.' },
    { id: 2, time: new Date().toLocaleTimeString(), tag: 'SYS', color: 'bg-blue-500/20 text-blue-500', text: 'Módulos da AV3 ativados com sucesso.' }
  ];

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const dados = await api.getAeronaves();
      if(Array.isArray(dados)) {
        setAeronaves(dados);
      }
    } catch (error) {
      console.error("Erro ao buscar aeronaves da API", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // CORREÇÃO 3: O uso do underline (_senha) diz ao TypeScript para ignorar que a variável não está sendo lida na função
  const login = (usuario: string, _senha?: string) => {
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
      pecas,
      logs: logsMock,
      inventario: pecas
    }}>
      {children}
    </SystemContext.Provider>
  );
}