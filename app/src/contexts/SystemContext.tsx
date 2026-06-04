import { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import type { Aeronave, Funcionario, Peca, TipoTeste, StatusEtapa, ResultadoTeste } from '../domain/types'; 
import { api } from '../services/api';

export interface PecaInventario extends Peca {
  aeronaveDestino?: string | null;
  codigo: string;
}

interface SystemContextType {
  aeronaves: Aeronave[]; inventario: PecaInventario[]; equipe: Funcionario[]; logs: any[];
  carregando: boolean; usuarioLogado: Funcionario | null;
  login: (u: string, s?: string) => boolean; logout: () => void; recarregarDados: () => void;
  registrarAeronave: (a: Aeronave) => void; atualizarAeronave: (id: string, d: any) => void; removerAeronave: (id: string) => void;
  registrarPeca: (p: any) => void; atualizarPeca: (id: string, d: any) => void; removerPeca: (id: string) => void;
  vincularPeca: (pId: string, aId: string) => void; desvincularPeca: (pId: string) => void;
  adicionarEtapa: (aId: string, n: string, p: string) => void; removerEtapa: (aId: string, eId: string) => void;
  atualizarStatusEtapa: (aId: string, eId: string, s: StatusEtapa) => void; alocarFuncionario: (aId: string, eId: string, fId: string) => void;
  adicionarTeste: (aId: string, n: string, d: string, t: TipoTeste) => void; removerTeste: (aId: string, tId: string) => void;
  atualizarResultadoTeste: (aId: string, tId: string, r: ResultadoTeste) => void;
}

export const SystemContext = createContext<SystemContextType>({} as SystemContextType);
export const useSystem = () => useContext(SystemContext);

export function SystemProvider({ children }: { children: ReactNode }) {
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([]);
  const [inventario, setInventario] = useState<PecaInventario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [usuarioLogado, setUsuarioLogado] = useState<Funcionario | null>(null);

  const equipe: Funcionario[] = [
    { id: '1', nome: 'Eng. Chefe', telefone: '1199', endereco: 'SJC', usuario: 'admin', nivelPermissao: 'ADMINISTRADOR' },
    { id: '2', nome: 'Operador Alfa', telefone: '1188', endereco: 'SJC', usuario: 'op', nivelPermissao: 'OPERADOR' }
  ];

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const dbAeronaves = await api.getAeronaves();
      const dbPecas = await api.getPecas();
      if(Array.isArray(dbAeronaves)) setAeronaves(dbAeronaves);
      if(Array.isArray(dbPecas)) setInventario(dbPecas);
    } catch (e) {} finally { setCarregando(false); }
  };

  useEffect(() => { carregarDados(); }, []);

  const login = (usuario: string) => { if (usuario) { setUsuarioLogado(equipe[0]); return true; } return false; };
  const logout = () => setUsuarioLogado(null);

  // --- CRUD Aeronaves ---
  const registrarAeronave = async (nova: Aeronave) => {
    setAeronaves(prev => [...prev, { ...nova, pecas: [], etapas: [], testes: [] }]);
    await api.createAeronave(nova);
  };
  const atualizarAeronave = async (codigo: string, dados: any) => {
    setAeronaves(prev => prev.map(a => a.codigo === codigo ? { ...a, ...dados } : a));
    await api.updateAeronave(codigo, dados);
  };
  const removerAeronave = async (codigo: string) => {
    setAeronaves(prev => prev.filter(a => a.codigo !== codigo));
    await api.deleteAeronave(codigo);
  };

  // --- CRUD Peças ---
  const registrarPeca = async (dados: any) => {
    const nova = { ...dados, id: Math.random().toString(), codigo: Math.random().toString(36).substr(2, 6).toUpperCase() };
    setInventario(prev => [...prev, nova]);
    await api.createPeca(nova);
  };
  const atualizarPeca = async (codigo: string, dados: any) => {
    setInventario(prev => prev.map(p => p.codigo === codigo ? { ...p, ...dados } : p));
    await api.updatePeca(codigo, dados);
  };
  const removerPeca = async (codigo: string) => {
    setInventario(prev => prev.filter(p => p.codigo !== codigo));
    await api.deletePeca(codigo);
  };
  const vincularPeca = (p: string, a: string) => atualizarPeca(p, { aeronaveDestino: a });
  const desvincularPeca = (p: string) => atualizarPeca(p, { aeronaveDestino: null });

  // --- Funções de Detalhes (Etapas e Testes) - Estado Local Imobilizado para UI funcionar instantaneamente ---
  const adicionarEtapa = (aId: string, nome: string, prazo: string) => {
    setAeronaves(prev => prev.map(a => a.codigo === aId ? { ...a, etapas: [...a.etapas, { id: Math.random().toString(), nome, prazo, status: 'PENDENTE', funcionariosAlocados: [] }] } : a));
  };
  const removerEtapa = (aId: string, eId: string) => {
    setAeronaves(prev => prev.map(a => a.codigo === aId ? { ...a, etapas: a.etapas.filter(e => e.id !== eId) } : a));
  };
  const atualizarStatusEtapa = (aId: string, eId: string, status: StatusEtapa) => {
    setAeronaves(prev => prev.map(a => a.codigo === aId ? { ...a, etapas: a.etapas.map(e => e.id === eId ? { ...e, status } : e) } : a));
  };
  const alocarFuncionario = (aId: string, eId: string, fId: string) => {
    const func = equipe.find(f => f.id === fId);
    if(func) setAeronaves(prev => prev.map(a => a.codigo === aId ? { ...a, etapas: a.etapas.map(e => e.id === eId ? { ...e, funcionariosAlocados: [...e.funcionariosAlocados, func] } : e) } : a));
  };
  const adicionarTeste = (aId: string, nome: string, dataValidade: string, tipo: TipoTeste) => {
    setAeronaves(prev => prev.map(a => a.codigo === aId ? { ...a, testes: [...a.testes, { id: Math.random().toString(), nome, tipo, dataValidade, resultado: null }] } : a));
  };
  const removerTeste = (aId: string, tId: string) => {
    setAeronaves(prev => prev.map(a => a.codigo === aId ? { ...a, testes: a.testes.filter(t => t.id !== tId) } : a));
  };
  const atualizarResultadoTeste = (aId: string, tId: string, resultado: ResultadoTeste) => {
    setAeronaves(prev => prev.map(a => a.codigo === aId ? { ...a, testes: a.testes.map(t => t.id === tId ? { ...t, resultado } : t) } : a));
  };

  return (
    <SystemContext.Provider value={{
      aeronaves, inventario, equipe, logs: [], carregando, usuarioLogado,
      login, logout, recarregarDados: carregarDados,
      registrarAeronave, atualizarAeronave, removerAeronave,
      registrarPeca, atualizarPeca, removerPeca, vincularPeca, desvincularPeca,
      adicionarEtapa, removerEtapa, atualizarStatusEtapa, alocarFuncionario,
      adicionarTeste, removerTeste, atualizarResultadoTeste
    }}>
      {children}
    </SystemContext.Provider>
  );
}