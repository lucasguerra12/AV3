import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './AircraftDetails.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import StageRow from '../../components/StageRow/StageRow';
import PecaRow from '../../components/PecaRow/PecaRow';
import TesteRow from '../../components/TesteRow/TesteRow';
import GerenciarFuncionariosModal from '../../components/GerenciarFuncionariosModal/GerenciarFuncionariosModal';
import { Relatorio } from '../../models/Relatorio';
import { Aeronave } from '../../models/Aeronave';
import { Etapa } from '../../models/Etapa';
import { Peca } from '../../models/Peca';
import { Teste } from '../../models/Teste';
import { Funcionario } from '../../models/Funcionario';
import { StatusEtapa, StatusPeca, TipoPeca, TipoTeste, ResultadoTeste, NivelPermissao } from '../../models/enums';
import { FaDownload } from 'react-icons/fa';
interface AircraftDetailsProps {
    currentUser: Funcionario | null;
    aeronavesIniciais: Aeronave[];
    onUpdateAeronave: (aeronave: Aeronave) => void;
    todosFuncionarios: Funcionario[];
}

const AircraftDetails = ({ currentUser, aeronavesIniciais, onUpdateAeronave, todosFuncionarios }: AircraftDetailsProps) => {
    const { codigo } = useParams<{ codigo: string }>();
    const aeronave = aeronavesIniciais.find(a => a.codigo === codigo);

    const [etapaParaGerir, setEtapaParaGerir] = useState<Etapa | null>(null);
    const [activeTab, setActiveTab] = useState('etapas');
    const [novaEtapaNome, setNovaEtapaNome] = useState('');
    const [novaEtapaPrazo, setNovaEtapaPrazo] = useState('');
    const [novaPecaNome, setNovaPecaNome] = useState('');
    const [novaPecaFornecedor, setNovaPecaFornecedor] = useState('');
    const [novaPecaTipo, setNovaPecaTipo] = useState<TipoPeca>(TipoPeca.NACIONAL);
    const [novoTesteTipo, setNovoTesteTipo] = useState<TipoTeste>(TipoTeste.ELETRICO);
    const [novoTesteResultado, setNovoTesteResultado] = useState<ResultadoTeste>(ResultadoTeste.APROVADO);

    if (!aeronave) {
        return (
            <div className="details-layout">
                <Sidebar />
                <main className="main-content">
                    <h2>Aeronave não encontrada</h2>
                </main>
            </div>
        );
    }
    
    const podeGerirProducao = currentUser?.nivelPermissao === NivelPermissao.ADMINISTRADOR || currentUser?.nivelPermissao === NivelPermissao.ENGENHEIRO;

    const deepCopyAeronave = (source: Aeronave): Aeronave => {
        const novaAeronave = new Aeronave(source.codigo, source.modelo, source.tipo, source.capacidade, source.alcance);
        
        novaAeronave.etapas = source.etapas.map(e => {
            const novaEtapa = new Etapa(e.nome, new Date(e.prazo));
            Object.assign(novaEtapa, e);
            novaEtapa.funcionarios = [...e.funcionarios];
            return novaEtapa;
        });
        
        novaAeronave.pecas = source.pecas.map(p => {
            const novaPeca = new Peca(p.nome, p.tipo, p.fornecedor);
            Object.assign(novaPeca, p);
            return novaPeca;
        });

        novaAeronave.testes = source.testes.map(t => new Teste(t.tipo, t.resultado));

        return novaAeronave;
    }
    
    const handleSaveFuncionariosParaEtapa = (funcionariosSelecionados: Funcionario[]) => {
        if (!etapaParaGerir) return;
        const novaAeronave = deepCopyAeronave(aeronave);
        const etapa = novaAeronave.etapas.find(e => e.nome === etapaParaGerir.nome);
        if (etapa) {
            etapa.funcionarios = funcionariosSelecionados;
            onUpdateAeronave(novaAeronave);
        }
        setEtapaParaGerir(null);
    };

    const handleUpdateEtapaStatus = (etapaParaAtualizar: Etapa, acao: 'iniciar' | 'finalizar') => {
        const novaAeronave = deepCopyAeronave(aeronave);
        const etapa = novaAeronave.etapas.find(e => e.nome === etapaParaAtualizar.nome);
        if (etapa) {
            if (acao === 'iniciar') etapa.iniciarEtapa();
            else etapa.finalizarEtapa();
            onUpdateAeronave(novaAeronave);
        }
    };

    const handleRemoverEtapa = (nomeEtapa: string) => {
        const novaAeronave = deepCopyAeronave(aeronave);
        novaAeronave.etapas = novaAeronave.etapas.filter(e => e.nome !== nomeEtapa);
        onUpdateAeronave(novaAeronave);
    };

    const handleAdicionarEtapa = (e: React.FormEvent) => {
        e.preventDefault();
        if (!novaEtapaNome || !novaEtapaPrazo) return alert('Preencha todos os campos da etapa.');
        const novaAeronave = deepCopyAeronave(aeronave);
        novaAeronave.adicionarEtapa(new Etapa(novaEtapaNome, new Date(novaEtapaPrazo)));
        onUpdateAeronave(novaAeronave);
        setNovaEtapaNome('');
        setNovaEtapaPrazo('');
    };
    
    const handleUpdatePecaStatus = (pecaParaAtualizar: Peca, novoStatus: StatusPeca) => {
        const novaAeronave = deepCopyAeronave(aeronave);
        const peca = novaAeronave.pecas.find(p => p.nome === pecaParaAtualizar.nome);
        if (peca) {
            peca.atualizarStatus(novoStatus);
            onUpdateAeronave(novaAeronave);
        }
    };
    
    const handleRemoverPeca = (nomePeca: string) => {
        const novaAeronave = deepCopyAeronave(aeronave);
        novaAeronave.pecas = novaAeronave.pecas.filter(p => p.nome !== nomePeca);
        onUpdateAeronave(novaAeronave);
    };

    const handleAdicionarPeca = (e: React.FormEvent) => {
        e.preventDefault();
        if (!novaPecaNome || !novaPecaFornecedor) return alert('Preencha todos os campos da peça.');
        const novaAeronave = deepCopyAeronave(aeronave);
        novaAeronave.adicionarPeca(new Peca(novaPecaNome, novaPecaTipo, novaPecaFornecedor));
        onUpdateAeronave(novaAeronave);
        setNovaPecaNome('');
        setNovaPecaFornecedor('');
    };

    const handleRemoverTeste = (indexParaRemover: number) => {
        const novaAeronave = deepCopyAeronave(aeronave);
        novaAeronave.testes = novaAeronave.testes.filter((_, index) => index !== indexParaRemover);
        onUpdateAeronave(novaAeronave);
    };

    const handleAdicionarTeste = (e: React.FormEvent) => {
        e.preventDefault();
        const novaAeronave = deepCopyAeronave(aeronave);
        novaAeronave.adicionarTeste(new Teste(novoTesteTipo, novoTesteResultado));
        onUpdateAeronave(novaAeronave);
    };


    const isAnyEtapaEmAndamento = aeronave.etapas.some(e => e.status === StatusEtapa.EM_ANDAMENTO);
    
    const relatorioGenerator = new Relatorio();
    const relatorioConteudo = relatorioGenerator.gerarConteudo(aeronave, "Cliente Exemplo");

    const handleDownloadRelatorio = () => {
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

    return (
        <div className="details-layout">
            <Sidebar />
            <main className="main-content">
                {}
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

                <div className="details-tabs">
                    <button className={`tab ${activeTab === 'etapas' ? 'active' : ''}`} onClick={() => setActiveTab('etapas')}>Etapas de Produção</button>
                    <button className={`tab ${activeTab === 'pecas' ? 'active' : ''}`} onClick={() => setActiveTab('pecas')}>Peças</button>
                    <button className={`tab ${activeTab === 'testes' ? 'active' : ''}`} onClick={() => setActiveTab('testes')}>Testes</button>
                    <button className={`tab ${activeTab === 'relatorio' ? 'active' : ''}`} onClick={() => setActiveTab('relatorio')}>Relatório</button>
                </div>

                <div className="tab-content">
                    {}
                    {activeTab === 'etapas' && (
                        <div>
                            {podeGerirProducao && (
                                <div className="add-form-container">
                                    <h3>Adicionar Nova Etapa</h3>
                                    <form onSubmit={handleAdicionarEtapa} className="add-form">
                                        <input type="text" placeholder="Nome da Etapa" value={novaEtapaNome} onChange={(e) => setNovaEtapaNome(e.target.value)} required />
                                        <input type="date" value={novaEtapaPrazo} onChange={(e) => setNovaEtapaPrazo(e.target.value)} required />
                                        <button type="submit" className="add-button-small">Adicionar</button>
                                    </form>
                                </div>
                            )}
                            {aeronave.etapas.length > 0 ? (
                                aeronave.etapas.map((etapa, index) => {
                                    const isPreviousEtapaConcluida = index === 0 || aeronave.etapas[index - 1].status === StatusEtapa.CONCLUIDA;
                                    return (
                                        <StageRow 
                                            key={etapa.nome}
                                            etapa={etapa}
                                            onUpdateStatus={handleUpdateEtapaStatus}
                                            onRemove={handleRemoverEtapa}
                                            onManageFuncionarios={() => setEtapaParaGerir(etapa)}
                                            isPreviousEtapaConcluida={isPreviousEtapaConcluida}
                                            isAnyEtapaEmAndamento={isAnyEtapaEmAndamento}
                                            canManage={podeGerirProducao}
                                        />
                                    );
                                })
                            ) : <p>Nenhuma etapa cadastrada.</p>}
                        </div>
                    )}
                    {activeTab === 'pecas' && (
                         <div>
                            {podeGerirProducao && (
                                <div className="add-form-container">
                                    <h3>Adicionar Nova Peça</h3>
                                    <form onSubmit={handleAdicionarPeca} className="add-form">
                                        <input type="text" placeholder="Nome da Peça" value={novaPecaNome} onChange={(e) => setNovaPecaNome(e.target.value)} required />
                                        <input type="text" placeholder="Fornecedor" value={novaPecaFornecedor} onChange={(e) => setNovaPecaFornecedor(e.target.value)} required />
                                        <select value={novaPecaTipo} onChange={(e) => setNovaPecaTipo(e.target.value as TipoPeca)}>
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
                                        key={peca.nome} 
                                        peca={peca} 
                                        onUpdateStatus={handleUpdatePecaStatus}
                                        onRemove={handleRemoverPeca}
                                        canManage={podeGerirProducao}
                                    />
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
                                        <select value={novoTesteTipo} onChange={(e) => setNovoTesteTipo(e.target.value as TipoTeste)}>
                                            {Object.values(TipoTeste).map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
                                        </select>
                                        <select value={novoTesteResultado} onChange={(e) => setNovoTesteResultado(e.target.value as ResultadoTeste)}>
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
                                        key={index} 
                                        teste={teste}
                                        index={index}
                                        onRemove={handleRemoverTeste}
                                        canManage={podeGerirProducao}
                                    />
                                ))
                            ) : <p>Nenhum teste registrado.</p>}
                        </div>
                    )}
                    {activeTab === 'relatorio' && (
                        <div>
                            {}
                            <button onClick={handleDownloadRelatorio} className="download-button">
                                <FaDownload /> Descarregar Relatório
                            </button>
                            <div className="relatorio-container">
                                <pre>{relatorioConteudo}</pre>
                            </div>
                        </div>
                    )}
                </div>

                {etapaParaGerir && (
                    <GerenciarFuncionariosModal
                        etapa={etapaParaGerir}
                        todosFuncionarios={todosFuncionarios}
                        onClose={() => setEtapaParaGerir(null)}
                        onSave={handleSaveFuncionariosParaEtapa}
                    />
                )}
            </main>
        </div>
    );
};

export default AircraftDetails;