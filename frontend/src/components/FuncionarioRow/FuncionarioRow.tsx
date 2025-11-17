import React from 'react';
import './FuncionarioRow.css';
import { Funcionario } from '../../models/Funcionario';
import { NivelPermissao } from '../../models/enums';
import { FaTrash } from 'react-icons/fa'; // Opcional, se quiser ícone de lixo

interface FuncionarioRowProps {
    funcionario: Funcionario;
    onRemove: (idFuncionario: number) => void;
    currentUser: Funcionario | null;
}

// Helper para o visual da "pill"
const getPermissaoClass = (nivel: NivelPermissao) => {
    switch (nivel) {
        case NivelPermissao.ADMINISTRADOR:
            return 'permissao-admin';
        case NivelPermissao.ENGENHEIRO:
            return 'permissao-engenheiro';
        case NivelPermissao.OPERADOR:
            return 'permissao-operador';
        default:
            return '';
    }
};

const FuncionarioRow: React.FC<FuncionarioRowProps> = ({ funcionario, onRemove, currentUser }) => {
    const permissaoClassName = getPermissaoClass(funcionario.nivelPermissao);

    const handleRemove = () => {
        if (window.confirm(`Tem a certeza que quer remover ${funcionario.nome}?`)) {
            onRemove(funcionario.id);
        }
    }

    const podeRemover = 
        currentUser?.nivelPermissao === NivelPermissao.ADMINISTRADOR &&
        currentUser?.id !== funcionario.id;

    // ESTE É O JSX CORRETO DA AV2
    return (
        <div className="funcionario-row">
            <div className="funcionario-info nome">{funcionario.nome}</div>
            <div className="funcionario-info email">{funcionario.email}</div>
            <div className="funcionario-info permissao">
                <span className={`permissao-pill ${permissaoClassName}`}>{funcionario.nivelPermissao}</span>
            </div>
            
            <div className="funcionario-actions">
                {podeRemover && (
                    <button 
                        className="action-button remove" // Reutilizando classe de CSS
                        onClick={handleRemove} 
                        title="Remover"
                    >
                        <FaTrash />
                    </button>
                )}
            </div>
        </div>
    );
};

export default FuncionarioRow;