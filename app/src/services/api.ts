const API_URL = 'http://localhost:3000/api';

export const api = {
  // Aeronaves
  getAeronaves: async () => (await fetch(`${API_URL}/aeronaves`)).json(),
  createAeronave: async (data: any) => fetch(`${API_URL}/aeronaves`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
  updateAeronave: async (id: string, data: any) => fetch(`${API_URL}/aeronaves/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
  deleteAeronave: async (id: string) => fetch(`${API_URL}/aeronaves/${id}`, { method: 'DELETE' }),

  // Peças
  getPecas: async () => (await fetch(`${API_URL}/pecas`)).json(),
  createPeca: async (data: any) => fetch(`${API_URL}/pecas`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
  updatePeca: async (id: string, data: any) => fetch(`${API_URL}/pecas/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
  deletePeca: async (id: string) => fetch(`${API_URL}/pecas/${id}`, { method: 'DELETE' }),

  // Qualidade
  executarTesteCarga: async (quantidadeUsuarios: number) => {
    const promises = [];
    for (let i = 0; i < quantidadeUsuarios; i++) {
      promises.push((async () => {
        const inicio = performance.now();
        try {
          const res = await fetch(`${API_URL}/teste-desempenho`);
          const dados = await res.json();
          const tempoResposta = performance.now() - inicio;
          const latencia = Math.max(0.1, (tempoResposta - (dados.tempoProcessamento || 0)) / 2);
          return { tempoResposta, tempoProcessamento: dados.tempoProcessamento || 0, latencia };
        } catch {
          const tempo = performance.now() - inicio;
          return { tempoResposta: tempo, tempoProcessamento: 0, latencia: tempo / 2 };
        }
      })());
    }
    const resultados = await Promise.all(promises);
    const medias = resultados.reduce((acc, curr) => ({ TR: acc.TR + curr.tempoResposta, TP: acc.TP + curr.tempoProcessamento, L: acc.L + curr.latencia }), { TR: 0, TP: 0, L: 0 });
    return { usuarios: quantidadeUsuarios, tempoResposta: medias.TR / quantidadeUsuarios, tempoProcessamento: medias.TP / quantidadeUsuarios, latencia: medias.L / quantidadeUsuarios };
  }
};