import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Image,
  Calendar,
  Star,
  Bell,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface MenuItem {
  label: string;
  icon: React.ElementType;
  path: string;
  description?: string;
}

const menuItems: MenuItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin', description: 'Visão geral do sistema' },
  { label: 'Carrossel', icon: Image, path: '/admin/carrossel', description: 'Gerenciar o carrossel' },
  { label: 'Eventos', icon: Calendar, path: '/admin/eventos', description: 'Gerenciar eventos e calendário' },
  { label: 'Destaques', icon: Star, path: '/admin/destaques', description: 'Gerenciar destaques especiais' },
  { label: 'Anúncios', icon: Bell, path: '/admin/anuncios', description: 'Gerenciar anúncios e comunicados' },
  { label: 'Configurações', icon: Settings, path: '/admin/configuracoes', description: 'Configurações do sistema' }
];

interface SidebarProps {
  collapsed: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="h-full w-full md:w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
      <div className="flex-1 overflow-y-auto py-4">
        <div className="flex items-center justify-between px-4 mb-4">
          {!collapsed && <h1 className="text-lg font-bold text-verde-cia">Anuário Saúde</h1>}
          {onToggle && (
            <button onClick={onToggle} className="text-gray-500 hover:text-gray-800">
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-verde-cia focus:ring-offset-2",
                  isActive
                    ? "bg-verde-cia text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
                {!collapsed && (
                  <div className="flex flex-col text-left">
                    <span>{item.label}</span>
                    {item.description && (
                      <span className="text-xs text-gray-400">{item.description}</span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-3 py-4 border-t border-gray-200">
        <button
          onClick={() => navigate('/logout')}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
        >
          <LogOut className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
