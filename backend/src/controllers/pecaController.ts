import { Request, Response } from 'express';
import { prisma } from '../server';
import { StatusPeca } from '@prisma/client'; // Importar o enum

/**
 * Adiciona uma nova peça a uma aeronave.
 */
export const adicionarPeca = async (req: Request, res: Response) => {
    const { aeronaveId } = req.params; // ID da Aeronave
    const { nome, tipo, fornecedor } = req.body;

    if (!nome || !tipo || !fornecedor) {
        return res.status(400).json({ message: 'Nome, Tipo e Fornecedor são obrigatórios.' });
    }

    try {
        const novaPeca = await prisma.peca.create({
            data: {
                nome,
                tipo,
                fornecedor,
                aeronaveId: parseInt(aeronaveId),
                status: StatusPeca.EM_PRODUCAO, // Status inicial padrão
            }
        });
        res.status(201).json(novaPeca);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar peça', error });
    }
};

/**
 * Remove uma peça.
 */
export const removerPeca = async (req: Request, res: Response) => {
    const { id } = req.params; // ID da Peça
    try {
        await prisma.peca.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover peça', error });
    }
};

/**
 * Atualiza o status de uma peça (Em Produção -> Em Transporte -> Pronta).
 */
export const atualizarStatusPeca = async (req: Request, res: Response) => {
    const { id } = req.params; // ID da Peça
    const { novoStatus } = req.body; // 'EM_TRANSPORTE' ou 'PRONTA'

    // Validação para garantir que o status é um dos valores esperados do enum
    if (!novoStatus || !(novoStatus in StatusPeca)) {
         return res.status(400).json({ message: 'Status inválido.' });
    }

    try {
        // Lógica de negócio (Poderíamos validar a transição, ex: não pode voltar de PRONTA para EM_PRODUCAO)
        // Por agora, vamos permitir a atualização direta conforme o front-end da AV2
        
        const pecaAtualizada = await prisma.peca.update({
            where: { id: parseInt(id) },
            data: { status: novoStatus }
        });
        
        res.json(pecaAtualizada);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar status da peça', error });
    }
};