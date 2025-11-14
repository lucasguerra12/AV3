import { Aeronave } from "./Aeronave";

export class Relatorio {
    public gerarConteudo(aeronave: Aeronave, nomeCliente: string): string {
        let conteudo = `--- Relatório Final de Aeronave ---\n\n`;
        conteudo += `Data de Emissão: ${new Date().toLocaleDateString()}\n`;
        conteudo += `Cliente: ${nomeCliente}\n\n`;
        conteudo += `AERONAVE\n`;
        conteudo += `Código: ${aeronave.codigo}\nModelo: ${aeronave.modelo}\nTipo: ${aeronave.tipo}\n\n`;
        
        conteudo += `PEÇAS UTILIZADAS\n`;
        if (aeronave.pecas.length > 0) {
            aeronave.pecas.forEach(p => { conteudo += `- ${p.nome} (Fornecedor: ${p.fornecedor}) - Status: ${p.status}\n`; });
        } else {
            conteudo += `- Nenhuma peça cadastrada.\n`;
        }
        
        conteudo += `\nETAPAS REALIZADAS\n`;
        if (aeronave.etapas.length > 0) {
            aeronave.etapas.forEach(e => { conteudo += `- ${e.nome} (Prazo: ${e.prazo.toLocaleDateString()}) - Status: ${e.status}\n`; });
        } else {
            conteudo += `- Nenhuma etapa cadastrada.\n`;
        }

        conteudo += `\nRESULTADOS DOS TESTES\n`;
        if (aeronave.testes.length > 0) {
            aeronave.testes.forEach(t => { conteudo += `- Teste ${t.tipo}: ${t.resultado}\n`; });
        } else {
            conteudo += `- Nenhum teste registrado.\n`;
        }

        return conteudo;
    }

}