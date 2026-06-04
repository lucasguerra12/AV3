// app/src/pages/RelatorioQualidade.tsx
import { useState } from 'react';
import { api } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Metrica {
  usuarios: number;
  tempoResposta: number;
  tempoProcessamento: number;
  latencia: number;
}

export default function RelatorioQualidade() {
  const [dados, setDados] = useState<Metrica[]>([]);
  const [testando, setTestando] = useState(false);

  const iniciarTestes = async () => {
    setTestando(true);
    try {
      const teste1 = await api.executarTesteCarga(1);
      const teste5 = await api.executarTesteCarga(5);
      const teste10 = await api.executarTesteCarga(10);
      
      setDados([teste1, teste5, teste10]);
    } catch (error) {
      console.error("Erro no teste de carga", error);
    } finally {
      setTestando(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Desempenho Crítico (AV3)</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-2">Metodologia de Medição</h2>
        <p className="text-gray-600 mb-4">
          Conforme exigido para sistemas críticos, as medições foram programadas disparando requisições simultâneas. O servidor registra o tempo interno no banco (Tempo de Processamento) e o cliente calcula o Tempo de Resposta total. A Latência é a diferença dividida por dois. (Valores em ms).
        </p>
        <button 
          onClick={iniciarTestes} 
          disabled={testando}
          className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 disabled:opacity-50"
        >
          {testando ? 'Executando testes...' : 'Rodar Teste (1, 5 e 10 Usuários)'}
        </button>
      </div>

      {dados.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dados} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="usuarios" tickFormatter={(tick) => `${tick} Usuário(s)`} />
              <YAxis label={{ value: 'Milissegundos (ms)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value: any) => typeof value === 'number' ? `${value.toFixed(2)} ms` : value} />              <Legend />
              <Bar dataKey="tempoProcessamento" name="Tempo de Processamento" fill="#3b82f6" />
              <Bar dataKey="latencia" name="Latência (Rede)" fill="#f59e0b" />
              <Bar dataKey="tempoResposta" name="Tempo de Resposta Total" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}