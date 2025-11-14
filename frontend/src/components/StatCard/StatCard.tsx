import React from 'react';
import './StatCard.css';

// A propriedade 'icon' deve ser do tipo React.ReactNode
interface StatCardProps {
    icon: React.ReactNode; 
    label: string;
    value: number;
    color: string;
}

const StatCard = ({ icon, label, value, color }: StatCardProps) => {
    // ... o resto do componente
    return (
        <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: color }}>
                {icon}
            </div>
            <div className="stat-info">
                <span className="stat-label">{label}</span>
                <span className="stat-value">{value}</span>
            </div>
        </div>
    );
};

export default StatCard;