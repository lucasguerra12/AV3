import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { performance } from 'perf_hooks';

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ==========================================
// ROTA DO RELATÓRIO DE QUALIDADE (SISTEMA CRÍTICO)
// ==========================================
app.get('/api/teste-desempenho', async (req, res) => {
  // 1. Marca o início do processamento no servidor
  const inicioProcessamento = performance.now();
  
  // 2. Simula uma carga pesada no banco (busca todas as tabelas interligadas)
  await prisma.aeronave.findMany({
    include: { pecas: true, etapas: true, testes: true }
  });
  
  // 3. Marca o fim e calcula o tempo de processamento interno
  const fimProcessamento = performance.now();
  const tempoProcessamento = fimProcessamento - inicioProcessamento;
  
  res.json({ tempoProcessamento });
});

// ==========================================
// ROTAS DE NEGÓCIO (CRUD)
// ==========================================
app.get('/api/aeronaves', async (req, res) => {
  try {
    const aeronaves = await prisma.aeronave.findMany({
      include: { pecas: true, etapas: true, testes: true }
    });
    res.json(aeronaves);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar dados.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Back-end rodando na porta ${PORT}`);
});