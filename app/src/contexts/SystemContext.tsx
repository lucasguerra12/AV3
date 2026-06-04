import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Aeronave, StatusEtapa, ResultadoTeste, TipoTeste, StatusPeca, Funcionario, TipoPeca } from '../domain/types';
import { mockAeronaves, mockFuncionarios } from '../infrastructure/mocks';

export interface SystemLog { id: number; time: string; tag: string; color: string; text: string; }
export interface PecaInventario { codigo: string; nome: string; tipo: TipoPeca; fornecedor: string; status: StatusPeca; aeronaveDestino?: string | null; }

interface SystemContextData {
  aeronaves: Aeronave[]; logs: SystemLog[]; inventario: PecaInventario[]; equipe: Funcionario[];
  usuarioLogado: Funcionario | null;
  login: (usuario: string, senha: string) => boolean; logout: () => void;
  adicionarMembroEquipe: (membro: Omit<Funcionario, 'id'>) => void; removerMembroEquipe: (id: string) => void;
  registrarAeronave: (novaAeronave: Aeronave) => void; atualizarAeronave: (codigo: string, dados: Partial<Aeronave>) => void; removerAeronave: (codigo: string) => void;
  registrarPeca: (novaPeca: PecaInventario) => void; atualizarPeca: (codigo: string, dados: Partial<PecaInventario>) => void; removerPeca: (codigo: string) => void;
  vincularPeca: (codigoPeca: string, codigoAeronave: string) => void; desvincularPeca: (codigoPeca: string) => void;
  atualizarStatusEtapa: (codigoAeronave: string, idEtapa: string, novoStatus: StatusEtapa) => void; 
  alocarFuncionario: (codigoAeronave: string, idEtapa: string, idFuncionario: string) => void;
  atualizarResultadoTeste: (codigoAeronave: string, idTeste: string, resultado: ResultadoTeste) => void;
  adicionarEtapa: (codigoAeronave: string, nome: string, prazo: string) => void; adicionarTeste: (codigoAeronave: string, nome: string, dataValidade: string, tipo: TipoTeste) => void;
  removerEtapa: (codigoAeronave: string, idEtapa: string) => void; removerTeste: (codigoAeronave: string, idTeste: string) => void; adicionarLog: (tag: string, color: string, text: string) => void;
}

const SystemContext = createContext<SystemContextData>({} as SystemContextData);

const mockInventario: PecaInventario[] = [
  { codigo: 'PRP-902', nome: 'Motor GE9X', tipo: 'IMPORTADA', fornecedor: 'GE Aviation', status: 'PRONTA', aeronaveDestino: 'KV-001' }
];

