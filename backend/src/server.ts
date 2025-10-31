import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { registerRoutes } from './routes';
import { timingMiddleware } from './middleware/timingMiddleware'; // <-- Vamos criar este já a seguir

// Instância única do Prisma
export const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT || 3001; 

app.use(cors());
app.use(express.json());

registerRoutes(app);

app.listen(port, () => {
  console.log(`[AeroCode Backend] Servidor a rodar na porta ${port}`);
});