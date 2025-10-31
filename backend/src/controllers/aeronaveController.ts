import { Request, Response } from 'express';
import { prisma } from '../server';

/**
 * Lista todas as aeronaves, incluindo suas etapas e peças.
 * (Usado no Dashboard)
 */
export const listarAeronaves = async (req: Request, res: Response) => {
    try {
        const aeronaves = await prisma.aeronave.findMany({
            include: {
                etapas: true,
                pecas: true,
            },
        });
        res.json(aeronaves);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar aeronaves', error });
    }
};

/**
 * Obtém uma aeronave específica pelo seu código único.
 * (Usado na página de Detalhes da Aeronave)
 */
export const obterAeronavePorCodigo = async (req: Request, res: Response) => {
    const { codigo } = req.params;
    try {
        const aeronave = await prisma.aeronave.findUnique({
            where: { codigo: codigo },
            include: {
                etapas: { 
                    include: { funcionarios: true }, // Traz funcionários da etapa
                    orderBy: { id: 'asc' } // Garante a ordem das etapas
                }, 
                pecas: true,
                testes: true,
            },
        });

        if (!aeronave) {
            return res.status(404).json({ message: 'Aeronave não encontrada' });
        }
        res.json(aeronave);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao obter aeronave', error });
    }
};

/**
 * Adiciona uma nova aeronave ao banco de dados.
 * (Usado no Dashboard)
 */
export const adicionarAeronave = async (req: Request, res: Response) => {
    const { codigo, modelo, tipo, capacidade, alcance } = req.body;

    // Validação básica
    if (!codigo || !modelo || !tipo) {
        return res.status(400).json({ message: "Código, Modelo e Tipo são obrigatórios." });
    }

    try {
        const novaAeronave = await prisma.aeronave.create({
            data: {
                codigo,
                modelo,
                tipo,
                capacidade: parseInt(capacidade) || 0,
                alcance: parseInt(alcance) || 0,
            },
        });
        res.status(201).json(novaAeronave);
    } catch (error: any) {
        // Tratar erro de código duplicado (P-2002)
        if (error.code === 'P2002' && error.meta?.target.includes('codigo')) {
            return res.status(409).json({ message: 'Erro: Já existe uma aeronave com este código.' });
        }
        res.status(500).json({ message: 'Erro ao adicionar aeronave', error });
    }
};