import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Mail, Phone, LogIn, UserCircle, Stethoscope } from 'lucide-react';
import { AUTH_URLS } from '../lib/constants';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-verde-cia-escuro text-white shadow-lg">
      <div className="max-w-7xl mx-auto">
        {/* Top bar */}
        <div className="border-b border-white/30">
          <div className="flex flex-col md:flex-row justify-between items-center py-2 px-4">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 mb-2 md:mb-0">
              <a
                href="mailto:ciacomunicacaointegrada@gmail.com"
                className="flex items-center text-sm hover:text-green-200 transition-all hover:scale-105"
              >
                <Mail className="h-4 w-4 mr-1" />
                ciacomunicacaointegrada@gmail.com
              </a>
              <a
                href="tel:+556133995266"
                className="flex items-center text-sm hover:text-green-200 transition-all hover:scale-105"
              >
                <Phone className="h-4 w-4 mr-1" />
                (61)98192-6686
              </a>
            </div>
            <div className="flex items-center space-x-2">
              {/* Auth Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsAuthMenuOpen(!isAuthMenuOpen)}
                  className="flex items-center text-sm hover:text-green-200 transition-all hover:scale-105 bg-white/10 px-3 py-1 rounded-full"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  <span>Acessar</span>
                </button>
                
                {isAuthMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50">
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
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="text-xl md:text-2xl font-bold shine-text">
                Anuário de Saúde
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink to="/" active={location.pathname === '/'}>
                Home
              </NavLink>
              <NavLink to="/sobre" active={location.pathname === '/sobre'}>
                Sobre Nós
              </NavLink>
              <NavLink
                to="/encontre-aqui"
                active={location.pathname === '/encontre-aqui'}
              >
                Encontre Aqui
              </NavLink>
              <NavLink
                to="/tratamentos"
                active={location.pathname === '/tratamentos'}
              >
                Doenças e Tratamentos
              </NavLink>
              <NavLink
                to="/noticias"
                active={location.pathname === '/noticias'}
              >
                Notícias
              </NavLink>
              <NavLink to="/eventos" active={location.pathname === '/eventos'}>
                Eventos
              </NavLink>
              <NavLink
                to="/utilidades-publicas"
                active={location.pathname === '/utilidades-publicas'}
              >
                Utilidades Públicas
              </NavLink>
              <NavLink to="/contato" active={location.pathname === '/contato'}>
                Fale Conosco
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
                to="/sobre"
                active={location.pathname === '/sobre'}
              >
                Sobre Nós
              </MobileNavLink>
              <MobileNavLink
                to="/encontre-aqui"
                active={location.pathname === '/encontre-aqui'}
              >
                Encontre Aqui
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
              <MobileNavLink
                to="/contato"
                active={location.pathname === '/contato'}
              >
                Fale Conosco
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
}: {
  to: string;
  children: React.ReactNode;
  active: boolean;
}) => (
  <Link
    to={to}
    className={`text-sm font-medium transition-all hover:scale-105 hover:-translate-y-0.5 ${
      active ? 'text-green-200' : 'hover:text-green-200'
    }`}
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
    className={`block px-3 py-2 text-base font-medium rounded-md transition-all hover:scale-105 ${
      active ? 'bg-green-800 text-white' : 'hover:bg-green-800'
    }`}
  >
    {children}
  </Link>
);

export default Navbar;