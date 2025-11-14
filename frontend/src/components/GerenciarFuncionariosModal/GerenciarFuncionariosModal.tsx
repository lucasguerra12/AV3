import React, { useState, useEffect } from 'react';
import './GerenciarFuncionariosModal.css';
import { Etapa } from '../../models/Etapa';
import { Funcionario } from '../../models/Funcionario';

interface GerenciarFuncionariosModalProps {
    etapa: Etapa | null;
    todosFuncionarios: Funcionario[];
    onClose: () => void;
    onSave: (funcionariosSelecionados: Funcionario[]) => void;
}

const GerenciarFuncionariosModal = ({ etapa, todosFuncionarios, onClose, onSave }: GerenciarFuncionariosModalProps) => {
    const [selecionados, setSelecionados] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (etapa) {
            const idsAtuais = new Set(etapa.funcionarios.map(f => f.id));
            setSelecionados(idsAtuais);
        }
    }, [etapa]);

    if (!etapa) {
        return null;
    }

    const handleCheckboxChange = (funcionarioId: number) => {
        const novosSelecionados = new Set(selecionados);
        if (novosSelecionados.has(funcionarioId)) {
            novosSelecionados.delete(funcionarioId);
        } else {
            novosSelecionados.add(funcionarioId);
        }
        setSelecionados(novosSelecionados);
    };

    const handleSave = () => {
        const funcionariosSelecionados = todosFuncionarios.filter(f => selecionados.has(f.id));
        onSave(funcionariosSelecionados);
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Gerir Responsáveis para: {etapa.nome}</h2>
                <div className="funcionarios-list">
                    {todosFuncionarios.map(funcionario => (
                        <div key={funcionario.id} className="funcionario-item">
                            <input
                                type="checkbox"
                                id={`func-${funcionario.id}`}
                                checked={selecionados.has(funcionario.id)}
                                onChange={() => handleCheckboxChange(funcionario.id)}
                            />
                            <label htmlFor={`func-${funcionario.id}`}>{funcionario.nome} - ({funcionario.nivelPermissao})</label>
                        </div>
                    ))}
                </div>
                <div className="modal-actions">
                    <button onClick={onClose} className="button-cancel">Cancelar</button>
                    <button onClick={handleSave} className="button-save">Guardar</button>
                </div>
            </div>
        </div>
    );
};

export default GerenciarFuncionariosModal;