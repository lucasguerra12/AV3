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

// CORREÇÃO AQUI: As chavetas garantem que o ficheiro exato é puxado
import { RelatorioQualidade } from './pages/RelatorioQualidade'; 

function ProtectedRoutes() {
  const { usuarioLogado, carregando } = useSystem();
  
  if (carregando) {
     return <div className="min-h-screen flex items-center justify-center bg-background text-white">A Carregar Sistema...</div>;
  }

  if (!usuarioLogado) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function App() {
  console.log("%c✈️ Aerocode SPA - Desenvolvido por Lucas Fernando Guerra - AV3", "color: #3b82f6; font-size: 16px; font-weight: bold;");
  return (
    <SystemProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="aeronaves" element={<Aeronaves />} />
              <Route path="aeronaves/:id" element={<AeronaveDetalhe />} />
              <Route path="aeronaves/:id/relatorio" element={<Relatorio />} /> 
              
              <Route path="relatorio-qualidade" element={<RelatorioQualidade />} />
              
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