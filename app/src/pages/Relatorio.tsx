import { useParams, useNavigate } from 'react-router-dom';
import { useSystem } from '../contexts/SystemContext';

export function Relatorio() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { aeronaves, inventario, usuarioLogado } = useSystem();

  const aeronave = aeronaves.find(a => a.codigo === id);
  if (!aeronave) return <div className="p-8 text-error">Aeronave não encontrada.</div>;

  const pecasAlocadas = inventario.filter(p => p.aeronaveDestino === id);
  const dataHoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const etapasConcluidas = aeronave.etapas.filter(e => e.status === 'CONCLUIDA');
  const handleExportarTXT = () => {
    const conteudo = `=====================================================
RELATÓRIO DE ENTREGA TÉCNICA - AEROCODE
=====================================================
REFERÊNCIA: ${aeronave.codigo}-DEL-${new Date().getFullYear()}
DATA DE ENTREGA: ${dataHoje}
INSPETOR: ${usuarioLogado?.nome} (${usuarioLogado?.nivelPermissao})

--- 1. INFORMAÇÕES DA AERONAVE ---
Código: ${aeronave.codigo}
Modelo: ${aeronave.modelo}
Tipo: ${aeronave.tipo}
Capacidade: ${aeronave.capacidade}
Alcance: ${aeronave.alcance} km

--- 2. RESUMO DE PRODUÇÃO ---
Total de Peças Utilizadas: ${pecasAlocadas.length}

[ ETAPAS CONCLUÍDAS E RESPONSÁVEIS ]
${etapasConcluidas.length > 0 ? etapasConcluidas.map(e => `> ${e.nome}\n  Equipe Técnica: ${e.funcionariosAlocados.map(f => f.nome).join(', ') || 'Responsável não registrado'}`).join('\n\n') : 'Nenhuma etapa registrada.'}

[ TESTES DE QUALIDADE ]
${aeronave.testes.map(t => `> ${t.nome} [${t.tipo}]: ${t.resultado}`).join('\n')}

=====================================================
Assinatura Digital: VALIDADA - AEROCODE SYSTEMS
=====================================================`;
    const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Aerocode_Relatorio_${aeronave.codigo}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body flex justify-center py-12 px-8 overflow-y-auto relative">
      
      <button onClick={() => navigate(`/aeronaves/${aeronave.codigo}`)} className="absolute top-8 left-8 text-on-surfaceVariant hover:text-primary transition-colors flex items-center gap-2">
        <span className="material-symbols-outlined">arrow_back</span>
        <span className="text-[10px] font-bold uppercase tracking-widest">Voltar ao Painel</span>
      </button>

      <div className="w-[210mm] min-h-[297mm] bg-[#f8fafc] text-slate-900 p-[25mm] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative flex flex-col">
        
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <span className="text-[120px] font-headline font-black rotate-[-45deg] tracking-tighter">AEROCODE</span>
        </div>

        <header className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-12 relative z-10">
          <div>
            <h1 className="text-3xl font-headline font-black tracking-tighter text-slate-900">AEROCODE</h1>
            <p className="text-[10px] font-bold tracking-[0.3em] text-slate-500">AEROSPACE ENGINEERING</p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-headline font-bold text-slate-900">RELATÓRIO DE ENTREGA TÉCNICA</h2>
            <p className="text-xs text-slate-500 font-mono">REF: {aeronave.codigo}-DEL-{new Date().getFullYear()}</p>
          </div>
        </header>

        <section className="mb-12 relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-6 w-1 bg-slate-900"></div>
            <h3 className="text-sm font-headline font-bold uppercase tracking-widest text-slate-800">1. Informações do Ativo</h3>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-6 ml-4">
            <div><label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Aeronave</label><p className="text-sm font-medium border-b border-slate-200 pb-1">{aeronave.codigo}</p></div>
            <div><label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Modelo / Tipo</label><p className="text-sm font-medium border-b border-slate-200 pb-1">{aeronave.modelo} ({aeronave.tipo})</p></div>
            <div><label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Data de Emissão</label><p className="text-sm font-medium border-b border-slate-200 pb-1">{dataHoje}</p></div>
            <div><label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Capacidade / Alcance</label><p className="text-sm font-medium border-b border-slate-200 pb-1">{aeronave.capacidade} Pax | {aeronave.alcance} km</p></div>
          </div>
        </section>

        <section className="mb-12 relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-6 w-1 bg-slate-900"></div>
            <h3 className="text-sm font-headline font-bold uppercase tracking-widest text-slate-800">2. Resumo de Produção e Rastreabilidade</h3>
          </div>
          
          <div className="ml-4 space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-sm">
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2">Peças Utilizadas</label>
                <p className="text-3xl font-headline font-bold text-slate-900">{pecasAlocadas.length}</p>
              </div>
              <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-sm flex flex-col items-center justify-center text-center">
                <label className="text-[10px] font-bold uppercase text-emerald-600 block mb-2">Status dos Testes</label>
                <div className="flex items-center space-x-3">
                  <span className="material-symbols-outlined text-4xl text-emerald-600">check_circle</span>
                  <p className="text-2xl font-headline font-black text-emerald-700 tracking-tighter">APROVADO</p>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-slate-200">
              <h4 className="text-[10px] font-bold uppercase text-slate-400 mb-4 tracking-widest">Registro de Etapas Concluídas</h4>
              <div className="space-y-3">
                {etapasConcluidas.map(etapa => (
                  <div key={etapa.id} className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{etapa.nome}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">
                        <span className="font-bold text-slate-400">Responsável:</span> {etapa.funcionariosAlocados.map(f => f.nome).join(', ') || 'Registro não encontrado'}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-[#10b981] text-xl">check_circle</span>
                  </div>
                ))}
                {etapasConcluidas.length === 0 && (
                  <p className="text-xs text-slate-500 italic">Nenhuma etapa registrada no sistema.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-auto pt-8 border-t border-slate-200 grid grid-cols-2 gap-12 relative z-10">
          <div className="flex flex-col items-center">
            <div className="w-full border-b border-slate-400 mb-2 mt-8"></div>
            <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Assinatura do Inspetor</p>
            <p className="text-xs font-medium text-slate-900 uppercase">{usuarioLogado?.nome}</p>
          </div>
          <div className="flex flex-col items-center relative">
            <div className="absolute -top-12 opacity-80 rotate-12">
              <div className="w-24 h-24 rounded-full border-4 border-slate-900/10 flex items-center justify-center p-2">
                <div className="w-full h-full rounded-full border border-slate-900/10 flex flex-col items-center justify-center text-center">
                  <span className="text-[6px] font-bold text-slate-400">AEROCODE VALIDATED</span>
                  <span className="text-[10px] font-black text-slate-300">{new Date().getFullYear()}</span>
                </div>
              </div>
            </div>
            <div className="w-full border-b border-slate-400 mb-2 mt-8"></div>
            <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Validação do Sistema</p>
            <p className="text-xs font-medium text-slate-900">Assinatura Digital Criptografada</p>
          </div>
        </footer>

      </div>
      <button onClick={handleExportarTXT} className="fixed bottom-12 right-12 bg-[#1b2b48] hover:bg-primary text-[#b7c7eb] hover:text-background px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 transition-all">
        <span className="material-symbols-outlined">download</span>
        <span className="font-bold text-sm uppercase tracking-widest">Exportar .TXT</span>
      </button>
    </div>
  );
}