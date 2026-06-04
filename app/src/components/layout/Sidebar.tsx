import { Link, useLocation } from 'react-router-dom';

export  function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-blue-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white';
  };

  return (
    <aside className="w-64 bg-gray-900 min-h-screen p-4 flex flex-col">
      <div className="mb-8 p-2">
        <h1 className="text-2xl font-bold text-blue-500">Aerocode</h1>
        <p className="text-xs text-gray-400">Gestão de Produção</p>
      </div>

      <nav className="flex-1 space-y-2">
        <Link to="/" className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${isActive('/')}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          <span>Dashboard</span>
        </Link>
        
        <Link to="/aeronaves" className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${isActive('/aeronaves')}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          <span>Aeronaves</span>
        </Link>
        
        <Link to="/inventario" className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${isActive('/inventario')}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
          <span>Inventário</span>
        </Link>

        <Link to="/equipe" className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${isActive('/equipe')}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          <span>Equipe</span>
        </Link>

        <Link to="/relatorios" className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${isActive('/relatorios')}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          <span>Relatórios</span>
        </Link>

        {/* --- NOVO LINK DA AV3 AQUI --- */}
        <Link to="/relatorio-qualidade" className={`flex items-center space-x-2 p-3 rounded-lg transition-colors border border-blue-600 mt-4 ${isActive('/relatorio-qualidade')}`}>
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          <span className="font-semibold text-blue-400">Qualidade (AV3)</span>
        </Link>
      </nav>
    </aside>
  );
}