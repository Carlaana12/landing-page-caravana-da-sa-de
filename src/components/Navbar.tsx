import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Mail, Phone, LogIn, UserCircle, Stethoscope, LogOut } from 'lucide-react';
import { AUTH_URLS, USER_TYPES } from '../lib/constants';
import { useAuthStore } from '../lib/store';
import { signOut } from '../lib/auth';
import LogoAnimada from './LogoAnimada';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userType } = useAuthStore();

  const handleLogout = async () => {
    const currentUserType = useAuthStore.getState().userType;
    try {
      await signOut();
      setIsAuthMenuOpen(false);
      let redirectPath = '/login';
      if (currentUserType === USER_TYPES.PATIENT) {
        redirectPath = AUTH_URLS.USER_LOGIN;
      } else if (currentUserType === USER_TYPES.SPECIALIST) {
        redirectPath = AUTH_URLS.SPECIALIST_LOGIN;
      } else if (currentUserType === USER_TYPES.ADMIN) {
        redirectPath = AUTH_URLS.ADMIN_LOGIN;
      }
      
      navigate(redirectPath);
      toast.success('Logout realizado com sucesso.');
    } catch (error) {
      console.error("Erro ao fazer logout (Navbar):", error);
      toast.error('Erro ao fazer logout. Por favor, tente novamente.');
    }
  };

  const getUserTypeLabel = () => {
    switch (userType) {
      case USER_TYPES.USER:
        return 'Paciente';
      case USER_TYPES.SPECIALIST:
        return 'Profissional de Saúde';
      default:
        return 'Usuário';
    }
  };

  const getUserFullName = () => {
    if (!user) return 'Acessar';
    return user.user_metadata?.full_name || 'Usuário';
  };

  return (
    <nav className="bg-verde-cia-escuro text-white shadow-lg">
      <div className="max-w-7xl mx-auto">
        {/* Top bar */}
        <div className="border-b border-white/30">
          <div className="flex flex-col md:flex-row justify-between items-center py-2 px-4">
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-2 md:mb-0">
              <a
                href="mailto:anuariodesaude@gmail.com"
                className="flex items-center text-sm hover:text-green-200 transition-all hover:scale-105 whitespace-nowrap"
              >
                <Mail className="h-4 w-4 mr-1" />
                anuariodesaude@gmail.com
              </a>
              <a
                href="tel:+556135228610"
                className="flex items-center text-sm hover:text-green-200 transition-all hover:scale-105 whitespace-nowrap"
              >
                <Phone className="h-4 w-4 mr-1" />
                (61) 3522-8610
              </a>
              <Link
                to="/sobre"
                className="flex items-center text-sm hover:text-green-200 transition-all hover:scale-105 whitespace-nowrap"
              >
                Sobre Nós
              </Link>
              <Link
                to="/contato"
                className="flex items-center text-sm hover:text-green-200 transition-all hover:scale-105 whitespace-nowrap"
              >
                Fale Conosco
              </Link>
            </div>
            
              {/* Auth Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsAuthMenuOpen(!isAuthMenuOpen)}
                  className="flex items-center text-sm hover:text-green-200 transition-all hover:scale-105 bg-white/10 px-3 py-1 rounded-full"
                >
                {user ? (
                  <>
                    <UserCircle className="h-4 w-4 mr-1" />
                    <span className="max-w-[200px] truncate">{getUserFullName()}</span>
                  </>
                ) : (
                  <>
                  <LogIn className="h-4 w-4 mr-1" />
                  <span>Acessar</span>
                  </>
                )}
                </button>
                
                {isAuthMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50">
                  {user ? (
                    <>
                      {/* Cabeçalho do dropdown com nome e tipo de usuário */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="font-medium text-gray-900">{getUserFullName()}</div>
                        <div className="text-xs text-gray-500">{getUserTypeLabel()}</div>
                      </div>

                      <Link
                        to={userType === USER_TYPES.PATIENT ? AUTH_URLS.USER_DASHBOARD : AUTH_URLS.SPECIALIST_DASHBOARD}
                        className="block px-4 py-3 text-gray-800 hover:bg-gray-100 flex items-center group"
                        onClick={() => setIsAuthMenuOpen(false)}
                      >
                        <div className="p-2 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                          <UserCircle className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <div className="font-medium">Meu Perfil</div>
                          <div className="text-xs text-gray-500">Acesse seu perfil e configurações</div>
                        </div>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full block px-4 py-3 text-gray-800 hover:bg-gray-100 flex items-center group"
                      >
                        <div className="p-2 rounded-full bg-red-50 group-hover:bg-red-100 transition-colors">
                          <LogOut className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="ml-3">
                          <div className="font-medium">Sair</div>
                          <div className="text-xs text-gray-500">Fazer logout da sua conta</div>
                        </div>
                      </button>
                    </>
                  ) : (
                    <>
                    <Link
                      to={AUTH_URLS.USER_LOGIN}
                      className="block px-4 py-3 text-gray-800 hover:bg-gray-100 flex items-center group"
                      onClick={() => setIsAuthMenuOpen(false)}
                    >
                      <div className="p-2 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                        <UserCircle className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <div className="font-medium">Portal do Paciente</div>
                        <div className="text-xs text-gray-500">Acesse seu histórico e agendamentos</div>
                      </div>
                    </Link>
                    <Link
                      to={AUTH_URLS.SPECIALIST_LOGIN}
                      className="block px-4 py-3 text-gray-800 hover:bg-gray-100 flex items-center group"
                      onClick={() => setIsAuthMenuOpen(false)}
                    >
                      <div className="p-2 rounded-full bg-verde-cia/10 group-hover:bg-verde-cia/20 transition-colors">
                        <Stethoscope className="h-5 w-5 text-verde-cia" />
                      </div>
                      <div className="ml-3">
                        <div className="font-medium">Portal Profissional</div>
                        <div className="text-xs text-gray-500">Área exclusiva para profissionais de saúde</div>
                      </div>
                    </Link>
                    </>
                  )}
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="text-xl md:text-2xl font-bold">
                <LogoAnimada />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <NavLink to="/" active={location.pathname === '/'} className="whitespace-nowrap">
                Home
              </NavLink>
              <NavLink
                to="/encontre-aqui"
                active={location.pathname === '/encontre-aqui'}
                className="whitespace-nowrap"
              >
                Encontre Aqui
              </NavLink>
              <NavLink
                to="/onde-encontrar"
                active={location.pathname === '/onde-encontrar'}
                className="whitespace-nowrap"
              >
                Onde Encontrar
              </NavLink>
              <NavLink
                to="/procure-saber"
                active={location.pathname === '/procure-saber'}
                className="whitespace-nowrap"
              >
                Procure Saber
              </NavLink>
              <NavLink
                to="/tratamentos"
                active={location.pathname === '/tratamentos'}
                className="whitespace-nowrap"
              >
                Doenças e Tratamentos
              </NavLink>
              <NavLink
                to="/noticias"
                active={location.pathname === '/noticias'}
                className="whitespace-nowrap"
              >
                Notícias
              </NavLink>
              <NavLink 
                to="/eventos" 
                active={location.pathname === '/eventos'}
                className="whitespace-nowrap"
              >
                Eventos
              </NavLink>
              <NavLink
                to="/utilidades-publicas"
                active={location.pathname === '/utilidades-publicas'}
                className="whitespace-nowrap"
              >
                Utilidades Públicas
              </NavLink>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-md hover:bg-green-800 transition-all"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <MobileNavLink to="/" active={location.pathname === '/'}>
                Home
              </MobileNavLink>
              <MobileNavLink
                to="/encontre-aqui"
                active={location.pathname === '/encontre-aqui'}
              >
                Encontre Aqui
              </MobileNavLink>
              <MobileNavLink
                to="/onde-encontrar"
                active={location.pathname === '/onde-encontrar'}
              >
                Onde Encontrar
              </MobileNavLink>
              <MobileNavLink
                to="/procure-saber"
                active={location.pathname === '/procure-saber'}
              >
                Procure Saber
              </MobileNavLink>
              <MobileNavLink
                to="/tratamentos"
                active={location.pathname === '/tratamentos'}
              >
                Doenças e Tratamentos
              </MobileNavLink>
              <MobileNavLink
                to="/noticias"
                active={location.pathname === '/noticias'}
              >
                Notícias
              </MobileNavLink>
              <MobileNavLink
                to="/eventos"
                active={location.pathname === '/eventos'}
              >
                Eventos
              </MobileNavLink>
              <MobileNavLink
                to="/utilidades-publicas"
                active={location.pathname === '/utilidades-publicas'}
              >
                Utilidades Públicas
              </MobileNavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const NavLink = ({
  to,
  children,
  active,
  className = '',
}: {
  to: string;
  children: React.ReactNode;
  active: boolean;
  className?: string;
}) => (
  <Link
    to={to}
    className={`text-sm font-medium transition-colors ${
      active ? 'text-white' : 'text-white/80 hover:text-white'
    } ${className}`}
  >
    {children}
  </Link>
);

const MobileNavLink = ({
  to,
  children,
  active,
}: {
  to: string;
  children: React.ReactNode;
  active: boolean;
}) => (
  <Link
    to={to}
    className={`block px-3 py-2 rounded-md text-base font-medium ${
      active ? 'bg-green-800 text-white' : 'text-white/80 hover:bg-green-800 hover:text-white'
    }`}
  >
    {children}
  </Link>
);

export default Navbar;