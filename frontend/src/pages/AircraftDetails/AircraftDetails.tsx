import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AircraftDetails.css'; 
import * as api from '../../services/api'; 

// Models (Interfaces)
import { Aeronave } from '../../models/Aeronave';
import { Funcionario } from '../../models/Funcionario';
import { Peca } from '../../models/Peca';
import { Etapa } from '../../models/Etapa';
import { Teste } from '../../models/Teste';
import { NivelPermissao, StatusEtapa, StatusPeca, TipoPeca, TipoTeste, ResultadoTeste } from '../../models/enums';

// Components
import Sidebar from '../../components/Sidebar/Sidebar';
import PecaRow from '../../components/PecaRow/PecaRow';
import StageRow from '../../components/StageRow/StageRow';
import TesteRow from '../../components/TesteRow/TesteRow';
import GerenciarFuncionariosModal from '../../components/GerenciarFuncionariosModal/GerenciarFuncionariosModal';

import { Relatorio } from '../../models/Relatorio';
import { FaDownload } from 'react-icons/fa';

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

    // --- (Toda a sua lógica de 'useEffect' e 'handle...' vai aqui, sem alterações) ---
    // (Omitido para brevidade, mantenha o seu código aqui)
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
            setAeronave(atual => atual ? { ...atual, etapas: atual.etapas.map(e => e.id === etapaAtualizada.id ? etapaAtualizada : e) } : null);
            setIsModalOpen(false);
            setEtapaParaGerenciar(null);
        } catch (err: any) {
            alert(`Erro: ${err.message}`);
        }
    };
    const handleDownloadRelatorio = () => {
        if (!aeronave) return; // Garantir que a aeronave existe
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
    // --- FIM DA LÓGICA ---


    // --- Lógica de Renderização ---
    if (isLoading) { return <div className="loading-fullscreen">A carregar...</div>; }
    if (error) { return <div className="loading-fullscreen error">Erro: {error}</div>; }
    if (!aeronave) { return <div className="loading-fullscreen">Aeronave não encontrada.</div>; }
    
    // --- CORREÇÃO: Estas lógicas foram movidas para baixo ---
    const isAnyEtapaEmAndamento = aeronave.etapas.some(e => e.status === StatusEtapa.EM_ANDAMENTO);
    const podeGerirProducao = currentUser?.nivelPermissao === NivelPermissao.ADMINISTRADOR || currentUser?.nivelPermissao === NivelPermissao.ENGENHEIRO;


    // --- JSX (IDÊNTICO AO DA AV2) ---
    return (
        <div className="details-layout">
            <Sidebar currentUser={currentUser} onLogout={onLogout} />
            <main className="main-content">
                
                <header className="details-header">
                    <h1>{aeronave.modelo}</h1>
                    <span className="aircraft-code">(Cód: {aeronave.codigo})</span>
                </header>
                
                <div className="details-card">
                    <h3>Informações Gerais</h3>
                    <p><strong>Tipo:</strong> {aeronave.tipo}</p>
                    <p><strong>Capacidade:</strong> {aeronave.capacidade} passageiros</p>
                    <p><strong>Alcance:</strong> {aeronave.alcance} km</p>
                </div>

                {/* Abas (Tabs) da AV2 */}
                <div className="details-tabs">
                    <button className={`tab ${activeTab === 'etapas' ? 'active' : ''}`} onClick={() => setActiveTab('etapas')}>Etapas de Produção</button>
                    <button className={`tab ${activeTab === 'pecas' ? 'active' : ''}`} onClick={() => setActiveTab('pecas')}>Peças</button>
                    <button className={`tab ${activeTab === 'testes' ? 'active' : ''}`} onClick={() => setActiveTab('testes')}>Testes</button>
                    <button className={`tab ${activeTab === 'relatorio' ? 'active' : ''}`} onClick={() => setActiveTab('relatorio')}>Relatório</button>
                </div>

                {/* Conteúdo das Abas (da AV2) */}
                <div className="tab-content">
                    
                    {/* Aba ETAPAS */}
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
                                aeronave.etapas.map((etapa, index) => {
                                    const isPreviousEtapaConcluida = index === 0 || aeronave.etapas[index - 1].status === StatusEtapa.CONCLUIDA;
                                    return (
                                        <StageRow 
                                            key={etapa.id}
                                            etapa={etapa}
                                            onUpdateStatus={(etapa, acao) => handleAtualizarStatusEtapa(etapa.id, acao)}
                                            onRemove={() => handleRemoverEtapa(etapa.id)}
                                            onManageFuncionarios={() => handleAbrirModal(etapa)}
                                            isPreviousEtapaConcluida={isPreviousEtapaConcluida}
                                            isAnyEtapaEmAndamento={isAnyEtapaEmAndamento}
                                            canManage={podeGerirProducao}
                                        />
                                    );
                                })
                            ) : <p>Nenhuma etapa cadastrada.</p>}
                        </div>
                    )}

                    {/* Aba PEÇAS */}
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
                                    <PecaRow 
                                        key={peca.id} 
                                        peca={peca} 
                                        onUpdateStatus={(peca, novoStatus) => handleAtualizarStatusPeca(peca.id, novoStatus)}
                                        onRemove={() => handleRemoverPeca(peca.id)}
                                        canManage={podeGerirProducao}
                                    />
                                ))
                             ) : <p>Nenhuma peça cadastrada.</p>}
                        </div>
                    )}

                    {/* Aba TESTES */}
                    {activeTab === 'testes' && (
                        <div>
                            {podeGerirProducao && (
                                <div className="add-form-container">
                                    <h3>Adicionar Novo Teste</h3>
                                    <form onSubmit={handleAdicionarTeste} className="add-form">
                                        <select value={novoTeste.tipo} onChange={(e) => setNovoTeste({...novoTeste, tipo: e.target.value as TipoTeste})}>
                                            {Object.values(TipoTeste).map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
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
                                    <TesteRow 
                                        key={teste.id} 
                                        teste={teste}
                                        index={index}
                                        onRemove={() => handleRemoverTeste(teste.id)}
                                        canManage={podeGerirProducao}
                                    />
                                ))
                            ) : <p>Nenhum teste registrado.</p>}
                        </div>
                    )}

                    {/* Aba RELATÓRIO */}
                    {activeTab === 'relatorio' && (
                        <div>
                            <button onClick={handleDownloadRelatorio} className="download-button">
                                <FaDownload /> Descarregar Relatório
                            </button>
                            <div className="relatorio-container">
                                {/* --- CORREÇÃO FINAL ---
                                  A geração do relatório é movida para AQUI DENTRO.
                                  Isto garante que ela só corre (e converte as datas)
                                  quando esta aba está ativa.
                                */}
                                <pre>
                                    {(() => {
                                        const relatorioGenerator = new Relatorio();
                                        return relatorioGenerator.gerarConteudo(aeronave, "Cliente Exemplo");
                                    })()}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>

                {isModalOpen && etapaParaGerenciar && (
                    <GerenciarFuncionariosModal
                        etapa={etapaParaGerenciar}
                        todosFuncionarios={todosFuncionarios}
                        onClose={() => setIsModalOpen(false)}
                        onSave={(funcionariosSelecionados) => 
                            handleGerenciarFuncionarios(funcionariosSelecionados.map(f => f.id))
                        }
                    />
                )}
            </main>
        </div>
    );
};

export default AircraftDetails;