export function SystemProvider({ children }: { children: ReactNode }) {
  const [aeronaves, setAeronaves] = useState<Aeronave[]>(() => { const saved = localStorage.getItem('ac_aeronaves'); return saved ? JSON.parse(saved) : mockAeronaves; });
  const [logs, setLogs] = useState<SystemLog[]>(() => { const saved = localStorage.getItem('ac_logs'); return saved ? JSON.parse(saved) : []; });
  const [inventario, setInventario] = useState<PecaInventario[]>(() => { const saved = localStorage.getItem('ac_inventario'); return saved ? JSON.parse(saved) : mockInventario; });
  const [equipe, setEquipe] = useState<Funcionario[]>(() => { const saved = localStorage.getItem('ac_equipe'); return saved ? JSON.parse(saved) : mockFuncionarios; });
  const [usuarioLogado, setUsuarioLogado] = useState<Funcionario | null>(() => { const saved = localStorage.getItem('ac_usuario'); return saved ? JSON.parse(saved) : null; });

  useEffect(() => {
    localStorage.setItem('ac_aeronaves', JSON.stringify(aeronaves));
    localStorage.setItem('ac_inventario', JSON.stringify(inventario));
    localStorage.setItem('ac_equipe', JSON.stringify(equipe));
    localStorage.setItem('ac_logs', JSON.stringify(logs));
    localStorage.setItem('ac_usuario', JSON.stringify(usuarioLogado));
  }, [aeronaves, inventario, equipe, logs, usuarioLogado]);

  const getTime = () => { const now = new Date(); return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`; };
  const adicionarLog = (tag: string, color: string, text: string) => { setLogs(prev => [{ id: Date.now(), time: getTime(), tag, color, text }, ...prev].slice(0, 15)); };

  const login = (usuario: string, senha: string) => {
    const user = equipe.find(f => f.usuario === usuario && f.senha === senha);
    if (user) { setUsuarioLogado(user); adicionarLog('ACESSO', 'bg-primary/20 text-primary', `Usuário ${user.usuario} autenticado.`); return true; }
    return false;
  };

  const logout = () => { if (usuarioLogado) adicionarLog('ACESSO', 'bg-outline-variant/30 text-on-surfaceVariant', `Usuário ${usuarioLogado.usuario} encerrou a sessão.`); setUsuarioLogado(null); };

  const adicionarMembroEquipe = (membro: Omit<Funcionario, 'id'>) => { 
    if (equipe.some(f => f.usuario === membro.usuario)) { alert(`O usuário @${membro.usuario} já existe.`); return; }
    setEquipe(prev => [...prev, { ...membro, id: `f-${Date.now()}` }]); adicionarLog('SEGURANÇA', 'bg-secondary/20 text-secondary', `Credencial gerada para ${membro.nome}.`); 
  };
  
  const removerMembroEquipe = (id: string) => { setEquipe(prev => prev.filter(f => f.id !== id)); adicionarLog('ALERTA', 'bg-[#ef4444]/20 text-[#ef4444]', `Credencial revogada.`); };

  const registrarAeronave = (a: Aeronave) => { 
    if (aeronaves.some(aero => aero.codigo === a.codigo)) { alert(`Aeronave ${a.codigo} já registada.`); return; }
    setAeronaves(p => [a, ...p]); adicionarLog('FROTA', 'bg-primary-container text-primary', `Ativo ${a.codigo} registado.`); 
  };
  
  const atualizarAeronave = (c: string, d: Partial<Aeronave>) => { setAeronaves(p => p.map(a => a.codigo === c ? { ...a, ...d } : a)); };
  const removerAeronave = (c: string) => { 
    setAeronaves(p => p.filter(a => a.codigo !== c)); 
    setInventario(prev => prev.map(p => p.aeronaveDestino === c ? { ...p, aeronaveDestino: null } : p));
    adicionarLog('ALERTA', 'bg-[#ef4444]/20 text-[#ef4444]', `Ativo ${c} removido e peças devolvidas ao estoque.`); 
  };
  
  const registrarPeca = (p: PecaInventario) => { setInventario(pr => [p, ...pr]); adicionarLog('LOGÍSTICA', 'bg-[#1b2e36] text-[#b5cad4]', `Componente ${p.codigo} adicionado.`); };
  const atualizarPeca = (c: string, d: Partial<PecaInventario>) => { setInventario(p => p.map(i => i.codigo === c ? { ...i, ...d } : i)); };
  const removerPeca = (c: string) => { setInventario(p => p.filter(i => i.codigo !== c)); };
  const vincularPeca = (cp: string, ca: string) => { setInventario(prev => prev.map(p => p.codigo === cp ? { ...p, aeronaveDestino: ca } : p)); };
  const desvincularPeca = (cp: string) => { setInventario(prev => prev.map(p => p.codigo === cp ? { ...p, aeronaveDestino: null } : p)); };
  const atualizarStatusEtapa = (ca: string, ie: string, ns: StatusEtapa) => { setAeronaves(prev => prev.map(aero => aero.codigo !== ca ? aero : { ...aero, etapas: aero.etapas.map(e => e.id === ie ? { ...e, status: ns } : e) })); };
  const atualizarResultadoTeste = (ca: string, it: string, res: ResultadoTeste) => { setAeronaves(prev => prev.map(aero => aero.codigo !== ca ? aero : { ...aero, testes: aero.testes.map(t => t.id === it ? { ...t, resultado: res } : t) })); };
  const adicionarEtapa = (ca: string, n: string, p: string) => { setAeronaves(prev => prev.map(aero => aero.codigo !== ca ? aero : { ...aero, etapas: [...aero.etapas, { id: `e-${Date.now()}`, nome: n, prazo: p, status: 'PENDENTE', funcionariosAlocados: [] }] })); };
  const adicionarTeste = (ca: string, n: string, v: string, t: TipoTeste) => { setAeronaves(prev => prev.map(aero => aero.codigo !== ca ? aero : { ...aero, testes: [...aero.testes, { id: `t-${Date.now()}`, nome: n, dataValidade: v, tipo: t, resultado: null }] })); };
  const removerEtapa = (ca: string, ie: string) => { setAeronaves(prev => prev.map(aero => aero.codigo !== ca ? aero : { ...aero, etapas: aero.etapas.filter(e => e.id !== ie) })); };
  const removerTeste = (ca: string, it: string) => { setAeronaves(prev => prev.map(aero => aero.codigo !== ca ? aero : { ...aero, testes: aero.testes.filter(t => t.id !== it) })); };

  const alocarFuncionario = (codigoAeronave: string, idEtapa: string, idFuncionario: string) => {
    const funcionario = equipe.find(f => f.id === idFuncionario);
    if (!funcionario) return;
    setAeronaves(prev => prev.map(aero => {
      if (aero.codigo !== codigoAeronave) return aero;
      return {
        ...aero, etapas: aero.etapas.map(e => {
          if (e.id === idEtapa) {
            if (e.funcionariosAlocados.some(f => f.id === idFuncionario)) return e;
            return { ...e, funcionariosAlocados: [...e.funcionariosAlocados, funcionario] };
          }
          return e;
        })
      };
    }));
  };

  useEffect(() => { adicionarLog('SIST', 'bg-surface-highest text-on-surface', 'Sistema Kinetic Vault iniciado.'); }, []);

  return (
    <SystemContext.Provider value={{ 
      aeronaves, logs, inventario, equipe, usuarioLogado, login, logout, adicionarMembroEquipe, removerMembroEquipe,
      registrarAeronave, atualizarAeronave, removerAeronave, registrarPeca, atualizarPeca, removerPeca, vincularPeca, desvincularPeca,
      atualizarStatusEtapa, atualizarResultadoTeste, adicionarEtapa, adicionarTeste, removerEtapa, removerTeste, alocarFuncionario, adicionarLog 
    }}>
      {children}
    </SystemContext.Provider>
  );
}

export const useSystem = () => useContext(SystemContext);