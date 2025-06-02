import React from "react";
import { Link, useLocation } from "react-router-dom";

const menu = [
  { to: "/arearestrita", label: "Dashboard", icon: (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6m-6 0H7m6 0v6m0 0H7m6 0h6" /></svg>
  ) },
  { to: "/arearestrita/media", label: "Mídia", icon: (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A2 2 0 0021 6.382V5a2 2 0 00-2-2H5a2 2 0 00-2 2v1.382a2 2 0 00.447 1.342L8 10m7 0v10m0 0H9m6 0a2 2 0 002-2V10m-2 10a2 2 0 01-2-2V10m0 10H9m0 0V10" /></svg>
  ) },
  { to: "/arearestrita/aparencia", label: "Aparência", icon: (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
  ) },
  { to: "/arearestrita/configuracoes", label: "Configurações", icon: (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
  ) },
  { to: "/arearestrita/carrossel", label: "Carrossel", icon: (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8" /></svg>
  ) },
  { to: "/arearestrita/destaques", label: "Destaques", icon: (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 17.75L18.518 21l-1.64-7.034L22 9.75l-7.19-.617L12 2.5l-2.81 6.633L2 9.75l5.122 4.216L5.482 21z" /></svg>
  ) },
  { to: "/arearestrita/eventos", label: "Eventos", icon: (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 2v4m8-4v4M2 10h20" /></svg>
  ) },
  { to: "/arearestrita/anuncios", label: "Publicidade (Sidebar)", icon: (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 2v4m8-4v4M2 10h20" /></svg>
  ) },
];

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  return (
    <aside className="w-64 bg-gradient-to-b from-blue-900 to-blue-700 text-white min-h-screen p-4 flex flex-col gap-2 shadow-lg">
      <h2 className="text-xl font-bold mb-6 tracking-wide">Painel Administrativo</h2>
      <nav className="flex flex-col gap-1">
        {menu.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center px-3 py-2 rounded transition-colors duration-150 hover:bg-blue-800 ${location.pathname === item.to ? 'bg-blue-800 font-semibold' : ''}`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar; 