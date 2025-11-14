import { TipoAeronave } from './enums';
import { Peca } from './Peca';
import { Etapa } from './Etapa';
import { Teste } from './Teste';
export class Aeronave {
    codigo: string;
    modelo: string;
    tipo: TipoAeronave;
    capacidade: number;
    alcance: number;
    pecas: Peca[] = [];
    etapas: Etapa[] = [];
    testes: Teste[] = [];
    constructor(codigo: string, modelo: string, tipo: TipoAeronave, capacidade: number, alcance: number) {
        this.codigo = codigo;
        this.modelo = modelo;
        this.tipo = tipo;
        this.capacidade = capacidade;
        this.alcance = alcance;
    }
    adicionarPeca(peca: Peca): void { this.pecas.push(peca); }
    adicionarEtapa(etapa: Etapa): void { this.etapas.push(etapa); }
    adicionarTeste(teste: Teste): void { this.testes.push(teste); }
    detalhes(): void {
        console.log(`\n--- Detalhes da Aeronave [${this.codigo}] ---`);
        console.log(`Modelo: ${this.modelo} | Tipo: ${this.tipo}`);
        console.log(`Capacidade: ${this.capacidade} passageiros | Alcance: ${this.alcance} km`);
        if (this.pecas.length > 0) {
            console.log("\n--- Peças Associadas ---");
            this.pecas.forEach(p => console.log(`  - ${p.nome} (${p.fornecedor}) - Status: ${p.status}`));
        }
        if (this.etapas.length > 0) {
            console.log("\n--- Etapas de Produção ---");
            this.etapas.forEach(e => {
                console.log(`  - ${e.nome} (Prazo: ${e.prazo.toLocaleDateString()}) - Status: ${e.status}`);
                if (e.funcionarios.length > 0) {
                    const nomes = e.funcionarios.map(f => f.nome).join(', ');
                    console.log(`    > Responsáveis: ${nomes}`);
                }
            });
        }
        if (this.testes.length > 0) {
            console.log("\n--- Testes Realizados ---");
            this.testes.forEach(t => console.log(`  - Teste ${t.tipo}: Resultado ${t.resultado}`));
        }
    }
}