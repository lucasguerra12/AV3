import React from 'react';
import './AircraftCard.css';
import { Aeronave } from '../../models/Aeronave';
import { Link } from 'react-router-dom';
import { StatusEtapa } from '../../models/enums';

interface AircraftCardProps {
    aeronave: Aeronave;
}

const AircraftCard = ({ aeronave }: AircraftCardProps) => {
    const totalEtapas = aeronave.etapas.length;
    const etapasConcluidas = aeronave.etapas.filter(e => e.status === StatusEtapa.CONCLUIDA).length;
    
    const progress = totalEtapas > 0 ? Math.floor((etapasConcluidas / totalEtapas) * 100) : 0;
    
    let statusText = "Pendente";
    let statusColor = "#6c757d"; 

    if (totalEtapas > 0) {
        if (progress === 100) {
            statusText = "Concluída";
            statusColor = "#4caf50"; 
        } else if (etapasConcluidas > 0 || aeronave.etapas.some(e => e.status === StatusEtapa.EM_ANDAMENTO)) {
            statusText = "Em Andamento";
            statusColor = "#ff9800"; 
        }
    }

    return (
        <Link to={`/aeronave/${aeronave.codigo}`} className="aircraft-card-link">
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
        </Link>
    );
};

export default AircraftCard;