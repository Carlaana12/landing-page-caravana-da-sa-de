import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Image,
  Palette,
  Settings,
  Newspaper,
  Calendar,
  Star,
  BellRing,
  LogOut,
  LucideIcon
} from 'lucide-react';
import { useAuthStore } from '../lib/store';
import { signOut } from '../lib/auth';
import toast from 'react-hot-toast';
import { USER_TYPES } from '../lib/constants';

interface MenuItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { userType } = useAuthStore();

  // Fallback caso o userType não seja encontrado
  if (!userType) {
    return <Navigate to="/login" replace />;
  }

  const menuItems: Record<string, MenuItem[]> = {
    [USER_TYPES.ADMIN]: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/arearestrita' },
      { icon: Image, label: 'Mídia', path: '/arearestrita/media' },
      { icon: Palette, label: 'Aparência', path: '/arearestrita/appearance' },
      { icon: Newspaper, label: 'Carrossel', path: '/arearestrita/carousel' },
      { icon: Star, label: 'Destaques', path: '/arearestrita/destaques' },
      { icon: Calendar, label: 'Eventos', path: '/arearestrita/events' },
      { icon: BellRing, label: 'Anúncios', path: '/arearestrita/ads' },
      { icon: Settings, label: 'Configurações', path: '/arearestrita/settings' },
    ],
    [USER_TYPES.USER]: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/usuario/dashboard' },
      { icon: Calendar, label: 'Agendamentos', path: '/usuario/agendamentos' },
      { icon: Settings, label: 'Configurações', path: '/usuario/configuracoes' },
    ],
    [USER_TYPES.SPECIALIST]: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/especialista/dashboard' },
      { icon: Image, label: 'Perfil Público', path: '/especialista/perfil-publico' },
      { icon: Calendar, label: 'Disponibilidade', path: '/especialista/disponibilidade' },
      { icon: Newspaper, label: 'Artigos', path: '/especialista/artigos' },
      { icon: Settings, label: 'Configurações', path: '/especialista/configuracoes' },
    ],
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logout realizado com sucesso');
    } catch (error: any) {
      toast.error(`Erro ao fazer logout: ${error.message || 'Desconhecido'}`);
    }
  };

  const currentMenuItems = menuItems[userType] || [];

  const getMenuItemClass = (isActive: boolean) =>
    isActive ? 'bg-verde-cia text-white' : 'text-gray-400 hover:bg-gray-700';

  return (
    <div className="h-full flex flex-col w-64 bg-gray-800 text-white">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Menu</h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {currentMenuItems.map((item: MenuItem) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${getMenuItemClass(isActive)}`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-4 py-2 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
