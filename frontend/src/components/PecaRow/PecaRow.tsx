import React from 'react';
import './PecaRow.css';
import { Peca } from '../../models/Peca';
import { StatusPeca } from '../../models/enums';
import { FaTrash, FaShippingFast, FaCheck } from 'react-icons/fa';

interface PecaRowProps {
    peca: Peca;
    onUpdateStatus: (peca: Peca, novoStatus: StatusPeca) => void;
    onRemove: (nomePeca: string) => void;
    canManage: boolean;
}

const getStatusClass = (status: StatusPeca) => {
    switch (status) {
        case StatusPeca.PRONTA:
            return 'status-pronta';
        case StatusPeca.EM_TRANSPORTE:
            return 'status-transporte';
        case StatusPeca.EM_PRODUCAO:
        default:
            return 'status-producao';
    }
};


const PecaRow = ({ peca, onUpdateStatus, onRemove, canManage }: PecaRowProps) => {
    const statusClassName = getStatusClass(peca.status);

    return (
        <div className="peca-row">
            <div className="peca-info nome">{peca.nome}</div>
            <div className="peca-info tipo">{peca.tipo}</div>
            <div className="peca-info fornecedor">{peca.fornecedor}</div>
            <div className="peca-info status">
                <span className={`status-pill ${statusClassName}`}>
                    {peca.status}
                </span>
            </div>
            <div className="peca-actions">
                {peca.status === StatusPeca.EM_PRODUCAO && (
                    <button 
                        className="action-button transport" 
                        onClick={() => onUpdateStatus(peca, StatusPeca.EM_TRANSPORTE)}
                        title="Marcar como Em Transporte"
                    >
                        <FaShippingFast />
                    </button>
                )}
                {peca.status === StatusPeca.EM_TRANSPORTE && (
                    <button 
                        className="action-button ready" 
                        onClick={() => onUpdateStatus(peca, StatusPeca.PRONTA)}
                        title="Marcar como Pronta"
                    >
                        <FaCheck />
                    </button>
                )}
                {canManage && (
                    <button 
                        className="action-button remove"
                        onClick={() => onRemove(peca.nome)}
                        title="Remover Peça"
                    >
                        <FaTrash />
                    </button>
                )}
            </div>
        </div>
    );
};

export default PecaRow;