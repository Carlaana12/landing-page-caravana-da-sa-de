import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  Users,
  Image as ImageIcon,
  FileText,
  Eye,
  ArrowUp,
  ArrowDown,
  Edit3,
  Layout,
  Calendar,
  Bell,
  Settings,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const contentSections = [
    {
      title: 'Carrossel Principal',
      description: 'Gerencie os slides do carrossel da página inicial',
      icon: Layout,
      link: '/admin/carousel',
      items: 5,
      lastUpdate: '2 horas atrás'
    },
    {
      title: 'Destaques',
      description: 'Edite os destaques e estatísticas',
      icon: Edit3,
      link: '/admin/highlights',
      items: 4,
      lastUpdate: '1 dia atrás'
    },
    {
      title: 'Eventos',
      description: 'Gerencie eventos e calendário',
      icon: Calendar,
      link: '/admin/events',
      items: 3,
      lastUpdate: '3 dias atrás'
    },
    {
      title: 'Anúncios',
      description: 'Configure banners e anúncios',
      icon: Bell,
      link: '/admin/ads',
      items: 2,
      lastUpdate: '5 dias atrás'
    }
  ];

  const stats = [
    {
      label: 'Páginas',
      value: '23',
      icon: FileText,
      change: '+15%',
      trend: 'up',
    },
    {
      label: 'Mídia',
      value: '567',
      icon: ImageIcon,
      change: '+8%',
      trend: 'up',
    },
    {
      label: 'Usuários',
      value: '1,234',
      icon: Users,
      change: '+12%',
      trend: 'up',
    },
    {
      label: 'Visualizações',
      value: '45.2k',
      icon: Eye,
      change: '-3%',
      trend: 'down',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <Link
            to="/admin/settings"
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Settings className="h-5 w-5 text-gray-600" />
            <span className="text-gray-600">Configurações</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-800">
                    {stat.value}
                  </p>
                </div>
                <div className="p-3 bg-gray-100 rounded-lg">
                  <stat.icon className="h-6 w-6 text-gray-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {stat.trend === 'up' ? (
                  <ArrowUp className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={`ml-1 text-sm ${
                    stat.trend === 'up'
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Content Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contentSections.map((section) => (
            <Link
              key={section.title}
              to={section.link}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-verde-cia/10 rounded-lg">
                      <section.icon className="h-6 w-6 text-verde-cia" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {section.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-gray-600">{section.description}</p>
                  <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                    <span>{section.items} itens</span>
                    <span>•</span>
                    <span>Última atualização: {section.lastUpdate}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 text-center rounded-lg border-2 border-dashed border-gray-300 hover:border-verde-cia hover:text-verde-cia transition-colors">
              <FileText className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm">Nova Página</span>
            </button>
            <button className="p-4 text-center rounded-lg border-2 border-dashed border-gray-300 hover:border-verde-cia hover:text-verde-cia transition-colors">
              <ImageIcon className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm">Upload de Mídia</span>
            </button>
            <button className="p-4 text-center rounded-lg border-2 border-dashed border-gray-300 hover:border-verde-cia hover:text-verde-cia transition-colors">
              <Calendar className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm">Novo Evento</span>
            </button>
            <button className="p-4 text-center rounded-lg border-2 border-dashed border-gray-300 hover:border-verde-cia hover:text-verde-cia transition-colors">
              <Bell className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm">Novo Anúncio</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;