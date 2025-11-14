import React from 'react';
import './FuncionarioRow.css';
import { Funcionario } from '../../models/Funcionario';
import { NivelPermissao } from '../../models/enums';
import { FaTrash } from 'react-icons/fa';

interface FuncionarioRowProps {
    funcionario: Funcionario;
    onRemove: (idFuncionario: number) => void;
    currentUser: Funcionario | null;
}

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

const FuncionarioRow = ({ funcionario, onRemove, currentUser }: FuncionarioRowProps) => {
    const permissaoClassName = getPermissaoClass(funcionario.nivelPermissao);

    return (
        <div className="funcionario-row">
            <div className="funcionario-info nome">{funcionario.nome}</div>
            <div className="funcionario-info email">{funcionario.email}</div>
            <div className="funcionario-info permissao">
                <span className={`permissao-pill ${permissaoClassName}`}>{funcionario.nivelPermissao}</span>
            </div>
            
            <div className="funcionario-actions">
                {}
                {currentUser && currentUser.nivelPermissao === NivelPermissao.ADMINISTRADOR && (
                    <button 
                        className="action-button remove" 
                        onClick={() => onRemove(funcionario.id)} 
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