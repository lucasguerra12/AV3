import { Request, Response } from 'express';
import { prisma } from '../server';

export const listarFuncionarios = async (req: Request, res: Response) => {
    try {
        const funcionarios = await prisma.funcionario.findMany({
            // Excluir a senha do retorno por segurança
            select: {
                id: true,
                nome: true,
                telefone: true,
                endereco: true,
                email: true,
                nivelPermissao: true
            }
        });
        res.json(funcionarios);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar funcionários', error });
    }
};

/**
 * Adiciona um novo funcionário.
 * (Apenas Administradores devem ter acesso a esta rota)
 */
export const adicionarFuncionario = async (req: Request, res: Response) => {
    const { nome, email, senha, nivelPermissao, telefone, endereco } = req.body;

    if (!nome || !email || !senha || !nivelPermissao) {
        return res.status(400).json({ message: 'Nome, Email, Senha e Nível de Permissão são obrigatórios.' });
    }

    try {
        const novoFuncionario = await prisma.funcionario.create({
            data: {
                nome,
                email,
                senha, // NOTA: Em produção, isto seria uma hash (bcrypt)
                nivelPermissao,
                telefone,
                endereco,
            }
        });

        // Retornar o funcionário criado (sem a senha)
        const { senha: _, ...user } = novoFuncionario;
        res.status(201).json(user);

    } catch (error: any) {
        // Tratar erro de email duplicado
        if (error.code === 'P2002' && error.meta?.target.includes('email')) {
            return res.status(409).json({ message: 'Erro: Já existe um funcionário com este email.' });
        }
        res.status(500).json({ message: 'Erro ao adicionar funcionário', error });
    }
};

/**
 * Remove um funcionário pelo ID.
 * (Apenas Administradores devem ter acesso)
 */
export const removerFuncionario = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.funcionario.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send(); // 204 No Content (sucesso sem corpo)
    } catch (error: any) {
        // Tratar erro de funcionário não encontrado
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Funcionário não encontrado.' });
        }
        res.status(500).json({ message: 'Erro ao remover funcionário', error });
    }
};