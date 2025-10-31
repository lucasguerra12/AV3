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

export function registerRoutes(app: Express) {
    
    app.post('/api/login', login);

    app.get('/api/aeronaves', listarAeronaves);
    app.get('/api/aeronaves/:codigo', obterAeronavePorCodigo);
    app.post('/api/aeronaves', adicionarAeronave);

    app.get('/api/funcionarios', listarFuncionarios);
    app.post('/api/funcionarios', adicionarFuncionario);
    app.delete('/api/funcionarios/:id', removerFuncionario);
    
}