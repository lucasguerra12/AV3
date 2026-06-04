// app/src/services/api.ts
const API_URL = 'http://localhost:3000/api';

export const api = {
  getAeronaves: async () => {
    const response = await fetch(`${API_URL}/aeronaves`);
    return response.json();
  },

  // Função que faz o teste de carga simulando múltiplos usuários
  executarTesteCarga: async (quantidadeUsuarios: number) => {
    const promises = [];
    
    for (let i = 0; i < quantidadeUsuarios; i++) {
      promises.push((async () => {
        const inicioRequisicao = performance.now(); // Início geral
        
        const response = await fetch(`${API_URL}/teste-desempenho`);
        const dadosBackend = await response.json();
        
        const fimRequisicao = performance.now(); // Fim geral
        
        const tempoResposta = fimRequisicao - inicioRequisicao;
        const tempoProcessamento = dadosBackend.tempoProcessamento;
        // Latência = (Tempo Total - Tempo de Processamento interno do servidor) / 2 (ida e volta)
        const latencia = (tempoResposta - tempoProcessamento) / 2;

        return { tempoResposta, tempoProcessamento, latencia };
      })());
    }

    const resultados = await Promise.all(promises);
    
    // Calcula a média das métricas para os N usuários
    const medias = resultados.reduce((acc, curr) => ({
      tempoResposta: acc.tempoResposta + curr.tempoResposta,
      tempoProcessamento: acc.tempoProcessamento + curr.tempoProcessamento,
      latencia: acc.latencia + curr.latencia
    }), { tempoResposta: 0, tempoProcessamento: 0, latencia: 0 });

    return {
      usuarios: quantidadeUsuarios,
      tempoResposta: medias.tempoResposta / quantidadeUsuarios,
      tempoProcessamento: medias.tempoProcessamento / quantidadeUsuarios,
      latencia: medias.latencia / quantidadeUsuarios
    };
  }
};