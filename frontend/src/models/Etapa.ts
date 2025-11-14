import { StatusEtapa } from "./enums";
import { Funcionario } from "./Funcionario";

export class Etapa {
    nome: string;
    prazo: Date;
    status: StatusEtapa;
    funcionarios: Funcionario[] = [];

    constructor(nome: string, prazo: Date) {
        this.nome = nome;
        this.prazo = prazo;
        this.status = StatusEtapa.PENDENTE;
    }

    iniciarEtapa(): void {
        if (this.status === StatusEtapa.PENDENTE) {
            this.status = StatusEtapa.EM_ANDAMENTO;
            console.log(`Etapa '${this.nome}' iniciada.`);
        } else {
            console.log(`Aviso: Etapa '${this.nome}' não pôde ser iniciada (Status atual: ${this.status}).`);
        }
    }

    finalizarEtapa(): void {
        if (this.status === StatusEtapa.EM_ANDAMENTO) {
            this.status = StatusEtapa.CONCLUIDA;
            console.log(`Etapa '${this.nome}' foi concluída!`);
        } else {
            console.log(`Aviso: Etapa '${this.nome}' não pôde ser finalizada (Status atual: ${this.status}).`);
        }
    }

    associarFuncionario(funcionario: Funcionario): void {
        if (!this.funcionarios.find(f => f.id === funcionario.id)) {
            this.funcionarios.push(funcionario);
            console.log(`Funcionário '${funcionario.nome}' associado à etapa '${this.nome}'.`);
        } else {
            console.log(`Aviso: Funcionário '${funcionario.nome}' já está associado a esta etapa.`);
        }
    }
}