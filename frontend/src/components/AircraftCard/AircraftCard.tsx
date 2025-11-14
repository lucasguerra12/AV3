import React from 'react';
import './AircraftCard.css';
import { Aeronave } from '../../models/Aeronave';
import { StatusEtapa } from '../../models/enums';
import { useNavigate } from 'react-router-dom';
import aircraftImage from '../../assets/aviao.jpg'; 

interface AircraftCardProps {
    aeronave: Aeronave;
}

const AircraftCard: React.FC<AircraftCardProps> = ({ aeronave }) => {
    const navigate = useNavigate();
    const etapasConcluidas = aeronave.etapas?.filter(
        (e) => e.status === StatusEtapa.CONCLUIDA
    ).length || 0;
    
    const totalEtapas = aeronave.etapas?.length || 0;
    
    const progresso = totalEtapas > 0 ? (etapasConcluidas / totalEtapas) * 100 : 0;

    const handleCardClick = () => {
        navigate(`/aeronave/${aeronave.codigo}`);
    };

    return (
        <div className="aircraft-card" onClick={handleCardClick}>
            <img src={aircraftImage} alt={aeronave.modelo} className="card-image" />
            <div className="card-content">
                <h3 className="card-title">{aeronave.modelo}</h3>
                <p className="card-subtitle">{aeronave.codigo}</p>
                <div className="progress-bar-container">
                    <div 
                        className="progress-bar-fill" 
                        style={{ width: `${progresso}%` }}
                    ></div>
                </div>
                <div className="card-footer">
                    <span>{progresso.toFixed(0)}%</span>
                    <span>{etapasConcluidas} / {totalEtapas} Etapas</span>
                </div>
            </div>
        </div>
    );
};

export default AircraftCard;