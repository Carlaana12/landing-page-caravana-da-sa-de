import React from 'react';
import { LogOut, Menu, Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/authService';
import { toast } from 'react-hot-toast';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      navigate('/admin/login');
      toast.success('Logout realizado com sucesso');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  return (
    <div className="h-16 px-4 flex items-center justify-between border-b border-gray-200">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="h-5 w-5 text-gray-500" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">Painel Administrativo</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="h-5 w-5 text-gray-500" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <User className="h-5 w-5 text-gray-500" />
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Sair
        </button>
      </div>
    </div>
  );
};

export default Header; 