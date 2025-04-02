import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
  FileText,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { useAuthStore } from '../../lib/store';
import { signOut } from '../../lib/auth';
import toast from 'react-hot-toast';

const PartnerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/parceiro/dashboard',
    },
    {
      icon: FileText,
      label: 'Meu Perfil',
      path: '/parceiro/profile',
    },
    {
      icon: Calendar,
      label: 'Agenda',
      path: '/parceiro/schedule',
    },
    {
      icon: MessageSquare,
      label: 'Mensagens',
      path: '/parceiro/messages',
    },
    {
      icon: Settings,
      label: 'Configurações',
      path: '/parceiro/settings',
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/parceiro/login');
      toast.success('Logout realizado com sucesso');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b px-4 py-3">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-500 hover:text-gray-600"
        >
          {isSidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b">
            <Link to="/parceiro/dashboard" className="text-xl font-bold text-gray-800">
              Área do Parceiro
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-verde-cia text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-3 py-2 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-200 ${
          isSidebarOpen ? 'lg:ml-64' : ''
        }`}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default PartnerLayout;