import React, { useState } from 'react';
import './Funcionarios.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import FuncionarioRow from '../../components/FuncionarioRow/FuncionarioRow';
import { Funcionario } from '../../models/Funcionario';
import { NivelPermissao } from '../../models/enums';

interface FuncionariosProps {
    currentUser: Funcionario | null;
    funcionarios: Funcionario[];
    onAdicionarFuncionario: (novoFuncionario: Funcionario) => void;
    onRemoverFuncionario: (idFuncionario: number) => void;
}

const Funcionarios = ({ currentUser, funcionarios, onAdicionarFuncionario, onRemoverFuncionario }: FuncionariosProps) => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [nivel, setNivel] = useState<NivelPermissao>(NivelPermissao.OPERADOR);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!nome || !email || !senha) return alert("Preencha todos os campos.");

        const novoFuncionario = new Funcionario(0, nome, '', '', email, senha, nivel);
        onAdicionarFuncionario(novoFuncionario);
        
        setNome('');
        setEmail('');
        setSenha('');
    }

    return (
        <div className="funcionarios-layout">
            <Sidebar />
            <main className="main-content">
                <header className="header"><h2>Gestão de Funcionários</h2></header>
                {}
                {currentUser && currentUser.nivelPermissao === NivelPermissao.ADMINISTRADOR && (
                    <section className="add-form-container">
                        <h3>Adicionar Novo Funcionário</h3>
                        <form onSubmit={handleSubmit} className="add-form">
                            <input type="text" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} required />
                            <input type="email" placeholder="Email (login)" value={email} onChange={e => setEmail(e.target.value)} required />
                            <select value={nivel} onChange={e => setNivel(e.target.value as NivelPermissao)}>
                                <option value={NivelPermissao.OPERADOR}>Operador</option>
                                <option value={NivelPermissao.ENGENHEIRO}>Engenheiro</option>
                                <option value={NivelPermissao.ADMINISTRADOR}>Administrador</option>
                            </select>
                            <button type="submit" className="add-button-small">Adicionar</button>
                        </form>
                    </section>
                )}

                <section className="list-section">
                    <div className="funcionarios-list">
                        {funcionarios.map(funcionario => (
                            <FuncionarioRow 
                                key={funcionario.id} 
                                funcionario={funcionario} 
                                onRemove={onRemoverFuncionario} 
                                currentUser={currentUser}
                            />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Funcionarios;