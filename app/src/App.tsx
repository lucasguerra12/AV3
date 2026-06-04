import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSystem, SystemProvider } from './contexts/SystemContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Aeronaves } from './pages/Aeronaves';
import { AeronaveDetalhe } from './pages/AeronaveDetalhe';
import { Inventario } from './pages/Inventario';
import { Equipe } from './pages/Equipe';
import { Login } from './pages/Login';
import { Relatorio } from './pages/Relatorio';

// Componente que protege as páginas de quem não está logado
function ProtectedRoutes() {
  const { usuarioLogado } = useSystem();
  
  if (!usuarioLogado) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver logado, o Outlet permite que o React Router continue a renderizar as rotas filhas
  return <Outlet />;
}

function App() {
  console.log("%c✈️ Aerocode SPA - Desenvolvido por Lucas Fernando Guerra - AV2", "color: #3b82f6; font-size: 16px; font-weight: bold;");
  return (
    <SystemProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Todas as rotas dentro deste bloco exigem Login para serem acessadas */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="aeronaves" element={<Aeronaves />} />
              <Route path="aeronaves/:id" element={<AeronaveDetalhe />} />
              <Route path="aeronaves/:id/relatorio" element={<Relatorio />} /> 
              <Route path="inventario" element={<Inventario />} />
              <Route path="equipe" element={<Equipe />} />
            </Route>
          </Route>
          
        </Routes>
      </BrowserRouter>
    </SystemProvider>
  );
}

export default App;