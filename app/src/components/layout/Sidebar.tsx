import { NavLink, useNavigate } from 'react-router-dom';
import { useSystem } from '../../contexts/SystemContext';

export function Sidebar() {
  const { usuarioLogado, logout } = useSystem();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Prevenção de erro caso renderize antes do redirect
  if (!usuarioLogado) return null;

  const podeVerEquipe = usuarioLogado.nivelPermissao === 'ADMINISTRADOR' || usuarioLogado.nivelPermissao === 'ENGENHEIRO';

  return (
    <aside className="w-64 bg-surface-container border-r border-outline-variant/20 flex flex-col font-body h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold text-on-surface flex items-center gap-2 font-headline uppercase tracking-widest">
          <span className="material-symbols-outlined text-primary">flight_takeoff</span>
          Aerocode
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        <NavLink to="/" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-sm transition-colors text-sm font-label uppercase tracking-widest ${isActive ? 'bg-primary/10 text-primary font-bold border-l-2 border-primary' : 'text-on-surfaceVariant hover:bg-surface-highest hover:text-on-surface'}`}>
          <span className="material-symbols-outlined text-lg">dashboard</span> Painel
        </NavLink>
        <NavLink to="/aeronaves" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-sm transition-colors text-sm font-label uppercase tracking-widest ${isActive ? 'bg-primary/10 text-primary font-bold border-l-2 border-primary' : 'text-on-surfaceVariant hover:bg-surface-highest hover:text-on-surface'}`}>
          <span className="material-symbols-outlined text-lg">flight</span> Frota
        </NavLink>
        <NavLink to="/inventario" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-sm transition-colors text-sm font-label uppercase tracking-widest ${isActive ? 'bg-primary/10 text-primary font-bold border-l-2 border-primary' : 'text-on-surfaceVariant hover:bg-surface-highest hover:text-on-surface'}`}>
          <span className="material-symbols-outlined text-lg">inventory_2</span> Inventário
        </NavLink>
        
        {podeVerEquipe && (
          <NavLink to="/equipe" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-sm transition-colors text-sm font-label uppercase tracking-widest ${isActive ? 'bg-primary/10 text-primary font-bold border-l-2 border-primary' : 'text-on-surfaceVariant hover:bg-surface-highest hover:text-on-surface'}`}>
            <span className="material-symbols-outlined text-lg">groups</span> Equipe
          </NavLink>
        )}
      </nav>

      {/* PERFIL DO USUÁRIO LOGADO E BOTÃO DE SAIR */}
      <div className="p-6 border-t border-outline-variant/20 bg-surface-highest/30 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-on-surface uppercase font-headline tracking-wider">{usuarioLogado.nome}</p>
          <p className="text-[9px] text-primary uppercase font-bold tracking-[0.2em] mt-1">{usuarioLogado.nivelPermissao}</p>
        </div>
        <button 
          onClick={handleLogout} 
          className="w-10 h-10 bg-surface-low border border-outline-variant/30 flex items-center justify-center rounded-sm text-on-surfaceVariant hover:text-[#ef4444] hover:border-[#ef4444]/50 transition-colors"
          title="Encerrar Sessão"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
        </button>
      </div>
    </aside>
  );
}