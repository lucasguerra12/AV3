import React from 'react';
import './StageRow.css';
import { Etapa } from '../../models/Etapa';
import { StatusEtapa } from '../../models/enums';
import { FaPlay, FaCheck, FaUsers, FaTrash } from 'react-icons/fa';

interface StageRowProps {
    etapa: Etapa;
    onUpdateStatus: (etapa: Etapa, acao: 'iniciar' | 'finalizar') => void; 
    onRemove: (etapaId: number) => void;
    onManageFuncionarios: (etapa: Etapa) => void;
    isPreviousEtapaConcluida: boolean;
    isAnyEtapaEmAndamento: boolean;
    canManage: boolean;
}

const StageRow: React.FC<StageRowProps> = ({ 
    etapa, 
    onUpdateStatus, 
    onRemove, 
    onManageFuncionarios,
    isPreviousEtapaConcluida,
    isAnyEtapaEmAndamento,
    canManage
}) => {

    const handleUpdate = (acao: 'iniciar' | 'finalizar') => {
        onUpdateStatus(etapa, acao);
    }

    const handleRemove = () => {
        if (window.confirm(`Tem a certeza que quer remover a etapa "${etapa.nome}"?`)) {
            onRemove(etapa.id);
        }
    }

    const handleManage = () => {
        onManageFuncionarios(etapa);
    }
    const canStart = canManage && 
                     etapa.status === StatusEtapa.PENDENTE && 
                     isPreviousEtapaConcluida && 
                     !isAnyEtapaEmAndamento;
                     
    const canFinish = canManage && 
                      etapa.status === StatusEtapa.EM_ANDAMENTO;

    return (
        <div className={`stage-row ${etapa.status.toLowerCase()}`}>
            <div className="stage-info">
                <span className="stage-nome">{etapa.nome}</span>
                <span className="stage-prazo">
                    Prazo: {new Date(etapa.prazo).toLocaleDateString()}
                </span>
                <span className="stage-funcionarios">
                    {etapa.funcionarios.length} funcionário(s)
                </span>
            </div>
            
            <div className="stage-controls">
                {etapa.status === StatusEtapa.PENDENTE && (
                    <button 
                        onClick={() => handleUpdate('iniciar')} 
                        className="stage-btn start" 
                        disabled={!canStart}
                        title={!canStart ? "Aguarde a etapa anterior ou outra em andamento" : "Iniciar Etapa"}
                    >
                        <FaPlay /> Iniciar
                    </button>
                )}
                {etapa.status === StatusEtapa.EM_ANDAMENTO && (
                    <button 
                        onClick={() => handleUpdate('finalizar')} 
                        className="stage-btn finish"
                        disabled={!canFinish}
                    >
                        <FaCheck /> Finalizar
                    </button>
                )}
                {etapa.status === StatusEtapa.CONCLUIDA && (
                    <span className="status-badge-concluida"><FaCheck /> Concluída</span>
                )}
                <button 
                    onClick={handleManage} 
                    className="stage-btn manage"
                    disabled={!canManage}
                >
                    <FaUsers />
                </button>
                <button 
                    onClick={handleRemove} 
                    className="stage-btn remove"
                    disabled={!canManage}
                >
                    <FaTrash />
                </button>
            </div>
        </div>
    );
};

export default StageRow;