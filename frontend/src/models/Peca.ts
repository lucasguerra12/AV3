import { TipoPeca, StatusPeca } from "./enums";

export interface Peca {
    id: number; 
    nome: string;
    tipo: TipoPeca;
    fornecedor: string;
    status: StatusPeca;
    aeronaveId: number; 
}