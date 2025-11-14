import { TipoTeste, ResultadoTeste } from "./enums";

export interface Teste {
    id: number; 
    tipo: TipoTeste;
    resultado: ResultadoTeste;
    aeronaveId: number; 
}