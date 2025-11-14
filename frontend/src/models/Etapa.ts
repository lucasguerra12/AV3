import { StatusEtapa } from "./enums";
import { Funcionario } from "./Funcionario";

export interface Etapa {
    id: number; // Adicionar ID
    nome: string;
    prazo: Date; // O Prisma converte string para Date
    status: StatusEtapa;
    funcionarios: Funcionario[];
    aeronaveId: number; // Adicionar
}