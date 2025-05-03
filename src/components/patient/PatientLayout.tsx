import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  FileText, 
  Activity, 
  User, 
  Settings, 
  LogOut,
  Bell
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../lib/store';
import { AUTH_URLS } from '../../lib/constants';

const PatientLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/paciente/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/paciente/agendar', icon: Calendar, label: 'Agendar Consulta' },
    { path: '/paciente/exames', icon: FileText, label: 'Meus Exames' },
    { path: '/paciente/historico', icon: Activity, label: 'Histórico Médico' },
    { path: '/paciente/perfil', icon: User, label: 'Meu Perfil' },
    { path: '/paciente/configuracoes', icon: Settings, label: 'Configurações' }
  ];

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      useAuthStore.getState().setUser(null);
      useAuthStore.getState().setUserType(null);

      toast.success('Logout realizado com sucesso');
      navigate(AUTH_URLS.USER_LOGIN);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6">
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="Logo" className="h-8" />
              <span className="ml-2 text-xl font-bold text-verde-cia">Anuário de Saúde</span>
            </Link>
          </div>

          {/* Menu */}
          <nav className="flex-1 px-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-verde-cia/10 text-verde-cia'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="ml-3">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Notifications and Logout */}
          <div className="p-4 border-t">
            <div className="flex items-center justify-between mb-4">
              <button className="flex items-center text-gray-600 hover:text-verde-cia">
                <Bell className="w-5 h-5" />
                <span className="ml-2">Notificações</span>
              </button>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-3">Sair</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {children}
      </div>
    </div>
  );
};

export default PatientLayout; 