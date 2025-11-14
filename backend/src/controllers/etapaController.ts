import { Request, Response } from 'express';
import { prisma } from '../server';
import { StatusEtapa } from '@prisma/client';

export const adicionarEtapa = async (req: Request, res: Response) => {
    const { aeronaveId } = req.params; // Vamos usar o ID da aeronave
    const { nome, prazo } = req.body;
    if (!nome || !prazo) {
        return res.status(400).json({ message: 'Nome e Prazo são obrigatórios.' });
    }
    try {
        const novaEtapa = await prisma.etapa.create({
            data: {
                nome,
                prazo: new Date(prazo), // Converter string de data para objeto Date
                aeronaveId: parseInt(aeronaveId),
                status: StatusEtapa.PENDENTE,
            }
        });
        res.status(201).json(novaEtapa);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar etapa', error });
    }
};
export const removerEtapa = async (req: Request, res: Response) => {
    const { id } = req.params; 
    try {
        await prisma.etapa.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover etapa', error });
    }
};
export const atualizarStatusEtapa = async (req: Request, res: Response) => {
    const { id } = req.params; 
    const { acao } = req.body;
    if (acao !== 'iniciar' && acao !== 'finalizar') {
        return res.status(400).json({ message: "Ação inválida. Use 'iniciar' ou 'finalizar'." });
    }
    try {
        const etapaAtual = await prisma.etapa.findUnique({
            where: { id: parseInt(id) },
            include: { aeronave: { include: { etapas: true } } }
        });
        if (!etapaAtual) {
            return res.status(404).json({ message: 'Etapa não encontrada.' });
        }
        const aeronave = etapaAtual.aeronave;
        const etapasDaAeronave = aeronave.etapas.sort((a, b) => a.id - b.id);
        if (acao === 'iniciar') {
            if (etapaAtual.status !== StatusEtapa.PENDENTE) {
                return res.status(400).json({ message: 'Etapa não pode ser iniciada.' });
            }
            const algumaEmAndamento = etapasDaAeronave.some(e => e.status === StatusEtapa.EM_ANDAMENTO);
            if (algumaEmAndamento) {
                return res.status(409).json({ message: 'Já existe uma etapa em andamento nesta aeronave.' });
            }
            const indiceAtual = etapasDaAeronave.findIndex(e => e.id === etapaAtual.id);
            if (indiceAtual > 0) {
                const etapaAnterior = etapasDaAeronave[indiceAtual - 1];
                if (etapaAnterior.status !== StatusEtapa.CONCLUIDA) {
                    return res.status(409).json({ message: 'A etapa anterior precisa ser concluída primeiro.' });
                }
            }
            const etapaAtualizada = await prisma.etapa.update({
                where: { id: parseInt(id) },
                data: { status: StatusEtapa.EM_ANDAMENTO }
            });
            return res.json(etapaAtualizada);
        }

        if (acao === 'finalizar') {
            if (etapaAtual.status !== StatusEtapa.EM_ANDAMENTO) {
                return res.status(400).json({ message: 'Esta etapa não está em andamento.' });
            }
            const etapaAtualizada = await prisma.etapa.update({
                where: { id: parseInt(id) },
                data: { status: StatusEtapa.CONCLUIDA }
            });
            return res.json(etapaAtualizada);
        }

    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar status da etapa', error });
    }
};

export const gerirFuncionariosEtapa = async (req: Request, res: Response) => {
    const { id } = req.params; 
    const { funcionarioIds } = req.body; 

    if (!Array.isArray(funcionarioIds)) {
        return res.status(400).json({ message: 'O corpo da requisição deve conter um array "funcionarioIds".' });
    }

    try {
        const etapaAtualizada = await prisma.etapa.update({
            where: { id: parseInt(id) },
            data: {
                funcionarios: {
                    set: funcionarioIds.map((funcId: number) => ({ id: funcId }))
                }
            },
            include: { funcionarios: true } // Retorna a etapa com a nova lista de funcionários
        });
        
        res.json(etapaAtualizada);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao associar funcionários à etapa', error });
    }
};