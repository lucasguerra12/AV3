export type TipoAeronave = 'COMERCIAL' | 'MILITAR';
export type TipoPeca = 'NACIONAL' | 'IMPORTADA';
export type StatusPeca = 'PRONTA' | 'EM_TRANSPORTE' | 'EM_PRODUCAO' | 'MANUTENCAO';
export type StatusEtapa = 'PENDENTE' | 'ANDAMENTO' | 'CONCLUIDA' | 'BLOQUEADA';
export type TipoTeste = 'ELETRICO' | 'HIDRAULICO' | 'AERODINAMICO';
export type ResultadoTeste = 'APROVADO' | 'REPROVADO' | null;

export interface Funcionario {
  id: string;
  nome: string;
  telefone: string;
  endereco: string;
  usuario: string;
  senha?: string;
  nivelPermissao: 'ADMINISTRADOR' | 'ENGENHEIRO' | 'OPERADOR';
}

export interface Teste {
  id: string;
  nome: string;
  tipo: TipoTeste;
  dataValidade: string;
  resultado: ResultadoTeste;
}

export interface Etapa {
  id: string;
  nome: string;
  status: StatusEtapa;
  prazo: string;
  funcionariosAlocados: Funcionario[];
  etapaAnteriorId?: string | null;
}

export interface Peca {
  id: string;
  nome: string;
  tipo: TipoPeca;
  fornecedor: string;
  status: StatusPeca;
}

export interface Aeronave {
  codigo: string;
  modelo: string;
  tipo: TipoAeronave;
  capacidade: number;
  alcance: number;
  pecas: Peca[];
  etapas: Etapa[];
  testes: Teste[];
}