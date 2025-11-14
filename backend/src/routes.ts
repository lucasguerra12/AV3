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
import { 
    adicionarEtapa, 
    removerEtapa, 
    atualizarStatusEtapa,
    gerirFuncionariosEtapa
} from './controllers/etapaController';
import { 
    adicionarPeca, 
    removerPeca, 
    atualizarStatusPeca 
} from './controllers/pecaController';
import {
    adicionarTeste,
    removerTeste,
} from './controllers/testeController';

export function registerRoutes(app: Express) {
    
    app.post('/api/login', login);

    // Aeronaves
    app.get('/api/aeronaves', listarAeronaves);
    app.get('/api/aeronaves/:codigo', obterAeronavePorCodigo);
    app.post('/api/aeronaves', adicionarAeronave);

    // Funcionários
    app.get('/api/funcionarios', listarFuncionarios);
    app.post('/api/funcionarios', adicionarFuncionario);
    app.delete('/api/funcionarios/:id', removerFuncionario);
    
    // Etapas
    app.post('/api/aeronaves/:aeronaveId/etapas', adicionarEtapa);
    app.put('/api/etapas/:id/status', atualizarStatusEtapa);
    app.put('/api/etapas/:id/funcionarios', gerirFuncionariosEtapa);
    app.delete('/api/etapas/:id', removerEtapa);

    // Peças
    app.post('/api/aeronaves/:aeronaveId/pecas', adicionarPeca);
    app.put('/api/pecas/:id/status', atualizarStatusPeca);
    app.delete('/api/pecas/:id', removerPeca);

    // Testes
    app.post('/api/aeronaves/:aeronaveId/testes', adicionarTeste);
    app.delete('/api/testes/:id', removerTeste);
}