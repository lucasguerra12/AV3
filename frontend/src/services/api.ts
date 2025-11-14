import { Aeronave } from "../models/Aeronave";
import { Etapa } from "../models/Etapa";
import { Funcionario } from "../models/Funcionario";
import { Peca } from "../models/Peca";
import { Teste } from "../models/Teste";
import { TipoAeronave, NivelPermissao, ResultadoTeste, StatusEtapa, StatusPeca, TipoPeca, TipoTeste } from "../models/enums";

const API_URL = 'http://localhost:3001/api';

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro ${response.status}`);
    }
    if (response.status === 204) {
        return null;
    }
    return response.json();
};

const request = async (endpoint: string, options: RequestInit = {}) => {
    // Para o Relatório de Qualidade (AV3), medimos o tempo de resposta aqui
    const startTime = performance.now();

    const response = await fetch(`${API_URL}/${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    const endTime = performance.now();
    console.log(`[Metrics] ${options.method || 'GET'} ${endpoint} - Tempo Resposta: ${(endTime - startTime).toFixed(3)} ms`);

    return handleResponse(response);
};

// --- API de Autenticação ---
export const apiLogin = (email: string, senha: string): Promise<Funcionario> => {
    return request('login', {
        method: 'POST',
        body: JSON.stringify({ email, senha }),
    });
};

// --- API de Aeronaves ---
export const apiListarAeronaves = (): Promise<Aeronave[]> => {
    return request('aeronaves');
};

export const apiObterAeronave = (codigo: string): Promise<Aeronave> => {
    return request(`aeronaves/${codigo}`);
};

export const apiAdicionarAeronave = (data: { codigo: string, modelo: string, tipo: TipoAeronave, capacidade: number, alcance: number }): Promise<Aeronave> => {
    return request('aeronaves', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

// --- API de Funcionários ---
export const apiListarFuncionarios = (): Promise<Funcionario[]> => {
    return request('funcionarios');
};

export const apiAdicionarFuncionario = (data: { nome: string, email: string, senha: string, nivelPermissao: NivelPermissao, telefone?: string, endereco?: string }): Promise<Funcionario> => {
    return request('funcionarios', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const apiRemoverFuncionario = (id: number): Promise<null> => {
    return request(`funcionarios/${id}`, {
        method: 'DELETE',
    });
};

// --- API de Etapas ---
export const apiAdicionarEtapa = (aeronaveId: number, data: { nome: string, prazo: string }): Promise<Etapa> => {
    return request(`aeronaves/${aeronaveId}/etapas`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const apiAtualizarStatusEtapa = (etapaId: number, acao: 'iniciar' | 'finalizar'): Promise<Etapa> => {
    return request(`etapas/${etapaId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ acao }),
    });
};

export const apiGerirFuncionariosEtapa = (etapaId: number, funcionarioIds: number[]): Promise<Etapa> => {
    return request(`etapas/${etapaId}/funcionarios`, {
        method: 'PUT',
        body: JSON.stringify({ funcionarioIds }),
    });
};

export const apiRemoverEtapa = (etapaId: number): Promise<null> => {
    return request(`etapas/${etapaId}`, {
        method: 'DELETE',
    });
};

// --- API de Peças ---
export const apiAdicionarPeca = (aeronaveId: number, data: { nome: string, tipo: TipoPeca, fornecedor: string }): Promise<Peca> => {
    return request(`aeronaves/${aeronaveId}/pecas`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const apiAtualizarStatusPeca = (pecaId: number, novoStatus: StatusPeca): Promise<Peca> => {
    return request(`pecas/${pecaId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ novoStatus }),
    });
};

export const apiRemoverPeca = (pecaId: number): Promise<null> => {
    return request(`pecas/${pecaId}`, {
        method: 'DELETE',
    });
};

// --- API de Testes ---
export const apiAdicionarTeste = (aeronaveId: number, data: { tipo: TipoTeste, resultado: ResultadoTeste }): Promise<Teste> => {
    return request(`aeronaves/${aeronaveId}/testes`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const apiRemoverTeste = (testeId: number): Promise<null> => {
    return request(`testes/${testeId}`, {
        method: 'DELETE',
    });
};