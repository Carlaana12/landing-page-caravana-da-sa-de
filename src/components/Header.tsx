import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const menuItems = [
  { path: '/', label: 'Home' },
  { path: '/sobre', label: 'Sobre' },
  { path: '/encontre-aqui', label: 'Encontre Aqui' },
  { path: '/tratamentos', label: 'Tratamentos' },
  { path: '/noticias', label: 'Notícias' },
  { path: '/eventos', label: 'Eventos' },
  { path: '/utilidades-publicas', label: 'Utilidades Públicas' },
  { path: '/contato', label: 'Contato' },
  { path: '/blog', label: 'Blog' },
];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50">
      {/* Barra superior com informações de contato */}
      <div className="bg-verde-cia text-white py-2 text-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span>(61) 99999-9999</span>
            <span>contato@anuariodesaude.com.br</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="hover:underline">Área Restrita</Link>
          </div>
        </div>
      </div>

      {/* Barra principal com logo e navegação */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-verde-cia">Anuário de Saúde</span>
          </Link>

          {/* Menu para desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-verde-cia
                  ${location.pathname === item.path ? 'text-verde-cia' : 'text-gray-600'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Botão do menu mobile */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <nav className="container mx-auto px-4 py-4 bg-white border-t border-gray-200">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-2 text-sm font-medium transition-colors hover:text-verde-cia
                  ${location.pathname === item.path ? 'text-verde-cia' : 'text-gray-600'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header; 