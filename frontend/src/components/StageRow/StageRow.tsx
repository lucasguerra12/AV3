import React from 'react';
import './StageRow.css';
import { Etapa } from '../../models/Etapa';
import { FaCheckCircle, FaCog, FaClock, FaTrash, FaUsers } from 'react-icons/fa';
import { StatusEtapa } from '../../models/enums';

interface StageRowProps {
    etapa: Etapa;
    onUpdateStatus: (etapa: Etapa, acao: 'iniciar' | 'finalizar') => void;
    onRemove: (nomeEtapa: string) => void;
    onManageFuncionarios: () => void;
    isPreviousEtapaConcluida: boolean;
    isAnyEtapaEmAndamento: boolean;
    canManage: boolean; 
}

const getStatusInfo = (status: StatusEtapa) => {
    switch (status) {
        case StatusEtapa.CONCLUIDA:
            return { icon: <FaCheckCircle />, text: 'Concluída', color: '#4caf50' };
        case StatusEtapa.EM_ANDAMENTO:
            return { icon: <FaCog />, text: 'Em Andamento', color: '#ff9800' };
        case StatusEtapa.PENDENTE:
        default:
            return { icon: <FaClock />, text: 'Pendente', color: '#6c757d' };
    }
};


const StageRow = ({ etapa, onUpdateStatus, onRemove, onManageFuncionarios, isPreviousEtapaConcluida, isAnyEtapaEmAndamento, canManage }: StageRowProps) => {
    const statusInfo = getStatusInfo(etapa.status);

    const canInitiate = etapa.status === StatusEtapa.PENDENTE && isPreviousEtapaConcluida && !isAnyEtapaEmAndamento;
    const canFinish = etapa.status === StatusEtapa.EM_ANDAMENTO;

    return (
        <div className="stage-row">
            <div className="stage-name">{etapa.nome}</div>
            <div className="stage-deadline">
                Prazo: {etapa.prazo.toLocaleDateString()}
            </div>
            <div className="stage-responsible">
                Responsáveis: {etapa.funcionarios?.length || 0}
            </div>
            <div className="stage-status" style={{ color: statusInfo.color }}>
                {statusInfo.icon}
                <span>{statusInfo.text}</span>
            </div>
            
            <div className="stage-actions">
                {canManage && (
                    <button 
                        className="manage-button"
                        onClick={onManageFuncionarios}
                        title="Gerir Responsáveis"
                    >
                        <FaUsers />
                    </button>
                )}

                {etapa.status === StatusEtapa.PENDENTE && (
                    <button 
                        className="manage-button start"
                        onClick={() => onUpdateStatus(etapa, 'iniciar')}
                        disabled={!canInitiate}
                        title={!canInitiate ? "Aguarde a etapa anterior ou outra em andamento ser finalizada" : "Iniciar Etapa"}
                    >
                        Iniciar
                    </button>
                )}
                {etapa.status === StatusEtapa.EM_ANDAMENTO && (
                    <button 
                        className="manage-button finish"
                        onClick={() => onUpdateStatus(etapa, 'finalizar')}
                        disabled={!canFinish}
                    >
                        Finalizar
                    </button>
                )}
                
                {canManage && (
                    <button 
                        className="manage-button remove"
                        onClick={() => onRemove(etapa.nome)}
                        title="Remover Etapa"
                    >
                        <FaTrash />
                    </button>
                )}
            </div>
        </div>
    );
};

export default StageRow;