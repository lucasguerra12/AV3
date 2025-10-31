import { Request, Response } from 'express';
import { prisma } from '../server'; // Importamos o cliente Prisma do server.ts

/**
 * Lida com a tentativa de login de um funcionário
 */
export const login = async (req: Request, res: Response) => {
    const { email, senha } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email é obrigatório' });
    }
    
    // Na AV3, o login deve pedir email E senha.
    if (!senha) {
        return res.status(400).json({ message: 'Senha é obrigatória' });
    }

    try {
        const funcionario = await prisma.funcionario.findUnique({
            where: { email: email },
        });

        if (!funcionario) {
            return res.status(404).json({ message: 'Utilizador não encontrado' });
        }
        
        // Verificação de senha (simples, como na AV1/AV2)
        // NOTA: Num sistema real, usaríamos bcrypt.compare()
        if (funcionario.senha !== senha) {
           return res.status(401).json({ message: 'Senha incorreta' });
        }

        // Retornar o funcionário sem a senha por segurança
        const { senha: _, ...user } = funcionario;
        res.json(user);
        
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error });
    }
};