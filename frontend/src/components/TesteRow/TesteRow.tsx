import React from 'react';
import './TesteRow.css';
import { Teste } from '../../models/Teste';
import { ResultadoTeste } from '../../models/enums';
import { FaTrash } from 'react-icons/fa'; 

interface TesteRowProps {
    teste: Teste;
    index: number;
    onRemove: (index: number) => void;
    canManage: boolean;
}

const getResultadoInfo = (resultado: ResultadoTeste) => {
    switch (resultado) {
        case ResultadoTeste.APROVADO:
            return { text: 'Aprovado', className: 'resultado-aprovado' };
        case ResultadoTeste.REPROVADO:
        default:
            return { text: 'Reprovado', className: 'resultado-reprovado' };
    }
};


const TesteRow = ({ teste, index, onRemove, canManage }: TesteRowProps) => {
    const resultadoInfo = getResultadoInfo(teste.resultado);

    return (
        <div className="teste-row">
            <div className="teste-info tipo">{teste.tipo}</div>
            <div className="teste-info resultado">
                <span className={`resultado-pill ${resultadoInfo.className}`}>
                    {resultadoInfo.text}
                </span>
            </div>
            <div className="teste-actions">
                {canManage && (
                    <button 
                        className="action-button remove"
                        onClick={() => onRemove(index)}
                        title="Remover Teste"
                    >
                        <FaTrash />
                    </button>
                )}
            </div>
        </div>
    );
};

export default TesteRow;