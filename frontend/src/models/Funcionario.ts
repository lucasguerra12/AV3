import { NivelPermissao } from "./enums";

// Alterado de 'class' para 'interface'
export interface Funcionario {
    id: number;
    nome: string;
    telefone: string;
    endereco: string;
    email: string; 
    senha?: string; // Senha é opcional no frontend (só a enviamos ao criar)
    nivelPermissao: NivelPermissao;
    // Removemos o método autenticar()
}