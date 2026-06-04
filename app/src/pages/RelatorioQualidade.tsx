import { useState } from 'react';
import { api } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Metrica {
  usuarios: string;
  tempoResposta: number;
  tempoProcessamento: number;
  latencia: number;
}

// CORREÇÃO: Usando exportação nomeada para não falhar no Router
export function RelatorioQualidade() {
  const [dados, setDados] = useState<Metrica[]>([]);
  const [testando, setTestando] = useState(false);

  const iniciarTestes = async () => {
    setTestando(true);
    try {
      const teste1 = await api.executarTesteCarga(1);
      const teste5 = await api.executarTesteCarga(5);
      const teste10 = await api.executarTesteCarga(10);
      
      setDados([
        { ...teste1, usuarios: '1 Usr' },
        { ...teste5, usuarios: '5 Usr' },
        { ...teste10, usuarios: '10 Usr' }
      ]);
    } catch (error) {
      console.error("Erro no teste de carga", error);
    } finally {
      setTestando(false);
    }
  };

  return (
    <div className="p-6 overflow-y-auto h-full text-slate-800 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Relatório de Qualidade - Sistema Crítico (AV3)</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold mb-2 border-b pb-2">Metodologia e Obtenção das Métricas</h2>
        <div className="text-gray-700 text-sm mb-6 space-y-3 mt-4">
          <p>
            <strong>Como as métricas foram obtidas:</strong> Para atender aos requisitos de um sistema crítico do setor aeroespacial, implementámos uma rota analítica dedicada no back-end. Esta rota realiza interações e consultas relacionais massivas no banco de dados através do Prisma ORM.
          </p>
          <ul className="list-disc ml-6 space-y-1">
            <li><strong>Tempo de Processamento (Servidor):</strong> Medido no back-end utilizando a API <code>performance.now()</code>.</li>
            <li><strong>Tempo de Resposta Total:</strong> Medido no front-end em React, contemplando o percurso integral de rede.</li>
            <li><strong>Latência:</strong> Calculada matematicamente subtraindo o processamento interno do tempo total, dividido pela ida e volta.</li>
          </ul>
        </div>
        
        <button 
          onClick={iniciarTestes} 
          disabled={testando}
          className="bg-blue-600 text-white px-6 py-3 rounded-md font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-md"
        >
          {testando ? 'A analisar Sistemas...' : 'Executar Teste de Estresse (1, 5 e 10 Utilizadores)'}
        </button>
      </div>

      {dados.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
          
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col min-h-[350px]">
            <h3 className="text-center font-bold text-slate-700 mb-6">Tempo de Processamento (ms)</h3>
            <div className="flex-1 w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dados} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="usuarios" />
                  <YAxis />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="tempoProcessamento" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col min-h-[350px]">
            <h3 className="text-center font-bold text-slate-700 mb-6">Latência de Rede (ms)</h3>
            <div className="flex-1 w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dados} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="usuarios" />
                  <YAxis />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="latencia" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col min-h-[350px]">
            <h3 className="text-center font-bold text-slate-700 mb-6">Tempo de Resposta Total (ms)</h3>
            <div className="flex-1 w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dados} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="usuarios" />
                  <YAxis />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="tempoResposta" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}