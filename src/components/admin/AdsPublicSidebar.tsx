import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const publicMenu = [
  { to: '/home', label: 'Home' },
  { to: '/sobre', label: 'Sobre Nós' },
  { to: '/encontre-aqui', label: 'Encontre Aqui' },
  { to: '/tratamentos', label: 'Doenças e Tratamentos' },
  { to: '/noticias', label: 'Notícias' },
  { to: '/eventos', label: 'Eventos' },
  { to: '/utilidades-publicas', label: 'Utilidades Públicas' },
  { to: '/contato', label: 'Fale Conosco' },
];

const AdsPublicSidebar: React.FC = () => {
  const location = useLocation();
  return (
    <aside className="w-72 p-6 flex flex-col gap-4 bg-white/30 backdrop-blur-xl border-r border-white/40 shadow-xl min-h-screen">
      <h2 className="text-xl font-extrabold text-gray-800 mb-6 tracking-tight drop-shadow-lg">Painel de Anúncios</h2>
      <nav className="flex flex-col gap-2">
        {publicMenu.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`px-4 py-3 rounded-xl font-medium text-lg transition-all flex items-center
              ${location.pathname === item.to
                ? 'bg-white/60 shadow-lg text-[#3a7bd5] border border-[#3a7bd5]/30'
                : 'text-gray-700 hover:bg-white/40 hover:shadow-md'}
            `}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdsPublicSidebar; 