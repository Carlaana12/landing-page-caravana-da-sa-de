import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import { AuthGuard } from './components/AuthGuard';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CarouselManager from './pages/CarouselManager';
import EventosManager from './pages/EventosManager';
import EventoForm from './pages/EventoForm';
import AnunciosManager from './pages/AnunciosManager';
import ConfiguracoesManager from './pages/ConfiguracoesManager';
import DestaquesManager from './pages/DestaquesManager';

// Componente Wrapper para AuthGuard e AdminLayout
const ProtectedLayout = () => (
  <AuthGuard>
    <AdminLayout /> {/* AdminLayout agora deve conter <Outlet /> */}
  </AuthGuard>
);

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Rota de Login (fora do layout protegido) */}
      <Route path="login" element={<Login />} />

      {/* Rotas Protegidas (dentro do layout) */}
      <Route path="/" element={<ProtectedLayout />}> {/* Assume que AdminRoutes é montado em /admin */}
        <Route index element={<Dashboard />} /> {/* Rota raiz da área admin */}
        <Route path="carrossel" element={<CarouselManager />} />
        <Route path="eventos" element={<EventosManager />} />
        <Route path="eventos/novo" element={<EventoForm />} />
        <Route path="eventos/:id" element={<EventoForm />} />
        <Route path="anuncios" element={<AnunciosManager />} />
        <Route path="configuracoes" element={<ConfiguracoesManager />} />
        <Route path="destaques" element={<DestaquesManager />} />

        {/* Qualquer outra rota dentro de /admin que não combine, redireciona para o dashboard */}
        <Route path="*" element={<Navigate to="/admin" replace />} /> {/* Redirecionamento para o dashboard */}
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
