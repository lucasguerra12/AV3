import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AircraftDetails.css'; 
import * as api from '../../services/api'; 

import { Aeronave } from '../../models/Aeronave';
import { Funcionario } from '../../models/Funcionario';
import { Peca } from '../../models/Peca';
import { Etapa } from '../../models/Etapa';
import { Teste } from '../../models/Teste';
import { NivelPermissao, StatusEtapa, StatusPeca, TipoPeca, TipoTeste, ResultadoTeste } from '../../models/enums';

import Sidebar from '../../components/Sidebar/Sidebar';
import StatCard from '../../components/StatCard/StatCard';
import PecaRow from '../../components/PecaRow/PecaRow';
import StageRow from '../../components/StageRow/StageRow';
import TesteRow from '../../components/TesteRow/TesteRow';
import GerenciarFuncionariosModal from '../../components/GerenciarFuncionariosModal/GerenciarFuncionariosModal';

import { FaChartLine, FaCheckCircle, FaTools, FaVial } from 'react-icons/fa';

interface AircraftDetailsProps {
    currentUser: Funcionario;
    onUpdateAeronave: (aeronaveAtualizada: Aeronave) => void;
    todosFuncionarios: Funcionario[];
}

const AircraftDetails: React.FC<AircraftDetailsProps> = ({ currentUser, onUpdateAeronave, todosFuncionarios }) => {
    const { codigo } = useParams<{ codigo: string }>();
    const navigate = useNavigate();

    // Estado local
    const [aeronave, setAeronave] = useState<Aeronave | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estados dos formulários e modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [etapaParaGerenciar, setEtapaParaGerenciar] = useState<Etapa | null>(null);
    const [novaPeca, setNovaPeca] = useState({ nome: '', tipo: TipoPeca.NACIONAL, fornecedor: '' });
    const [novoTeste, setNovoTeste] = useState({ tipo: TipoTeste.ELETRICO, resultado: ResultadoTeste.APROVADO });
    const [novaEtapa, setNovaEtapa] = useState({ nome: '', prazo: '' });

    useEffect(() => {
        if (!codigo) {
            setError("Código da aeronave não encontrado na URL.");
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        api.apiObterAeronave(codigo)
            .then(data => {
                setAeronave(data);
                setIsLoading(false);
            })
            .catch((err: any) => {
                console.error("Erro ao buscar aeronave:", err);
                setError(err.message || "Falha ao carregar dados da aeronave.");
                setIsLoading(false);
            });
    }, [codigo]); 

    
    const handleAdicionarPeca = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!aeronave) return;
        try {
            const pecaAdicionada = await api.apiAdicionarPeca(aeronave.id, novaPeca);
            setAeronave(atual => atual ? { ...atual, pecas: [...atual.pecas, pecaAdicionada] } : null);
            setNovaPeca({ nome: '', tipo: TipoPeca.NACIONAL, fornecedor: '' }); 
        } catch (err: any) {
            alert(`Erro: ${err.message}`);
        }
    };

    const handleRemoverPeca = async (pecaId: number) => {
        if (!aeronave) return;
        try {
            await api.apiRemoverPeca(pecaId);
            setAeronave(atual => atual ? { ...atual, pecas: atual.pecas.filter(p => p.id !== pecaId) } : null);
        } catch (err: any) {
            alert(`Erro: ${err.message}`);
        }
    };

    const handleAtualizarStatusPeca = async (pecaId: number, novoStatus: StatusPeca) => {
        if (!aeronave) return;
        try {
            const pecaAtualizada = await api.apiAtualizarStatusPeca(pecaId, novoStatus);
            setAeronave(atual => atual ? { ...atual, pecas: atual.pecas.map(p => p.id === pecaId ? pecaAtualizada : p) } : null);
        } catch (err: any) {
            alert(`Erro: ${err.message}`);
        }
    };

    const handleAdicionarTeste = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!aeronave) return;
        try {
            const testeAdicionado = await api.apiAdicionarTeste(aeronave.id, novoTeste);
            setAeronave(atual => atual ? { ...atual, testes: [...atual.testes, testeAdicionado] } : null);
        } catch (err: any) {
            alert(`Erro: ${err.message}`);
        }
    };

    const handleRemoverTeste = async (testeId: number) => {
        if (!aeronave) return;
        try {
            await api.apiRemoverTeste(testeId);
            setAeronave(atual => atual ? { ...atual, testes: atual.testes.filter(t => t.id !== testeId) } : null);
        } catch (err: any) {
            alert(`Erro: ${err.message}`);
        }
    };

    const handleAdicionarEtapa = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!aeronave || !novaEtapa.prazo) {
            alert("Prazo é obrigatório");
            return;
        }
        try {
            const etapaAdicionada = await api.apiAdicionarEtapa(aeronave.id, novaEtapa);
            if(codigo) api.apiObterAeronave(codigo).then(setAeronave);
            setNovaEtapa({ nome: '', prazo: '' }); 
        } catch (err: any) {
            alert(`Erro: ${err.message}`);
        }
    };

    const handleRemoverEtapa = async (etapaId: number) => {
        if (!aeronave) return;
        try {
            await api.apiRemoverEtapa(etapaId);
            setAeronave(atual => atual ? { ...atual, etapas: atual.etapas.filter(e => e.id !== etapaId) } : null);
        } catch (err: any) {
            alert(`Erro: ${err.message}`);
        }
    };

    const handleAtualizarStatusEtapa = async (etapaId: number, acao: 'iniciar' | 'finalizar') => {
        if (!aeronave) return;
        try {
            await api.apiAtualizarStatusEtapa(etapaId, acao);
            if (codigo) {
                const dadosAtualizados = await api.apiObterAeronave(codigo);
                setAeronave(dadosAtualizados);
            }
        } catch (err: any) {
            alert(`Erro: ${err.message}`);
        }
    };

    const handleAbrirModal = (etapa: Etapa) => {
        setEtapaParaGerenciar(etapa);
        setIsModalOpen(true);
    };

    const handleGerenciarFuncionarios = async (funcionarioIds: number[]) => {
        if (!etapaParaGerenciar) return;
        try {
            const etapaAtualizada = await api.apiGerirFuncionariosEtapa(etapaParaGerenciar.id, funcionarioIds);
            setAeronave(atual => atual ? {
                ...atual,
                etapas: atual.etapas.map(e => e.id === etapaAtualizada.id ? etapaAtualizada : e)
            } : null);
            setIsModalOpen(false);
            setEtapaParaGerenciar(null);
        } catch (err: any) {
            alert(`Erro: ${err.message}`);
        }
    };

    if (isLoading) {
        return <div className="loading-fullscreen">A carregar dados da aeronave...</div>;
    }

    if (error) {
        return <div className="loading-fullscreen error">Erro: {error} <button onClick={() => navigate('/dashboard')}>Voltar</button></div>;
    }

    if (!aeronave) {
        return <div className="loading-fullscreen">Aeronave não encontrada.</div>;
    }
    
    const etapasConcluidas = aeronave.etapas.filter(e => e.status === StatusEtapa.CONCLUIDA).length;
    const progresso = aeronave.etapas.length > 0 ? (etapasConcluidas / aeronave.etapas.length) * 100 : 0;
    
    const isAnyEtapaEmAndamento = aeronave.etapas.some(e => e.status === StatusEtapa.EM_ANDAMENTO);


    return (
        <div className="details-layout">
            <Sidebar currentUser={currentUser} />
            <main className="main-content">
                <header className="details-header">
                    <h1>{aeronave.modelo} <span className="aircraft-code">(Cód: {aeronave.codigo})</span></h1>
                    <button className="details-button-new" onClick={() => navigate('/dashboard')}>Voltar</button>
                </header>

                <section className="overview-section">
                    <div className="stats-container">
                        <StatCard icon={<FaChartLine />} label="Progresso Total" value={Math.round(progresso)} color="#2196f3" />
                        <StatCard icon={<FaCheckCircle />} label="Etapas Concluídas" value={etapasConcluidas} color="#4caf50" />
                        <StatCard icon={<FaTools />} label="Peças Monitoradas" value={aeronave.pecas.length} color="#ff9800" />
                        <StatCard icon={<FaVial />} label="Testes Realizados" value={aeronave.testes.length} color="#e91e63" />
                    </div>
                </section>


                <div className="details-columns">
                    <div className="column-left">
                        <section className="details-section">
                            <h2>Etapas de Montagem</h2>
                            {currentUser.nivelPermissao !== NivelPermissao.OPERADOR && (
                                <form className="add-form" onSubmit={handleAdicionarEtapa}>
                                    <input type="text" placeholder="Nome da nova etapa" value={novaEtapa.nome} onChange={e => setNovaEtapa({...novaEtapa, nome: e.target.value})} required />
                                    <input type="date" value={novaEtapa.prazo} onChange={e => setNovaEtapa({...novaEtapa, prazo: e.target.value})} required />
                                    <button type="submit" className="add-button-small">Adicionar Etapa</button>
                                </form>
                            )}
                            <div className="table-container">
                                {aeronave.etapas.map((etapa, index) => {
                                    const isPreviousEtapaConcluida = index === 0 || aeronave.etapas[index - 1].status === StatusEtapa.CONCLUIDA;
                                    
                                    return (
                                        <StageRow
                                            key={etapa.id}
                                            etapa={etapa}
                                            onUpdateStatus={(etapa: Etapa, acao: 'iniciar' | 'finalizar') => 
                                                handleAtualizarStatusEtapa(etapa.id, acao)
                                            }
                                            onRemove={() => handleRemoverEtapa(etapa.id)}
                                            onManageFuncionarios={() => handleAbrirModal(etapa)}
                                            isPreviousEtapaConcluida={isPreviousEtapaConcluida}
                                            isAnyEtapaEmAndamento={isAnyEtapaEmAndamento}
                                            canManage={currentUser.nivelPermissao !== NivelPermissao.OPERADOR}
                                        />
                                    );
                                })}
                            </div>
                        </section>
                        <section className="details-section">
                            <h2>Testes de Qualidade</h2>
                            {currentUser.nivelPermissao !== NivelPermissao.OPERADOR && (
                                <form className="add-form" onSubmit={handleAdicionarTeste}>
                                    <select value={novoTeste.tipo} onChange={e => setNovoTeste({...novoTeste, tipo: e.target.value as TipoTeste})}>
                                        {Object.values(TipoTeste).map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                    <select value={novoTeste.resultado} onChange={e => setNovoTeste({...novoTeste, resultado: e.target.value as ResultadoTeste})}>
                                        {Object.values(ResultadoTeste).map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                    <button type="submit" className="add-button-small">Adicionar Teste</button>
                                </form>
                            )}
                            <div className="table-container">
                                {aeronave.testes.map((teste, index) => (
                                    <TesteRow
                                        key={teste.id}
                                        teste={teste}
                                        index={index}
                                        onRemove={() => handleRemoverTeste(teste.id)}
                                        canManage={currentUser.nivelPermissao !== NivelPermissao.OPERADOR}
                                    />
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="column-right">
                        <section className="details-section">
                            <h2>Monitoramento de Peças</h2>
                            {currentUser.nivelPermissao !== NivelPermissao.OPERADOR && (
                                <form className="add-form" onSubmit={handleAdicionarPeca}>
                                    <input type="text" placeholder="Nome da peça" value={novaPeca.nome} onChange={e => setNovaPeca({...novaPeca, nome: e.target.value})} required />
                                    <input type="text" placeholder="Fornecedor" value={novaPeca.fornecedor} onChange={e => setNovaPeca({...novaPeca, fornecedor: e.target.value})} required />
                                    <select value={novaPeca.tipo} onChange={e => setNovaPeca({...novaPeca, tipo: e.target.value as TipoPeca})}>
                                        <option value={TipoPeca.NACIONAL}>Nacional</option>
                                        <option value={TipoPeca.IMPORTADA}>Importada</option>
                                    </select>
                                    <button type="submit" className="add-button-small">Adicionar Peça</button>
                                </form>
                            )}
                            <div className="table-container">
                                {aeronave.pecas.map(peca => (
                                    <PecaRow
                                        key={peca.id}
                                        peca={peca}
                                        onUpdateStatus={(peca: Peca, novoStatus: StatusPeca) => 
                                            handleAtualizarStatusPeca(peca.id, novoStatus)
                                        }
                                        onRemove={() => handleRemoverPeca(peca.id)}
                                        canManage={currentUser.nivelPermissao !== NivelPermissao.OPERADOR}
                                    />
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {isModalOpen && etapaParaGerenciar && (
                <GerenciarFuncionariosModal
                    etapa={etapaParaGerenciar}
                    todosFuncionarios={todosFuncionarios}
                    onClose={() => setIsModalOpen(false)}
                    onSave={(funcionariosSelecionados: Funcionario[]) => 
                        handleGerenciarFuncionarios(funcionariosSelecionados.map(f => f.id))
                    }
                />
            )}
        </div>
    );
};

export default AircraftDetails;