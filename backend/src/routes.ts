import { Express } from 'express';
import { login } from './controllers/authController';
import { 
    adicionarAeronave, 
    listarAeronaves, 
    obterAeronavePorCodigo 
} from './controllers/aeronaveController';
import { 
    listarFuncionarios, 
    adicionarFuncionario, 
    removerFuncionario 
} from './controllers/funcionarioController';

// Vamos adicionar mais controladores aqui em breve

export function registerRoutes(app: Express) {
    
    // Autenticação
    app.post('/api/login', login);

    // Aeronaves
    app.get('/api/aeronaves', listarAeronaves);
    app.get('/api/aeronaves/:codigo', obterAeronavePorCodigo);
    app.post('/api/aeronaves', adicionarAeronave);

    // TODO: Adicionar rotas para Funcionários
    // app.get('/api/funcionarios', ...);
    
    // TODO: Adicionar rotas para Etapas, Peças e Testes
    // app.post('/api/aeronaves/:codigo/etapas', ...);
    // app.put('/api/etapas/:id/status', ...); 
}