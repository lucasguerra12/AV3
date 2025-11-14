import { Request, Response } from 'express';
import { prisma } from '../server';
import { TipoTeste, ResultadoTeste } from '@prisma/client'; // Importar os enums

/**
 * Adiciona um novo teste a uma aeronave.
 */
export const adicionarTeste = async (req: Request, res: Response) => {
    const { aeronaveId } = req.params; // ID da Aeronave
    const { tipo, resultado } = req.body;

    // Validação para garantir que os valores são válidos
    if (!tipo || !(tipo in TipoTeste)) {
        return res.status(400).json({ message: 'Tipo de teste inválido.' });
    }
    if (!resultado || !(resultado in ResultadoTeste)) {
        return res.status(400).json({ message: 'Resultado de teste inválido.' });
    }

    try {
        const novoTeste = await prisma.teste.create({
            data: {
                tipo,
                resultado,
                aeronaveId: parseInt(aeronaveId),
            }
        });
        res.status(201).json(novoTeste);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar teste', error });
    }
};

/**
 * Remove um teste.
 */
export const removerTeste = async (req: Request, res: Response) => {
    const { id } = req.params; // ID do Teste
    try {
        await prisma.teste.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover teste', error });
    }
};