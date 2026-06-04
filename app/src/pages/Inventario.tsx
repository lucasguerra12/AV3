import { useState } from 'react';
import { useSystem, type PecaInventario } from '../contexts/SystemContext';
import type { StatusPeca, TipoPeca } from '../domain/types';

export function Inventario() {
  const { inventario, aeronaves, usuarioLogado, registrarPeca, atualizarPeca, removerPeca } = useSystem();
  
  const podeEditar = usuarioLogado?.nivelPermissao === 'ADMINISTRADOR' || usuarioLogado?.nivelPermissao === 'ENGENHEIRO';
  const isAdmin = usuarioLogado?.nivelPermissao === 'ADMINISTRADOR';
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<TipoPeca>('NACIONAL');
  const [fornecedor, setFornecedor] = useState('');
  const [status, setStatus] = useState<StatusPeca>('EM_PRODUCAO');
  const [aeronaveDestino, setAeronaveDestino] = useState('');

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    const dados = { codigo, nome, tipo, fornecedor, status, aeronaveDestino: aeronaveDestino || null };
    isEditMode ? atualizarPeca(codigo, dados) : registrarPeca(dados);
    setIsDrawerOpen(false);
  };

  const handleAbrirEdicao = (peca: PecaInventario) => {
    setCodigo(peca.codigo); setNome(peca.nome); setTipo(peca.tipo);
    setFornecedor(peca.fornecedor); setStatus(peca.status); setAeronaveDestino(peca.aeronaveDestino || '');
    setIsEditMode(true); setIsDrawerOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background relative font-body">
      <header className="h-16 border-b border-outline-variant/20 bg-background/80 backdrop-blur flex items-center justify-between px-8 sticky top-0 z-10">
        <h2 className="text-lg font-black tracking-widest text-primary font-headline uppercase">INVENTORY_LOGISTICS_V1</h2>
        {podeEditar && (
          <button onClick={() => { setIsEditMode(false); setCodigo(''); setNome(''); setAeronaveDestino(''); setIsDrawerOpen(true); }} className="bg-primary text-background px-6 py-2 rounded-sm font-bold text-xs uppercase font-headline">Receber Lote</button>
        )}
      </header>

      <main className="p-8">
        <div className="bg-surface-low border border-outline-variant/20 rounded-sm overflow-hidden shadow-lg">
          <table className="w-full text-left">
            <thead className="bg-surface-container-highest/30">
              <tr>
                <th className="p-5 text-[10px] uppercase tracking-widest font-bold text-on-surfaceVariant">Componente</th>
                <th className="p-5 text-[10px] uppercase tracking-widest font-bold text-on-surfaceVariant">Status / Origem</th>
                <th className="p-5 text-[10px] uppercase tracking-widest font-bold text-on-surfaceVariant text-right">Destino / Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {inventario.map(peca => (
                <tr key={peca.codigo} className="hover:bg-surface-highest/20 transition-colors group">
                  <td className="p-5">
                    <p className="font-bold text-on-surface">{peca.nome}</p>
                    <p className="text-[10px] text-primary uppercase font-mono">{peca.codigo}</p>
                  </td>
                  <td className="p-5">
                    <div className="flex gap-2 items-center">
                      <span className="bg-primary/10 text-primary border border-primary/20 text-[9px] px-2 py-0.5 font-bold rounded-sm uppercase">{peca.status}</span>
                      <span className="text-[9px] text-outline-variant font-mono uppercase">{peca.tipo}</span>
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <span className="text-[10px] font-headline font-bold text-primary">{peca.aeronaveDestino || 'ESTOQUE LIVRE'}</span>
                      {podeEditar && <button onClick={() => handleAbrirEdicao(peca)} className="text-on-surfaceVariant hover:text-primary opacity-0 group-hover:opacity-100"><span className="material-symbols-outlined text-[18px]">edit</span></button>}
                      {isAdmin && <button onClick={() => { if(confirm('Remover peça?')) removerPeca(peca.codigo); }} className="text-on-surfaceVariant hover:text-error opacity-0 group-hover:opacity-100"><span className="material-symbols-outlined text-[18px]">delete</span></button>}
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
            <h2 className="text-2xl font-headline font-bold text-on-surface mb-6 uppercase">{isEditMode ? 'Editar Lote' : 'Recepção Logística'}</h2>
            <form onSubmit={handleSalvar} className="space-y-6 flex-1 overflow-y-auto">
              <input required disabled={isEditMode} value={codigo} onChange={e => setCodigo(e.target.value)} className="w-full bg-background border border-outline-variant/20 p-3 rounded-sm text-primary font-headline uppercase disabled:opacity-50" placeholder="SKU/Código" />
              <input required value={nome} onChange={e => setNome(e.target.value)} className="w-full bg-background border border-outline-variant/20 p-3 rounded-sm text-on-surface" placeholder="Nome do Componente" />
              <input required value={fornecedor} onChange={e => setFornecedor(e.target.value)} className="w-full bg-background border border-outline-variant/20 p-3 rounded-sm text-on-surface" placeholder="Fornecedor" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-on-surfaceVariant uppercase">Origem / Tipo da Peça</label>
                  <select value={tipo} onChange={e => setTipo(e.target.value as TipoPeca)} className="w-full bg-background border border-outline-variant/20 p-3 rounded-sm text-primary font-headline uppercase text-xs">
                    <option value="NACIONAL">Nacional</option><option value="IMPORTADA">Importada</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-on-surfaceVariant uppercase">Status Operacional</label>
                  <select value={status} onChange={e => setStatus(e.target.value as StatusPeca)} className="w-full bg-background border border-outline-variant/20 p-3 rounded-sm text-primary font-headline uppercase text-xs">
                    <option value="EM_PRODUCAO">Em Produção</option><option value="EM_TRANSPORTE">Em Transporte</option><option value="PRONTA">Pronta</option><option value="MANUTENCAO">Manutenção</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surfaceVariant uppercase">Aeronave Destino</label>
                <select value={aeronaveDestino} onChange={e => setAeronaveDestino(e.target.value)} className="w-full bg-background border border-outline-variant/20 p-3 rounded-sm text-on-surface uppercase text-xs">
                  <option value="">ESTOQUE LIVRE</option>
                  {aeronaves.map(a => <option key={a.codigo} value={a.codigo}>{a.codigo}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full py-3 bg-primary text-background uppercase font-bold text-[11px] mt-4 shadow-lg">Confirmar Operação</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}