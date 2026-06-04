import type { Aeronave, Funcionario } from '../domain/types';

// CREDENCIAIS DE TESTE:
// Admin: admin / 123456
// Engenheiro: eng / 123456
// Operador: op / 123456
export const mockFuncionarios: Funcionario[] = [
  { id: 'f1', nome: 'Eng. Chefe Gerson', telefone: '(11) 99999-9999', endereco: 'Centro de Comando', usuario: 'admin', senha: '123456', nivelPermissao: 'ADMINISTRADOR' },
  { id: 'f2', nome: 'Eng. Lucas Guerra', telefone: '(11) 88888-8888', endereco: 'Hangar B', usuario: 'eng', senha: '123456', nivelPermissao: 'ENGENHEIRO' },
  { id: 'f3', nome: 'Téc. Marcos Silva', telefone: '(11) 77777-7777', endereco: 'Pátio de Montagem', usuario: 'op', senha: '123456', nivelPermissao: 'OPERADOR' }
];

export const mockAeronaves: Aeronave[] = [
  {
    codigo: 'KV-001', modelo: 'Boeing 737-800', tipo: 'COMERCIAL', capacidade: 215, alcance: 5436, pecas: [],
    etapas: [
      { id: 'e1', nome: 'Montagem da Fuselagem', prazo: '2026-05-10', status: 'CONCLUIDA', funcionariosAlocados: [] },
      { id: 'e2', nome: 'Instalação Elétrica', prazo: '2026-05-15', status: 'ANDAMENTO', funcionariosAlocados: [] },
      { id: 'e3', nome: 'Montagem dos Propulsores', prazo: '2026-05-20', status: 'PENDENTE', funcionariosAlocados: [] },
    ],
    testes: [
      { id: 't1', nome: 'Inspeção de Cabeamento', tipo: 'ELETRICO', dataValidade: '2026-12-01', resultado: 'APROVADO' },
      { id: 't2', nome: 'Pressão Estática', tipo: 'AERODINAMICO', dataValidade: '2026-11-15', resultado: null },
    ]
  }
];