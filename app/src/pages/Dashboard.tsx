import { useSystem } from '../contexts/SystemContext';

export function Dashboard() {
  const { logs, aeronaves } = useSystem();  
  const totalAeronaves = aeronaves.length;
  const pecasEmTransito = aeronaves.reduce((total, aero) => {
    const emTransito = aero.pecas.filter(p => p.status === 'EM_TRANSPORTE').length;
    return total + emTransito;
  }, 0);

  const testesAprovados = aeronaves.reduce((total, aero) => {
    return total + aero.testes.filter(t => t.resultado === 'APROVADO').length;
  }, 0);

  const testesReprovados = aeronaves.reduce((total, aero) => {
    return total + aero.testes.filter(t => t.resultado === 'REPROVADO').length;
  }, 0);

  const ultimasAeronaves = [...aeronaves].slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      
      {/* HEADER SUPERIOR (Com a barra de busca e status) */}
      <header className="h-16 border-b border-outline-variant/20 bg-background/80 backdrop-blur flex items-center justify-between px-8 sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <h2 className="text-lg font-bold text-on-surface tracking-tight font-headline uppercase">Gestão de Produção</h2>
          <div className="relative group flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-on-surfaceVariant text-[18px]">search</span>
            <input 
              className="bg-surface-container border border-outline-variant/30 text-on-surface text-xs font-label pl-10 pr-4 py-2 w-64 rounded-sm focus:outline-none focus:border-primary transition-all uppercase placeholder:text-on-surfaceVariant/50 shadow-inner" 
              placeholder="PESQUISAR NO SISTEMA..." 
              type="text" 
            />
          </div>
        </div>
        <div className="flex items-center gap-4 text-on-surfaceVariant">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container rounded-sm border border-outline-variant/20">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
            <span className="text-[9px] font-bold tracking-widest uppercase font-label">Sistema Online</span>
          </div>
        </div>
      </header>

      {/* ÁREA PRINCIPAL */}
      <main className="p-8 space-y-8 flex-1">
        
        {/* Título da Página e Turno */}
        <section className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2 font-label">Telemetria de Sistema</p>
            <h2 className="text-3xl font-bold text-on-surface font-headline tracking-tight">Dashboard de Operações</h2>
          </div>
          <div className="bg-surface-container px-4 py-2 rounded-sm border border-outline-variant/20 text-right shadow-sm">
            <p className="text-[9px] text-on-surfaceVariant uppercase tracking-widest mb-1 font-label">Turno Atual</p>
            <p className="text-xs font-bold uppercase text-on-surface font-headline text-primary">Operações Gamma-9</p>
          </div>
        </section>

        {/* 4 CARDS SUPERIORES (Com a matemática aplicada) */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard title="Frota Ativa" value={totalAeronaves} subtitle="UNIDADES" icon="precision_manufacturing" borderClass="border-l-primary" />
          <MetricCard title="Peças em Trânsito" value={pecasEmTransito} subtitle="ITENS LOGÍSTICOS" icon="local_shipping" borderClass="border-l-on-surfaceVariant" trend="REDE DE SUPRIMENTOS" />
          <MetricCard title="Testes Aprovados" value={testesAprovados} subtitle="CHECKLISTS" icon="verified" borderClass="border-l-[#10b981]" success trend="PADRÃO DE QUALIDADE" />
          <MetricCard title="Alertas Críticos" value={testesReprovados} subtitle="REPROVAÇÕES" icon="warning" borderClass="border-l-[#ef4444]" alert={testesReprovados > 0} trend="REVISÃO IMEDIATA" />
        </section>

        {/* ÁREA INFERIOR: TABELA ESQUERDA (2/3) E LOGS DIREITA (1/3) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Tabela Resumo */}
          <div className="lg:col-span-2 bg-surface-low border border-outline-variant/20 rounded-sm p-6 shadow-md">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-[12px] font-bold text-on-surface uppercase tracking-widest font-headline">Monitoramento de Linha</h3>
                <p className="text-[10px] text-on-surfaceVariant mt-1 font-label">Últimas atualizações no grid de montagem</p>
              </div>
            </div>
            
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant/20">
                  <th className="pb-3 text-[10px] text-on-surfaceVariant font-bold uppercase tracking-widest font-label">Código</th>
                  <th className="pb-3 text-[10px] text-on-surfaceVariant font-bold uppercase tracking-widest font-label">Modelo</th>
                  <th className="pb-3 text-[10px] text-on-surfaceVariant font-bold uppercase tracking-widest font-label text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {ultimasAeronaves.map((aero) => (
                  <tr key={aero.codigo} className="hover:bg-surface-highest/30 transition-colors">
                    <td className="py-4 font-bold text-primary font-headline text-sm tracking-widest">{aero.codigo}</td>
                    <td className="py-4 text-sm text-on-surface">{aero.modelo}</td>
                    <td className="py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                        <span className="text-[10px] text-on-surface uppercase tracking-wider font-label">Ativo</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Coluna de Logs */}
          <div className="bg-surface-container/50 border border-outline-variant/20 p-6 rounded-sm backdrop-blur shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[12px] font-bold text-on-surface uppercase tracking-widest font-headline">Logs do Sistema</h3>
              <span className="flex items-center gap-1 text-[9px] text-on-surfaceVariant">
                <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full animate-pulse"></span> Ao Vivo
              </span>
            </div>
            
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 border-b border-outline-variant/10 pb-3 animate-fade-in">
                  <span className="text-[10px] text-on-surfaceVariant font-headline mt-0.5">{log.time}</span>
                  <div className="flex-1">
                    <span className={`px-1.5 py-0.5 rounded-sm text-[8px] font-bold mb-1 inline-block uppercase tracking-widest ${log.color}`}>{log.tag}</span>
                    <p className="text-on-surface text-[11px] leading-relaxed font-body">{log.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon, borderClass, alert, success, trend }: any) {
  let iconColor = 'text-on-surfaceVariant';
  let subtitleColor = 'text-primary';

  if (alert) {
    iconColor = 'text-[#ef4444] animate-pulse'; 
    subtitleColor = 'text-[#ef4444]';
  } else if (success) {
    iconColor = 'text-[#10b981]';
    subtitleColor = 'text-[#10b981]';
  }

  return (
    <div className={`bg-surface-low border-l-2 border-y border-r border-outline-variant/20 p-5 rounded-r-sm shadow-md transition-all hover:bg-surface-container ${borderClass}`}>
      <div className="flex justify-between items-start mb-4">
        <p className="text-[10px] font-bold text-on-surfaceVariant uppercase tracking-widest font-label">{title}</p>
        <span className={`material-symbols-outlined text-[20px] ${iconColor}`}>{icon}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-light text-on-surface font-headline">{value}</h3>
        <span className={`text-[10px] font-bold uppercase font-label tracking-widest ${subtitleColor}`}>{subtitle}</span>
      </div>
      {trend && <p className="text-[9px] text-on-surfaceVariant mt-4 uppercase tracking-widest font-label">{trend}</p>}
    </div>
  );
}