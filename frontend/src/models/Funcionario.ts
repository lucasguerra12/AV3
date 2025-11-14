import { NivelPermissao } from "./enums";

export class Funcionario {
    id: number;
    nome: string;
    telefone: string;
    endereco: string;
    email: string; 
    private senha: string;
    nivelPermissao: NivelPermissao;

    constructor(id: number, nome: string, telefone: string, endereco: string, email: string, senha?: string, nivelPermissao?: NivelPermissao) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.endereco = endereco;
        this.email = email;
        this.senha = senha || ''; 
        this.nivelPermissao = nivelPermissao || NivelPermissao.OPERADOR;
    }
    autenticar(senhaDigitada: string): boolean {
        return this.senha === senhaDigitada;
    }
}