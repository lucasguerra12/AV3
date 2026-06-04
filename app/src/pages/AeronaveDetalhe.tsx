import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSystem } from '../contexts/SystemContext';
import type { TipoTeste } from '../domain/types';

export function AeronaveDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    aeronaves, inventario, equipe, usuarioLogado, vincularPeca, desvincularPeca, 
    atualizarStatusEtapa, atualizarResultadoTeste, adicionarEtapa, adicionarTeste,
    removerEtapa, removerTeste, alocarFuncionario
  } = useSystem();

  const [isEtapaModalOpen, setIsEtapaModalOpen] = useState(false);
  const [isTesteModalOpen, setIsTesteModalOpen] = useState(false);
  const [isVincularModalOpen, setIsVincularModalOpen] = useState(false);

  const [novaEtapaNome, setNovaEtapaNome] = useState('');
  const [novaEtapaPrazo, setNovaEtapaPrazo] = useState('');
  const [novoTesteNome, setNovoTesteNome] = useState('');
  const [novoTesteData, setNovoTesteData] = useState('');
  const [novoTesteTipo, setNovoTesteTipo] = useState<TipoTeste>('ELETRICO');
  const [pecaSelecionada, setPecaSelecionada] = useState('');
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<{ [idEtapa: string]: string }>({});

  const aeronave = aeronaves.find(a => a.codigo === id);
  if (!aeronave) return <div className="p-8 text-error">Aeronave não encontrada.</div>;

  const pecasAlocadas = inventario.filter(p => p.aeronaveDestino === id);
  const pecasDisponiveis = inventario.filter(p => !p.aeronaveDestino && p.status === 'PRONTA');
  const etapasTotal = aeronave.etapas.length;
  const integridade = etapasTotal === 0 ? 0 : Math.round((aeronave.etapas.filter(e => e.status === 'CONCLUIDA').length / etapasTotal) * 100);
  const possuiTestes = aeronave.testes.length > 0;
  const todosTestesAprovados = possuiTestes && aeronave.testes.every(t => t.resultado === 'APROVADO');
  const aeronaveProntaParaEntrega = integridade === 100 && todosTestesAprovados;

  const handleCriarEtapa = (e: React.FormEvent) => { e.preventDefault(); if (novaEtapaNome) { adicionarEtapa(aeronave.codigo, novaEtapaNome, novaEtapaPrazo); setNovaEtapaNome(''); setNovaEtapaPrazo(''); setIsEtapaModalOpen(false); } };
  const handleCriarTeste = (e: React.FormEvent) => { e.preventDefault(); if (novoTesteNome && novoTesteData) { adicionarTeste(aeronave.codigo, novoTesteNome, novoTesteData, novoTesteTipo); setNovoTesteNome(''); setNovoTesteData(''); setIsTesteModalOpen(false); } };
  const handleVincular = () => { if (pecaSelecionada) { vincularPeca(pecaSelecionada, aeronave.codigo); setIsVincularModalOpen(false); setPecaSelecionada(''); } };

  return (
    <div className="flex flex-col min-h-screen bg-background font-body pb-12">
      <header className="flex justify-between items-center w-full px-8 py-4 border-b border-outline-variant/20 sticky top-0 z-40 bg-background/80 backdrop-blur">
        <button onClick={() => navigate('/aeronaves')} className="text-on-surfaceVariant hover:text-primary transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">Painel da Frota</span>
        </button>
        <div className="flex items-center gap-4">
          <span className="text-lg font-black text-primary font-headline uppercase tracking-widest">AIRCRAFT_CONTROL_{aeronave.codigo}</span>
                    {aeronaveProntaParaEntrega && (
            <button onClick={() => navigate(`/aeronaves/${aeronave.codigo}/relatorio`)} className="ml-4 bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/50 px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase hover:bg-[#10b981] hover:text-background transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              Gerar Relatório Final
            </button>
          )}
        </div>
      </header>

      <main className="p-8 space-y-12">
        <section className="bg-surface-container/50 p-6 rounded-sm border-l-4 border-primary shadow-md">
          <p className="text-[10px] font-bold text-on-surfaceVariant uppercase tracking-widest mb-2">Integridade da Montagem</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-headline text-primary">{integridade}</span><span className="text-xs text-on-surfaceVariant uppercase">%</span>
          </div>
          <div className="mt-4 h-1 w-full bg-surface-highest rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${integridade}%` }}></div>
          </div>
          
          {!todosTestesAprovados && integridade === 100 && (
            <p className="text-[10px] text-error uppercase font-bold tracking-widest mt-4 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">warning</span> Entrega bloqueada. Pendente aprovação na Qualidade (Testes).
            </p>
          )}
        </section>

        {/* ETAPAS */}
        <section>
          <div className="flex justify-between items-center mb-6 border-b border-outline-variant/20 pb-2">
            <h3 className="text-xl font-bold font-headline uppercase tracking-tighter">Linha de Produção</h3>
            <button onClick={() => setIsEtapaModalOpen(true)} className="bg-primary/10 text-primary border border-primary/30 px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase">Adicionar Etapa</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aeronave.etapas.map((etapa, index) => {
              const anterior = index > 0 ? aeronave.etapas[index - 1] : null;
              const bloqueada = anterior && anterior.status !== 'CONCLUIDA';
              const statusReal = (bloqueada && etapa.status === 'PENDENTE') ? 'BLOQUEADA' : etapa.status;

              return (
                <div key={etapa.id} className="bg-surface-low p-6 border border-outline-variant/20 rounded-sm relative group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-3xl ${statusReal === 'CONCLUIDA' ? 'text-[#10b981]' : statusReal === 'BLOQUEADA' ? 'text-error opacity-40' : 'text-primary'}`}>{statusReal === 'CONCLUIDA' ? 'check_circle' : statusReal === 'BLOQUEADA' ? 'block' : 'build'}</span>
                      <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm ${statusReal === 'CONCLUIDA' ? 'bg-[#10b981]/10 text-[#10b981]' : statusReal === 'BLOQUEADA' ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}`}>{statusReal}</span>
                    </div>
                    <button onClick={() => { if(confirm('Excluir esta etapa?')) removerEtapa(aeronave.codigo, etapa.id); }} className="text-on-surfaceVariant hover:text-error opacity-0 group-hover:opacity-100 transition-opacity z-10"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                  </div>
                  <h4 className="font-headline font-bold text-on-surface">{etapa.nome}</h4>
                  <p className="text-[10px] text-on-surfaceVariant mt-2 uppercase font-mono tracking-wider mb-4">Prazo: {etapa.prazo}</p>

                  <div className="border-t border-outline-variant/10 pt-4 mb-6">
                    <p className="text-[9px] font-bold text-on-surfaceVariant uppercase tracking-widest mb-2">Equipe Alocada:</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {etapa.funcionariosAlocados.length > 0 ? etapa.funcionariosAlocados.map(f => (
                        <span key={f.id} className="text-[9px] bg-surface-highest text-on-surface border border-outline-variant/30 px-2 py-0.5 rounded-sm">{f.nome}</span>
                      )) : <span className="text-[9px] text-outline-variant italic">Nenhum</span>}
                    </div>
                    {statusReal !== 'CONCLUIDA' && usuarioLogado?.nivelPermissao !== 'OPERADOR' && (
                      <div className="flex gap-2">
                        <select value={funcionarioSelecionado[etapa.id] || ''} onChange={e => setFuncionarioSelecionado({...funcionarioSelecionado, [etapa.id]: e.target.value})} className="flex-1 bg-background border border-outline-variant/30 text-[9px] px-2 py-1 rounded-sm text-on-surface">
                          <option value="">Selecionar Func.</option>
                          {equipe.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
                        </select>
                        <button onClick={() => { if(funcionarioSelecionado[etapa.id]) alocarFuncionario(aeronave.codigo, etapa.id, funcionarioSelecionado[etapa.id]); }} className="bg-primary/20 text-primary px-2 rounded-sm text-[10px] font-bold"><span className="material-symbols-outlined text-[14px]">add</span></button>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-auto">
                    {statusReal === 'BLOQUEADA' ? <p className="text-[9px] text-error font-bold uppercase tracking-widest">Aguardando etapa anterior</p> : etapa.status === 'PENDENTE' ? <button onClick={() => atualizarStatusEtapa(aeronave.codigo, etapa.id, 'ANDAMENTO')} className="w-full bg-primary/10 text-primary border border-primary/30 py-2 text-[10px] font-bold uppercase hover:bg-primary hover:text-background transition-all">Iniciar Etapa</button> : etapa.status === 'ANDAMENTO' ? <button onClick={() => atualizarStatusEtapa(aeronave.codigo, etapa.id, 'CONCLUIDA')} className="w-full bg-[#10b981] text-background py-2 text-[10px] font-bold uppercase shadow-lg">Finalizar Etapa</button> : <button onClick={() => atualizarStatusEtapa(aeronave.codigo, etapa.id, 'PENDENTE')} className="w-full bg-surface-highest text-on-surfaceVariant py-2 text-[10px] font-bold uppercase">Reabrir</button>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <section>
            <div className="flex justify-between items-center mb-6 border-b border-outline-variant/20 pb-2">
              <h3 className="text-xl font-bold font-headline uppercase tracking-tighter">Peças Alocadas</h3>
              <button onClick={() => setIsVincularModalOpen(true)} className="bg-primary/10 text-primary border border-primary/30 px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase">Vincular Peça</button>
            </div>
            <div className="bg-surface-low border border-outline-variant/20 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container-highest/30"><tr className="text-[10px] uppercase tracking-widest text-on-surfaceVariant font-bold"><th className="p-4">Peça</th><th className="p-4 text-center">Status</th><th className="p-4 text-right">Ação</th></tr></thead>
                <tbody className="divide-y divide-outline-variant/10 text-xs">
                  {pecasAlocadas.map(peca => (
                    <tr key={peca.codigo} className="hover:bg-surface-highest/20 transition-colors group">
                      <td className="p-4"><p className="font-bold text-on-surface">{peca.nome}</p><p className="text-[10px] text-primary font-mono">{peca.codigo}</p></td>
                      <td className="p-4 text-center"><span className="text-[9px] bg-primary-container text-primary px-2 py-0.5 rounded-sm font-bold uppercase">{peca.status}</span></td>
                      <td className="p-4 text-right"><button onClick={() => desvincularPeca(peca.codigo)} className="text-on-surfaceVariant hover:text-error opacity-40 group-hover:opacity-100"><span className="material-symbols-outlined text-lg">link_off</span></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-6 border-b border-outline-variant/20 pb-2">
              <h3 className="text-xl font-bold font-headline uppercase tracking-tighter">Qualidade e Testes</h3>
              <button onClick={() => setIsTesteModalOpen(true)} className="bg-primary/10 text-primary border border-primary/30 px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase">Agendar Teste</button>
            </div>
            <div className="bg-surface-low border border-outline-variant/20 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container-highest/30"><tr className="text-[10px] uppercase tracking-widest text-on-surfaceVariant font-bold"><th className="p-4">Teste</th><th className="p-4 text-center">Status</th><th className="p-4 text-right">Ações</th></tr></thead>
                <tbody className="divide-y divide-outline-variant/10 text-xs">
                  {aeronave.testes.map(teste => (
                    <tr key={teste.id} className="hover:bg-surface-highest/20 transition-colors group">
                      <td className="p-4"><p className="font-bold text-on-surface">{teste.nome}</p><div className="flex gap-2 mt-1"><span className="text-[9px] px-1.5 py-0.5 border border-primary/20 text-primary uppercase font-bold rounded-sm">{teste.tipo}</span><span className="text-[9px] text-on-surfaceVariant font-mono">VAL: {teste.dataValidade}</span></div></td>
                      <td className="p-4 text-center"><span className={`font-bold uppercase tracking-widest ${teste.resultado === 'APROVADO' ? 'text-[#10b981]' : teste.resultado === 'REPROVADO' ? 'text-error' : 'text-outline-variant'}`}>{teste.resultado || 'PENDENTE'}</span></td>
                      <td className="p-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => atualizarResultadoTeste(aeronave.codigo, teste.id, 'APROVADO')} className={`w-8 h-8 rounded-sm border ${teste.resultado === 'APROVADO' ? 'bg-[#10b981] border-[#10b981] text-background' : 'border-outline-variant/30 text-on-surfaceVariant hover:text-[#10b981]'}`}><span className="material-symbols-outlined text-sm">check</span></button><button onClick={() => atualizarResultadoTeste(aeronave.codigo, teste.id, 'REPROVADO')} className={`w-8 h-8 rounded-sm border ${teste.resultado === 'REPROVADO' ? 'bg-error border-error text-background' : 'border-outline-variant/30 text-on-surfaceVariant hover:text-error'}`}><span className="material-symbols-outlined text-sm">close</span></button><button onClick={() => { if(confirm('Remover teste?')) removerTeste(aeronave.codigo, teste.id); }} className="w-8 h-8 rounded-sm border border-outline-variant/30 text-on-surfaceVariant hover:text-error hover:border-error opacity-40 group-hover:opacity-100 transition-colors"><span className="material-symbols-outlined text-sm">delete</span></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* Modais de Ação */}
      {isEtapaModalOpen && (<div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50"><div className="bg-surface-low border border-outline-variant/30 p-8 rounded-sm w-full max-w-md"><h3 className="font-headline font-bold text-xl mb-6">Nova Etapa</h3><form onSubmit={handleCriarEtapa} className="space-y-4"><input required value={novaEtapaNome} onChange={e => setNovaEtapaNome(e.target.value)} className="w-full bg-background border border-outline-variant/30 py-3 px-4 rounded-sm text-sm" placeholder="Nome" /><input required type="date" value={novaEtapaPrazo} onChange={e => setNovaEtapaPrazo(e.target.value)} className="w-full bg-background border border-outline-variant/30 py-3 px-4 rounded-sm text-sm" /><div className="flex gap-4 pt-4"><button type="button" onClick={() => setIsEtapaModalOpen(false)} className="flex-1 py-3 border border-outline-variant/30 text-on-surfaceVariant font-bold uppercase text-[10px]">Cancelar</button><button type="submit" className="flex-1 py-3 bg-primary text-background font-bold uppercase text-[10px]">Adicionar</button></div></form></div></div>)}
      {isTesteModalOpen && (<div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50"><div className="bg-surface-low border border-outline-variant/30 p-8 rounded-sm w-full max-w-md"><h3 className="font-headline font-bold text-xl mb-6">Agendar Teste</h3><form onSubmit={handleCriarTeste} className="space-y-4"><input required value={novoTesteNome} onChange={e => setNovoTesteNome(e.target.value)} className="w-full bg-background border border-outline-variant/30 py-3 px-4 rounded-sm text-sm" placeholder="Nome" /><select value={novoTesteTipo} onChange={e => setNovoTesteTipo(e.target.value as TipoTeste)} className="w-full bg-background border border-outline-variant/30 py-3 px-4 rounded-sm text-xs font-headline uppercase"><option value="ELETRICO">ELÉTRICO</option><option value="HIDRAULICO">HIDRÁULICO</option><option value="AERODINAMICO">AERODINÂMICO</option></select><input required type="date" value={novoTesteData} onChange={e => setNovoTesteData(e.target.value)} className="w-full bg-background border border-outline-variant/30 py-3 px-4 rounded-sm text-sm" /><div className="flex gap-4 pt-4"><button type="button" onClick={() => setIsTesteModalOpen(false)} className="flex-1 py-3 border border-outline-variant/30 text-on-surfaceVariant font-bold uppercase text-[10px]">Cancelar</button><button type="submit" className="flex-1 py-3 bg-primary text-background font-bold uppercase text-[10px]">Agendar Teste</button></div></form></div></div>)}
      {isVincularModalOpen && (<div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50"><div className="bg-surface-low border border-outline-variant/30 p-8 rounded-sm w-full max-w-md"><h3 className="font-headline font-bold text-xl mb-6">Vincular Peça</h3><select value={pecaSelecionada} onChange={e => setPecaSelecionada(e.target.value)} className="w-full bg-background border border-outline-variant/30 py-3 px-4 rounded-sm mb-6 text-sm"><option value="" disabled>Selecione uma peça...</option>{pecasDisponiveis.map(p => <option key={p.codigo} value={p.codigo}>{p.codigo} - {p.nome}</option>)}</select><div className="flex gap-4"><button onClick={() => setIsVincularModalOpen(false)} className="flex-1 py-3 border border-outline-variant/30 text-on-surfaceVariant font-bold uppercase text-[10px]">Cancelar</button><button onClick={handleVincular} disabled={!pecaSelecionada} className="flex-1 py-3 bg-primary text-background font-bold uppercase text-[10px]">Confirmar</button></div></div></div>)}
    </div>
  );
}