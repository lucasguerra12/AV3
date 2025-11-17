import React from 'react';
import './AircraftCard.css'; // Importa o CSS correto
import { Aeronave } from '../../models/Aeronave';
import { StatusEtapa } from '../../models/enums';
import { useNavigate } from 'react-router-dom'; // Importa o useNavigate

interface AircraftCardProps {
    aeronave: Aeronave;
}

const AircraftCard: React.FC<AircraftCardProps> = ({ aeronave }) => {
    const navigate = useNavigate(); // Hook para navegação

    const totalEtapas = aeronave.etapas?.length || 0;
    const etapasConcluidas = aeronave.etapas?.filter(e => e.status === StatusEtapa.CONCLUIDA).length || 0;
    
    const progress = totalEtapas > 0 ? Math.floor((etapasConcluidas / totalEtapas) * 100) : 0;
    
    let statusText = "Pendente";
    let statusColor = "#6c757d"; 

    if (totalEtapas > 0) {
        if (progress === 100) {
            statusText = "Concluída";
            statusColor = "#4caf50"; 
        } else if (etapasConcluidas > 0 || aeronave.etapas?.some(e => e.status === StatusEtapa.EM_ANDAMENTO)) {
            statusText = "Em Andamento";
            statusColor = "#ff9800"; 
        }
    }

    // Função para navegar ao clicar
    const handleCardClick = () => {
        navigate(`/aeronave/${aeronave.codigo}`);
    };

    // Este é o JSX exato da AV2
    return (
        <div className="aircraft-card-link" onClick={handleCardClick}>
            <div className="aircraft-card-new">
                <div className="info-section">
                    <span className="info-label">Modelo</span>
                    <span className="info-value">{aeronave.modelo}</span>
                </div>
                <div className="info-section">
                    <span className="info-label">Código</span>
                    <span className="info-value">{aeronave.codigo}</span>
                </div>
                <div className="info-section">
                    <span className="info-label">Status</span>
                    <span className="info-value status-pill" style={{ backgroundColor: statusColor }}>
                        {statusText}
                    </span>
                </div>
                <div className="progress-section">
                    <div className="progress-bar-container-new">
                        <div className="progress-bar-new" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
                <div className="action-section">
                    <button className="details-button-new">Ver Detalhes</button>
                </div>
            </div>
        </div>
    );
};

export default AircraftCard;