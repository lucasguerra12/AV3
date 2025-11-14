import React from 'react';
import './TesteRow.css';
import { Teste } from '../../models/Teste';
import { ResultadoTeste } from '../../models/enums';

interface TesteRowProps {
    teste: Teste;
    index: number; 
    canManage: boolean;
    onRemove: (testeId: number) => void;
}

const TesteRow: React.FC<TesteRowProps> = ({ teste, index, canManage, onRemove }) => {

    const handleRemove = () => {
        if (window.confirm(`Tem a certeza que quer remover o teste "${teste.tipo}"?`)) {
            onRemove(teste.id);
        }
    }

    const isAprovado = teste.resultado === ResultadoTeste.APROVADO;

    return (
        <div className={`teste-row ${isAprovado ? 'aprovado' : 'reprovado'}`}>
            <div className="teste-info">
                <span className="teste-nome">Teste #{index + 1}: {teste.tipo}</span>
                <span className="teste-resultado">{teste.resultado}</span>
            </div>
            {canManage && (
                <button onClick={handleRemove} className="remove-btn-small">×</button>
            )}
        </div>
    );
};

export default TesteRow;