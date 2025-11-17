import { Request, Response } from 'express';
import { prisma } from '../server';
import { NivelPermissao } from '@prisma/client'; // Importar o Enum

export const login = async (req: Request, res: Response) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: 'Email e Senha são obrigatórios' });
    }

    try {
        let funcionario = await prisma.funcionario.findUnique({
            where: { email: email },
        });

        // --- INÍCIO DA NOVA LÓGICA ---
        if (!funcionario) {
            // Utilizador não encontrado. Vamos verificar se é o primeiro login.
            const totalUsers = await prisma.funcionario.count();

            if (totalUsers === 0) {
                // A tabela está vazia! Este é o primeiro utilizador.
                // Vamos criá-lo como Administrador.
                console.log("Primeiro login detectado. Criando novo Administrador...");
                
                funcionario = await prisma.funcionario.create({
                    data: {
                        nome: "Admin (Auto-Gerado)", // Pode mudar o nome depois
                        email: email,
                        senha: senha, // (Em produção, usaríamos hash)
                        nivelPermissao: NivelPermissao.ADMINISTRADOR,
                    }
                });
                
                // O 'funcionario' agora existe. O código continua normalmente.

            } else {
                // A tabela não está vazia, o utilizador simplesmente não existe.
                return res.status(404).json({ message: 'Utilizador não encontrado' });
            }
        }
        // --- FIM DA NOVA LÓGICA ---

        // Verificação de senha (como antes)
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