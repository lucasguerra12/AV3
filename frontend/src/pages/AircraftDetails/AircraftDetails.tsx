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
import PecaRow from '../../components/PecaRow/PecaRow';
import StageRow from '../../components/StageRow/StageRow';
import TesteRow from '../../components/TesteRow/TesteRow';
import GerenciarFuncionariosModal from '../../components/GerenciarFuncionariosModal/GerenciarFuncionariosModal';
import StatCard from '../../components/StatCard/StatCard';

import { Relatorio } from '../../models/Relatorio';
import { FaDownload, FaChartLine, FaCheckCircle, FaTools, FaVial } from 'react-icons/fa';

interface AircraftDetailsProps {
    currentUser: Funcionario;
    onUpdateAeronave: (aeronaveAtualizada: Aeronave) => void;
    todosFuncionarios: Funcionario[];
    onLogout: () => void; 
}

const AircraftDetails: React.FC<AircraftDetailsProps> = ({ currentUser, onUpdateAeronave, todosFuncionarios, onLogout }) => {
    const { codigo } = useParams<{ codigo: string }>();
    const navigate = useNavigate();

    const [aeronave, setAeronave] = useState<Aeronave | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [activeTab, setActiveTab] = useState('etapas');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [etapaParaGerenciar, setEtapaParaGerenciar] = useState<Etapa | null>(null);
    const [novaPeca, setNovaPeca] = useState({ nome: '', tipo: TipoPeca.NACIONAL, fornecedor: '' });
    const [novoTeste, setNovoTeste] = useState({ tipo: TipoTeste.ELETRICO, resultado: ResultadoTeste.APROVADO });
    const [novaEtapa, setNovaEtapa] = useState({ nome: '', prazo: '' });

    useEffect(() => {
        if (!codigo) return;
        setIsLoading(true);
        api.apiObterAeronave(codigo)
            .then(data => {
                setAeronave(data);
                setIsLoading(false);
            })
            .catch((err: any) => {
                setError(err.message);
                setIsLoading(false);
            });
    }, [codigo]); 

    // Função auxiliar para atualizar estado local E global
    const atualizarAeronaveCompleta = (dadosAtualizados: Aeronave) => {
        setAeronave(dadosAtualizados); 
        onUpdateAeronave(dadosAtualizados); 
    };

    const handleAdicionarEtapa = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!aeronave || !novaEtapa.prazo) return alert("Prazo obrigatório");
        try {
            await api.apiAdicionarEtapa(aeronave.id, novaEtapa);
            if(codigo) {
                const atualizado = await api.apiObterAeronave(codigo);
                atualizarAeronaveCompleta(atualizado);
            }
            setNovaEtapa({ nome: '', prazo: '' }); 
        } catch (err: any) { alert(err.message); }
    };

    const handleRemoverEtapa = async (etapaId: number) => {
        if (!aeronave) return;
        try {
            await api.apiRemoverEtapa(etapaId);
            const atualizado = { ...aeronave, etapas: aeronave.etapas.filter(e => e.id !== etapaId) };
            atualizarAeronaveCompleta(atualizado);
        } catch (err: any) { alert(err.message); }
    };

    const handleAtualizarStatusEtapa = async (etapaId: number, acao: 'iniciar' | 'finalizar') => {
        if (!aeronave) return;
        try {
            await api.apiAtualizarStatusEtapa(etapaId, acao);
            if (codigo) {
                const atualizado = await api.apiObterAeronave(codigo);
                atualizarAeronaveCompleta(atualizado);
            }
        } catch (err: any) { alert(err.message); }
    };

    const handleAdicionarPeca = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!aeronave) return;
        try {
            const nova = await api.apiAdicionarPeca(aeronave.id, novaPeca);
            const atualizado = { ...aeronave, pecas: [...aeronave.pecas, nova] };
            atualizarAeronaveCompleta(atualizado);
            setNovaPeca({ nome: '', tipo: TipoPeca.NACIONAL, fornecedor: '' }); 
        } catch (err: any) { alert(err.message); }
    };

    const handleRemoverPeca = async (pecaId: number) => {
        if (!aeronave) return;
        try {
            await api.apiRemoverPeca(pecaId);
            const atualizado = { ...aeronave, pecas: aeronave.pecas.filter(p => p.id !== pecaId) };
            atualizarAeronaveCompleta(atualizado);
        } catch (err: any) { alert(err.message); }
    };

    const handleAtualizarStatusPeca = async (pecaId: number, novoStatus: StatusPeca) => {
        if (!aeronave) return;
        try {
            const pecaAtt = await api.apiAtualizarStatusPeca(pecaId, novoStatus);
            const atualizado = { 
                ...aeronave, 
                pecas: aeronave.pecas.map(p => p.id === pecaId ? pecaAtt : p) 
            };
            atualizarAeronaveCompleta(atualizado);
        } catch (err: any) { alert(err.message); }
    };

    const handleAdicionarTeste = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!aeronave) return;
        try {
            const novo = await api.apiAdicionarTeste(aeronave.id, novoTeste);
            const atualizado = { ...aeronave, testes: [...aeronave.testes, novo] };
            atualizarAeronaveCompleta(atualizado);
        } catch (err: any) { alert(err.message); }
    };

    const handleRemoverTeste = async (testeId: number) => {
        if (!aeronave) return;
        try {
            await api.apiRemoverTeste(testeId);
            const atualizado = { ...aeronave, testes: aeronave.testes.filter(t => t.id !== testeId) };
            atualizarAeronaveCompleta(atualizado);
        } catch (err: any) { alert(err.message); }
    };

    const handleGerenciarFuncionarios = async (funcionarioIds: number[]) => {
        if (!etapaParaGerenciar) return;
        try {
            await api.apiGerirFuncionariosEtapa(etapaParaGerenciar.id, funcionarioIds);
            if(codigo) {
                const atualizado = await api.apiObterAeronave(codigo);
                atualizarAeronaveCompleta(atualizado);
            }
            setIsModalOpen(false);
            setEtapaParaGerenciar(null);
        } catch (err: any) { alert(err.message); }
    };
    
    const handleDownloadRelatorio = () => {
        if (!aeronave) return; 
        const relatorioGenerator = new Relatorio();
        const relatorioConteudo = relatorioGenerator.gerarConteudo(aeronave, "Cliente Exemplo");
        const blob = new Blob([relatorioConteudo], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `relatorio-${aeronave.codigo}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (isLoading) return <div className="loading-fullscreen">A carregar...</div>;
    if (error) return <div className="loading-fullscreen error">Erro: {error}</div>;
    if (!aeronave) return <div className="loading-fullscreen">Aeronave não encontrada.</div>;
    
    const etapasConcluidas = aeronave.etapas.filter(e => e.status === StatusEtapa.CONCLUIDA).length;
    const progresso = aeronave.etapas.length > 0 ? (etapasConcluidas / aeronave.etapas.length) * 100 : 0;
    const isAnyEtapaEmAndamento = aeronave.etapas.some(e => e.status === StatusEtapa.EM_ANDAMENTO);
    const podeGerirProducao = currentUser?.nivelPermissao === NivelPermissao.ADMINISTRADOR || currentUser?.nivelPermissao === NivelPermissao.ENGENHEIRO;

    return (
        <div className="details-layout">
            <Sidebar currentUser={currentUser} onLogout={onLogout} />
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

                <div className="details-tabs">
                    <button className={`tab ${activeTab === 'etapas' ? 'active' : ''}`} onClick={() => setActiveTab('etapas')}>Etapas de Produção</button>
                    <button className={`tab ${activeTab === 'pecas' ? 'active' : ''}`} onClick={() => setActiveTab('pecas')}>Peças</button>
                    <button className={`tab ${activeTab === 'testes' ? 'active' : ''}`} onClick={() => setActiveTab('testes')}>Testes</button>
                    <button className={`tab ${activeTab === 'relatorio' ? 'active' : ''}`} onClick={() => setActiveTab('relatorio')}>Relatório</button>
                </div>

                <div className="tab-content">
                    {activeTab === 'etapas' && (
                        <div>
                            {podeGerirProducao && (
                                <div className="add-form-container">
                                    <h3>Adicionar Nova Etapa</h3>
                                    <form onSubmit={handleAdicionarEtapa} className="add-form">
                                        <input type="text" placeholder="Nome da Etapa" value={novaEtapa.nome} onChange={(e) => setNovaEtapa({...novaEtapa, nome: e.target.value})} required />
                                        <input type="date" value={novaEtapa.prazo} onChange={(e) => setNovaEtapa({...novaEtapa, prazo: e.target.value})} required />
                                        <button type="submit" className="add-button-small">Adicionar</button>
                                    </form>
                                </div>
                            )}
                            {aeronave.etapas.length > 0 ? (
                                aeronave.etapas.map((etapa, index) => (
                                    <StageRow 
                                        key={etapa.id}
                                        etapa={etapa}
                                        onUpdateStatus={(e, acao) => handleAtualizarStatusEtapa(e.id, acao)}
                                        onRemove={() => handleRemoverEtapa(etapa.id)}
                                        onManageFuncionarios={() => { setEtapaParaGerenciar(etapa); setIsModalOpen(true); }}
                                        isPreviousEtapaConcluida={index === 0 || aeronave.etapas[index - 1].status === StatusEtapa.CONCLUIDA}
                                        isAnyEtapaEmAndamento={isAnyEtapaEmAndamento}
                                        canManage={podeGerirProducao}
                                    />
                                ))
                            ) : <p>Nenhuma etapa cadastrada.</p>}
                        </div>
                    )}
                    {activeTab === 'pecas' && (
                         <div>
                            {podeGerirProducao && (
                                <div className="add-form-container">
                                    <h3>Adicionar Nova Peça</h3>
                                    <form onSubmit={handleAdicionarPeca} className="add-form">
                                        <input type="text" placeholder="Nome da Peça" value={novaPeca.nome} onChange={(e) => setNovaPeca({...novaPeca, nome: e.target.value})} required />
                                        <input type="text" placeholder="Fornecedor" value={novaPeca.fornecedor} onChange={(e) => setNovaPeca({...novaPeca, fornecedor: e.target.value})} required />
                                        <select value={novaPeca.tipo} onChange={(e) => setNovaPeca({...novaPeca, tipo: e.target.value as TipoPeca})}>
                                            <option value={TipoPeca.NACIONAL}>Nacional</option>
                                            <option value={TipoPeca.IMPORTADA}>Importada</option>
                                        </select>
                                        <button type="submit" className="add-button-small">Adicionar</button>
                                    </form>
                                </div>
                            )}
                            {aeronave.pecas.length > 0 ? (
                                aeronave.pecas.map((peca) => (
                                    <PecaRow key={peca.id} peca={peca} onUpdateStatus={(p, s) => handleAtualizarStatusPeca(p.id, s)} onRemove={() => handleRemoverPeca(peca.id)} canManage={podeGerirProducao} />
                                ))
                             ) : <p>Nenhuma peça cadastrada.</p>}
                        </div>
                    )}
                    {activeTab === 'testes' && (
                        <div>
                            {podeGerirProducao && (
                                <div className="add-form-container">
                                    <h3>Adicionar Novo Teste</h3>
                                    <form onSubmit={handleAdicionarTeste} className="add-form">
                                        <select value={novoTeste.tipo} onChange={(e) => setNovoTeste({...novoTeste, tipo: e.target.value as TipoTeste})}>
                                            {Object.values(TipoTeste).map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                        <select value={novoTeste.resultado} onChange={(e) => setNovoTeste({...novoTeste, resultado: e.target.value as ResultadoTeste})}>
                                            <option value={ResultadoTeste.APROVADO}>Aprovado</option>
                                            <option value={ResultadoTeste.REPROVADO}>Reprovado</option>
                                        </select>
                                        <button type="submit" className="add-button-small">Adicionar</button>
                                    </form>
                                </div>
                            )}
                            {aeronave.testes.length > 0 ? (
                                aeronave.testes.map((teste, index) => (
                                    <TesteRow key={teste.id} teste={teste} index={index} onRemove={() => handleRemoverTeste(teste.id)} canManage={podeGerirProducao} />
                                ))
                            ) : <p>Nenhum teste registrado.</p>}
                        </div>
                    )}
                    {activeTab === 'relatorio' && (
                        <div>
                            <button onClick={handleDownloadRelatorio} className="download-button"><FaDownload /> Descarregar Relatório</button>
                            <div className="relatorio-container">
                                <pre>{(() => { const r = new Relatorio(); return r.gerarConteudo(aeronave, "Cliente Exemplo"); })()}</pre>
                            </div>
                        </div>
                    )}
                </div>
                {isModalOpen && etapaParaGerenciar && (
                    <GerenciarFuncionariosModal etapa={etapaParaGerenciar} todosFuncionarios={todosFuncionarios} onClose={() => setIsModalOpen(false)} onSave={(ids) => handleGerenciarFuncionarios(ids.map(f => f.id))} />
                )}
            </main>
        </div>
    );
};

export default AircraftDetails;