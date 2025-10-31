import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para cronometrar o tempo de processamento de cada requisição no servidor.
 * (Requisito da AV3 para o relatório de qualidade)
 */
export const timingMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = process.hrtime(); // Marca o tempo de início

    // Aguarda o evento 'finish' (quando a resposta é enviada)
    res.on('finish', () => {
        const diff = process.hrtime(start); // Calcula a diferença
        // Converte [segundos, nanossegundos] para milissegundos
        const processingTime = (diff[0] * 1e9 + diff[1]) / 1e6; 
        
        // Loga no console do backend
        console.log(
            `[Metrics] ${req.method} ${req.originalUrl} - Processamento: ${processingTime.toFixed(3)} ms`
        );
    });

    // Continua para a próxima rota
    next();
};