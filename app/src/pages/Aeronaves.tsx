import { useState } from 'react';
import { useSystem } from '../contexts/SystemContext';
import { useNavigate } from 'react-router-dom';
import type { TipoAeronave, Aeronave } from '../domain/types';

export function Aeronaves() {
  const navigate = useNavigate();
  const { aeronaves, registrarAeronave, atualizarAeronave, removerAeronave , usuarioLogado} = useSystem();
  const isAdmin = usuarioLogado?.nivelPermissao === 'ADMINISTRADOR';  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [codigo, setCodigo] = useState('');
  const [modelo, setModelo] = useState('');
  const [tipo, setTipo] = useState<TipoAeronave>('COMERCIAL');
  const [capacidade, setCapacidade] = useState('');
  const [alcance, setAlcance] = useState('');

  const handleAbrirNovo = () => {
    setCodigo(''); setModelo(''); setCapacidade(''); setAlcance(''); setTipo('COMERCIAL');
    setIsEditMode(false);
    setIsDrawerOpen(true);
  };

  const handleAbrirEdicao = (aero: Aeronave) => {
    setCodigo(aero.codigo);
    setModelo(aero.modelo);
    setTipo(aero.tipo);
    setCapacidade(aero.capacidade.toString());
    setAlcance(aero.alcance.toString());
    setIsEditMode(true);
    setIsDrawerOpen(true);
  };

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo || !modelo) return;
    
    if (isEditMode) {
      atualizarAeronave(codigo, { modelo, tipo, capacidade: Number(capacidade) || 0, alcance: Number(alcance) || 0 });
    } else {
      registrarAeronave({ codigo, modelo, tipo, capacidade: Number(capacidade) || 0, alcance: Number(alcance) || 0, pecas: [], etapas: [], testes: [] });
    }
    
    setIsDrawerOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background relative font-body">
      <header className="h-16 border-b border-outline-variant/20 bg-background/80 backdrop-blur flex items-center justify-between px-8 sticky top-0 z-10">
        <h2 className="text-lg font-bold text-on-surface font-headline uppercase tracking-tighter">Registo da Frota</h2>
      </header>

      <main className="p-8">
        <div className="flex justify-between items-end mb-10">
          <h1 className="text-4xl font-headline font-bold text-on-surface tracking-tight uppercase">Aeronaves</h1>
          {isAdmin && (
            <button onClick={handleAbrirNovo} className="bg-primary/10 text-primary border border-primary/30 px-6 py-2.5 rounded-sm font-bold text-xs tracking-widest hover:bg-primary hover:text-background transition-all flex items-center gap-2 font-headline uppercase">
              <span className="material-symbols-outlined text-lg">add</span> Nova Aeronave
            </button>
          )}
        </div>

        <div className="bg-surface-low rounded-sm border border-outline-variant/20 shadow-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-surface-container/30 border-b border-outline-variant/20">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surfaceVariant uppercase tracking-widest font-label">Código</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surfaceVariant uppercase tracking-widest font-label">Modelo</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surfaceVariant uppercase tracking-widest font-label text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {aeronaves.map((aero) => (
                <tr key={aero.codigo} className="hover:bg-surface-highest/20 transition-colors group">
                  <td className="px-6 py-5 font-headline font-bold text-primary tracking-widest uppercase">{aero.codigo}</td>
                  <td className="px-6 py-5 text-sm text-on-surface">{aero.modelo}</td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => navigate(`/aeronaves/${aero.codigo}`)} className="...">
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </button>
                      {isAdmin && (
                      <>
                        <button onClick={() => handleAbrirEdicao(aero)} className="...">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button onClick={() => { if(confirm(`Remover?`)) removerAeronave(aero.codigo); }} className="...">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </>
                    )}
                  </div>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {isDrawerOpen && (
        <>
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60]" onClick={() => setIsDrawerOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-surface-low border-l border-outline-variant/20 z-[70] p-8 flex flex-col">
            <h2 className="text-2xl font-headline font-bold text-on-surface mb-6 uppercase">{isEditMode ? 'Editar Aeronave' : 'Registo do Vault'}</h2>
            <form onSubmit={handleSalvar} className="space-y-6 flex-1">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surfaceVariant uppercase tracking-widest font-label">Código do Ativo</label>
                <input required disabled={isEditMode} value={codigo} onChange={e => setCodigo(e.target.value)} className="w-full bg-background border border-outline-variant/20 rounded-sm py-3 px-4 focus:border-primary text-primary font-headline uppercase disabled:opacity-50" placeholder="EX: KV-001" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surfaceVariant uppercase tracking-widest font-label">Modelo</label>
                <input required value={modelo} onChange={e => setModelo(e.target.value)} className="w-full bg-background border border-outline-variant/20 rounded-sm py-3 px-4 text-on-surface" placeholder="Lockheed Martin SR-71" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surfaceVariant uppercase tracking-widest font-label">Tipo de Registro</label>
                <select value={tipo} onChange={e => setTipo(e.target.value as TipoAeronave)} className="w-full bg-background border border-outline-variant/20 rounded-sm py-3 px-4 text-primary font-headline uppercase">
                  <option value="COMERCIAL">Comercial</option>
                  <option value="MILITAR">Militar</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-on-surfaceVariant uppercase tracking-widest font-label">Capacidade</label>
                  <input required type="number" value={capacidade} onChange={e => setCapacidade(e.target.value)} className="w-full bg-background border border-outline-variant/20 rounded-sm py-3 px-4 text-on-surface" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-on-surfaceVariant uppercase tracking-widest font-label">Alcance (km)</label>
                  <input required type="number" value={alcance} onChange={e => setAlcance(e.target.value)} className="w-full bg-background border border-outline-variant/20 rounded-sm py-3 px-4 text-on-surface" />
                </div>
              </div>
              <div className="flex gap-4 mt-auto">
                <button type="button" onClick={() => setIsDrawerOpen(false)} className="flex-1 py-3 text-[11px] font-bold uppercase tracking-widest text-on-surfaceVariant hover:text-primary transition-colors border border-outline-variant/30 rounded-sm font-headline">Cancelar</button>
                <button type="submit" className="flex-1 py-3 bg-primary text-background uppercase text-[11px] font-bold font-headline rounded-sm shadow-md">{isEditMode ? 'Salvar Edição' : 'Confirmar Registo'}</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}