import React from 'react';
import './PecaRow.css';
import { Peca } from '../../models/Peca';
import { StatusPeca, NivelPermissao } from '../../models/enums';

interface PecaRowProps {
    peca: Peca;
    canManage: boolean; 
    onUpdateStatus: (peca: Peca, novoStatus: StatusPeca) => void; 
    onRemove: (pecaId: number) => void; 
}

const PecaRow: React.FC<PecaRowProps> = ({ peca, canManage, onUpdateStatus, onRemove }) => {

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdateStatus(peca, e.target.value as StatusPeca);
    }
    const handleRemove = () => {
        if (window.confirm(`Tem a certeza que quer remover a peça ${peca.nome}?`)) {
            onRemove(peca.id);
        }
    }
    return (
        <div className="peca-row">
            <div className="peca-info">
                <span className="peca-nome">{peca.nome}</span>
                <span className="peca-fornecedor">{peca.fornecedor} ({peca.tipo})</span>
            </div>
            <div className="peca-status-controls">
                {canManage ? (
                    <select 
                        value={peca.status} 
                        onChange={handleStatusChange} 
                        className={`status-select status-${peca.status.toLowerCase()}`}
                    >
                        <option value={StatusPeca.EM_PRODUCAO}>Em Produção</option>
                        <option value={StatusPeca.EM_TRANSPORTE}>Em Transporte</option>
                        <option value={StatusPeca.PRONTA}>Pronta</option>
                    </select>
                ) : (
                    <span className={`status-badge status-${peca.status.toLowerCase()}`}>
                        {peca.status.replace('_', ' ')}
                    </span>
                )}
                
                {canManage && (
                    <button onClick={handleRemove} className="remove-btn-small">×</button>
                )}
            </div>
        </div>
    );
};

export default PecaRow;