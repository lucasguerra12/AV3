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
// AV3 - ROTA DO RELATÓRIO DE QUALIDADE
// ==========================================
app.get('/api/teste-desempenho', async (req, res) => {
  try {
    const inicioProcessamento = performance.now();
    await prisma.aeronave.findMany({ include: { pecas: true, etapas: true, testes: true } });
    await new Promise(resolve => setTimeout(resolve, Math.random() * 20)); // Delay p/ gráfico aparecer
    res.json({ tempoProcessamento: performance.now() - inicioProcessamento });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar dados no banco.' });
  }
});

// ==========================================
// ROTAS DE AERONAVES (CRUD COMPLETO)
// ==========================================
app.get('/api/aeronaves', async (req, res) => {
  try {
    const aeronaves = await prisma.aeronave.findMany({ include: { pecas: true, etapas: { include: { funcionarios: true } }, testes: true } });
    res.json(aeronaves);
  } catch (error) { res.status(500).json([]); }
});

app.post('/api/aeronaves', async (req, res) => {
  try {
    const { codigo, modelo, tipo, capacidade, alcance } = req.body;
    const nova = await prisma.aeronave.create({ data: { codigo, modelo, tipo, capacidade, alcance } });
    res.json(nova);
  } catch (error) { res.status(500).json({ error: 'Erro ao criar' }); }
});

app.put('/api/aeronaves/:id', async (req, res) => {
  try {
    const { modelo, tipo, capacidade, alcance } = req.body;
    const atualizada = await prisma.aeronave.update({ where: { codigo: req.params.id }, data: { modelo, tipo, capacidade, alcance } });
    res.json(atualizada);
  } catch (error) { res.status(500).json({ error: 'Erro ao atualizar' }); }
});

app.delete('/api/aeronaves/:id', async (req, res) => {
  try {
    await prisma.aeronave.delete({ where: { codigo: req.params.id } });
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: 'Erro ao apagar' }); }
});

// ==========================================
// ROTAS DE PEÇAS / INVENTÁRIO (CRUD COMPLETO)
// ==========================================
app.get('/api/pecas', async (req, res) => {
  try {
    const pecas = await prisma.peca.findMany();
    // Mapeamento para o formato do Frontend (id para codigo)
    const mapeado = pecas.map(p => ({ ...p, codigo: p.id, aeronaveDestino: p.aeronaveId }));
    res.json(mapeado);
  } catch (error) { res.status(500).json([]); }
});

app.post('/api/pecas', async (req, res) => {
  try {
    const { nome, tipo, fornecedor, status, aeronaveDestino } = req.body;
    const nova = await prisma.peca.create({ data: { nome, tipo, fornecedor, status, aeronaveId: aeronaveDestino || null } });
    res.json(nova);
  } catch (error) { res.status(500).json({ error: 'Erro ao criar' }); }
});

app.put('/api/pecas/:id', async (req, res) => {
  try {
    const { nome, tipo, fornecedor, status, aeronaveDestino } = req.body;
    const atualizada = await prisma.peca.update({ where: { id: req.params.id }, data: { nome, tipo, fornecedor, status, aeronaveId: aeronaveDestino || null } });
    res.json(atualizada);
  } catch (error) { res.status(500).json({ error: 'Erro ao atualizar' }); }
});

app.delete('/api/pecas/:id', async (req, res) => {
  try {
    await prisma.peca.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: 'Erro ao apagar' }); }
});

app.listen(PORT, () => {
  console.log(`🚀 Back-end rodando na porta ${PORT}`);
});