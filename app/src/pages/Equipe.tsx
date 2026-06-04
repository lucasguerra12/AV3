import { useState } from 'react';
import { useSystem } from '../contexts/SystemContext';
import type { Funcionario } from '../domain/types';

export function Equipe() {
  const { equipe, usuarioLogado, adicionarMembroEquipe, removerMembroEquipe } = useSystem();
  
  // Regra: Só Administrador pode adicionar ou remover membros
const isAdmin = usuarioLogado?.nivelPermissao === 'ADMINISTRADOR';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [nivelPermissao, setNivelPermissao] = useState<Funcionario['nivelPermissao']>('OPERADOR');

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    adicionarMembroEquipe({ nome, usuario, senha, telefone, endereco, nivelPermissao });
    setNome(''); setUsuario(''); setSenha(''); setTelefone(''); setEndereco(''); setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background relative font-body">
      <header className="h-16 border-b border-outline-variant/20 bg-background/80 backdrop-blur flex items-center justify-between px-8 sticky top-0 z-10">
        <h2 className="text-lg font-bold text-on-surface font-headline uppercase tracking-tighter">Controle de Credenciais</h2>
      </header>

      <main className="p-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase font-label">Pessoal Autorizado</span>
            <h1 className="text-4xl font-headline font-bold text-on-surface tracking-tight mt-1">Gestão de Equipe</h1>
          </div>
          
          {isAdmin && (
            <button onClick={() => setIsModalOpen(true)} className="bg-primary/10 text-primary border border-primary/30 px-6 py-2.5 rounded-sm font-bold text-xs tracking-widest hover:bg-primary hover:text-background transition-all flex items-center gap-2 font-headline uppercase">
              <span className="material-symbols-outlined text-lg">person_add</span> Credenciar
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {equipe.map((membro) => (
            <div key={membro.id} className="bg-surface-low border border-outline-variant/20 p-6 rounded-sm relative group overflow-hidden shadow-md">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-sm bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surfaceVariant">engineering</span>
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm border ${
                  membro.nivelPermissao === 'ADMINISTRADOR' ? 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/30' :
                  membro.nivelPermissao === 'ENGENHEIRO' ? 'bg-primary/10 text-primary border-primary/30' :
                  'bg-surface-highest text-on-surfaceVariant border-outline-variant/30'
                }`}>
                  {membro.nivelPermissao}
                </span>
              </div>
              
              <h3 className="text-xl font-headline font-bold text-on-surface uppercase tracking-tight">{membro.nome}</h3>
              <p className="text-xs text-primary font-mono mt-1">@{membro.usuario}</p>

              <div className="mt-6 space-y-2 border-t border-outline-variant/10 pt-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px] text-outline-variant">call</span>
                  <span className="text-xs text-on-surfaceVariant">{membro.telefone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px] text-outline-variant">location_on</span>
                  <span className="text-xs text-on-surfaceVariant">{membro.endereco}</span>
                </div>
              </div>

              {isAdmin && membro.id !== usuarioLogado?.id && (
                <button onClick={() => { if(confirm(`Revogar acesso de ${membro.nome}?`)) removerMembroEquipe(membro.id); }} className="absolute top-4 right-4 text-outline-variant hover:text-error opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 p-1 rounded-sm" title="Revogar Credencial">
                  <span className="material-symbols-outlined text-[18px]">person_remove</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Modal de Criar Usuário */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-surface-low border border-outline-variant/30 p-8 rounded-sm w-full max-w-md shadow-2xl">
            <h3 className="font-headline font-bold text-xl mb-6 border-b border-outline-variant/20 pb-4 text-on-surface uppercase tracking-tight">Nova Credencial</h3>
            <form onSubmit={handleSalvar} className="space-y-4">
              <input required value={nome} onChange={e => setNome(e.target.value)} className="w-full bg-background border border-outline-variant/30 py-3 px-4 rounded-sm text-sm text-on-surface" placeholder="Nome Completo" />
              <div className="grid grid-cols-2 gap-4">
                <input required value={usuario} onChange={e => setUsuario(e.target.value)} className="w-full bg-background border border-outline-variant/30 py-3 px-4 rounded-sm text-sm text-on-surface font-mono" placeholder="Usuário" />
                <input required type="password" value={senha} onChange={e => setSenha(e.target.value)} className="w-full bg-background border border-outline-variant/30 py-3 px-4 rounded-sm text-sm text-on-surface" placeholder="Senha" />
              </div>
              <input required value={telefone} onChange={e => setTelefone(e.target.value)} className="w-full bg-background border border-outline-variant/30 py-3 px-4 rounded-sm text-sm text-on-surface" placeholder="Telefone" />
              <input required value={endereco} onChange={e => setEndereco(e.target.value)} className="w-full bg-background border border-outline-variant/30 py-3 px-4 rounded-sm text-sm text-on-surface" placeholder="Localização / Base" />
              <select value={nivelPermissao} onChange={e => setNivelPermissao(e.target.value as Funcionario['nivelPermissao'])} className="w-full bg-background border border-outline-variant/30 py-3 px-4 rounded-sm text-xs font-headline uppercase text-primary outline-none">
                <option value="OPERADOR">Operador</option><option value="ENGENHEIRO">Engenheiro</option><option value="ADMINISTRADOR">Administrador</option>
              </select>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border border-outline-variant/30 text-on-surfaceVariant font-bold uppercase text-[10px] hover:text-on-surface rounded-sm">Cancelar</button>
                <button type="submit" className="flex-1 py-3 bg-primary text-background font-bold uppercase text-[10px] hover:brightness-110 rounded-sm shadow-md">Gerar Acesso</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}