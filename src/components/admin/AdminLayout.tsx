import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Image,
  Palette,
  Settings,
  LogOut,
  Menu,
  X,
  Newspaper,
  Calendar,
  Star,
  BellRing
} from 'lucide-react';
import { useAuthStore } from '../../lib/store';
import { signOut } from '../../lib/auth';
import toast from 'react-hot-toast';
import { AUTH_URLS } from '../../lib/constants';
import AdsPublicSidebar from './AdsPublicSidebar';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  console.log('ROTA ATUAL:', location.pathname);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/arearestrita',
    },
    {
      icon: Image,
      label: 'Mídia',
      path: '/arearestrita/media',
    },
    {
      icon: Palette,
      label: 'Aparência',
      path: '/arearestrita/appearance',
    },
    {
      icon: Newspaper,
      label: 'Carrossel',
      path: '/arearestrita/carousel',
    },
    {
      icon: Star,
      label: 'Destaques',
      path: '/arearestrita/destaques',
    },
    {
      icon: Calendar,
      label: 'Eventos',
      path: '/arearestrita/events',
    },
    {
      icon: BellRing,
      label: 'Painel de Anúncios',
      path: '/arearestrita/anuncios',
    },
    {
      icon: Settings,
      label: 'Configurações',
      path: '/arearestrita/settings',
    },
  ];

  // Novo menu lateral para toda a área restrita
  const publicMenuItems = [
    { label: 'Home', path: '/arearestrita/home' },
    { label: 'Sobre Nós', path: '/arearestrita/sobre' },
    { label: 'Encontre Aqui', path: '/arearestrita/encontre-aqui' },
    { label: 'Doenças e Tratamentos', path: '/arearestrita/tratamentos' },
    { label: 'Notícias', path: '/arearestrita/noticias' },
    { label: 'Eventos', path: '/arearestrita/eventos' },
    { label: 'Utilidades Públicas', path: '/arearestrita/utilidades-publicas' },
    { label: 'Fale Conosco', path: '/arearestrita/contato' },
    { label: 'Painel de Anúncios', path: '/arearestrita/anuncios' },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logout realizado com sucesso');
      navigate(AUTH_URLS.ADMIN_LOGIN);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error('Erro ao fazer logout.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0e7ef] via-[#f5f7fa] to-[#c9d6ff] flex">
      {/* Sidebar Glassmorphism */}
      {location.pathname.startsWith('/arearestrita/anuncios') ? (
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 p-6 flex flex-col gap-4
            bg-white/30 backdrop-blur-xl border-r border-white/40 shadow-xl transition-transform duration-200 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 lg:static lg:w-72`}
        >
          <div className="flex items-center justify-between mb-6">
            <span className="text-2xl font-extrabold text-gray-800 tracking-tight drop-shadow-lg">
              Painel de Anúncios
            </span>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-gray-700 hover:text-gray-900"
            >
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
          <nav className="flex-1 flex flex-col gap-2">
            {publicMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-lg transition-all
                  ${location.pathname === item.path
                    ? 'bg-white/60 shadow-lg text-[#3a7bd5] border border-[#3a7bd5]/30'
                    : 'text-gray-700 hover:bg-white/40 hover:shadow-md'}
                `}
              >
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>
      ) : (
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 p-6 flex flex-col gap-4
            bg-white/30 backdrop-blur-xl border-r border-white/40 shadow-xl transition-transform duration-200 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 lg:static lg:w-72`}
        >
          <div className="flex items-center justify-between mb-6">
            <span className="text-2xl font-extrabold text-gray-800 tracking-tight drop-shadow-lg">
              Painel Admin
            </span>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-gray-700 hover:text-gray-900"
            >
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
          <nav className="flex-1 flex flex-col gap-2">
            {publicMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-lg transition-all
                  ${location.pathname === item.path
                    ? 'bg-white/60 shadow-lg text-[#3a7bd5] border border-[#3a7bd5]/30'
                    : 'text-gray-700 hover:bg-white/40 hover:shadow-md'}
                `}
              >
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-100/60 rounded-xl transition-all font-medium"
            >
              <LogOut className="h-6 w-6" />
              <span>Sair</span>
            </button>
          </div>
        </aside>
      )}

      {/* Main Content Glassmorphism */}
      <main
        className={`flex-1 min-h-screen p-8 lg:ml-72 transition-all duration-200
          flex flex-col bg-white/40 backdrop-blur-2xl rounded-l-3xl shadow-2xl mx-0 lg:mx-8 my-6`}
      >
        <div className="flex-1 w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;