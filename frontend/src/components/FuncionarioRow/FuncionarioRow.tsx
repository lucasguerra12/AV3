import React from 'react';
import './FuncionarioRow.css';
import { Funcionario } from '../../models/Funcionario';
import { NivelPermissao } from '../../models/enums';

interface FuncionarioRowProps {
    funcionario: Funcionario;
    onRemove: (idFuncionario: number) => void;
    currentUser: Funcionario | null; 
}

const FuncionarioRow: React.FC<FuncionarioRowProps> = ({ funcionario, onRemove, currentUser }) => {

    const handleRemove = () => {
        if (window.confirm(`Tem a certeza que quer remover ${funcionario.nome}?`)) {
            onRemove(funcionario.id);
        }
    }
    const podeRemover = 
        currentUser?.nivelPermissao === NivelPermissao.ADMINISTRADOR &&
        currentUser?.id !== funcionario.id;

    return (
        <div className="funcionario-row">
            <div className="funcionario-info">
                <span className="funcionario-nome">{funcionario.nome}</span>
                <span className="funcionario-email">{funcionario.email}</span>
            </div>
            <div className="funcionario-details">
                <span className="funcionario-nivel">{funcionario.nivelPermissao}</span>
                {podeRemover && (
                    <button onClick={handleRemove} className="remove-btn">Remover</button>
                )}
            </div>
        </div>
    );
};

export default FuncionarioRow;