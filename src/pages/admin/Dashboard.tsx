import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, FileText, Image as ImageIcon, Settings as SettingsIcon,
  Palette, Calendar, Bell, BarChart2, AlertTriangle, CheckCircle,
  ArrowUp, ArrowDown
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Interface para as estatísticas
interface Stat {
  label: string;
  value: string;
  icon: React.ElementType;
  link?: string; // Link opcional para a página de gerenciamento
}

// Interface para as seções de gerenciamento
interface ContentSection {
  title: string;
  description: string;
  icon: React.ElementType;
  link: string;
  count?: number; // Contagem de itens (opcional)
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  // Poderíamos adicionar mais estados para dados específicos do dashboard

  // Função para buscar contagens
  const fetchCounts = useCallback(async () => {
    setLoadingStats(true);
    try {
      // Array de promessas para buscar contagens em paralelo
      const promises = [
        supabase.from('profiles').select('id', { count: 'exact', head: true }), // Contar usuários (usando profiles)
        supabase.from('posts').select('id', { count: 'exact', head: true }), // Contar posts
        supabase.from('events').select('id', { count: 'exact', head: true }), // Contar eventos
        supabase.from('advertisements').select('id', { count: 'exact', head: true }), // Contar anúncios
        supabase.storage.from('media').list('', { limit: 1 }), // Checar mídia (contagem é mais complexa no storage)
      ];

      const results = await Promise.allSettled(promises);

      const getCountFromResult = (result: PromiseSettledResult<any>): number => {
         if (result.status === 'fulfilled' && result.value.count !== null) {
            return result.value.count;
         }
         return 0;
      };

       const mediaResult = results[4];
       const mediaCount = mediaResult.status === 'fulfilled' ? '+' : '0'; // Storage count é impreciso assim

      setStats([
        {
          label: 'Usuários',
          value: getCountFromResult(results[0]).toString(),
          icon: Users,
          link: '/arearestrita/usuarios'
        },
        {
          label: 'Posts do Blog',
          value: getCountFromResult(results[1]).toString(),
          icon: FileText,
          link: '/arearestrita/posts'
        },
        {
          label: 'Eventos',
          value: getCountFromResult(results[2]).toString(),
          icon: Calendar,
          link: '/arearestrita/eventos'
        },
         {
          label: 'Anúncios',
          value: getCountFromResult(results[3]).toString(),
          icon: Bell,
          link: '/arearestrita/anuncios'
        },
        {
          label: 'Mídia',
          value: mediaCount, // Usar contagem simplificada
          icon: ImageIcon,
          link: '/arearestrita/media'
        },
        // Adicione mais stats se necessário
      ]);

    } catch (error) {
      toast.error('Erro ao carregar estatísticas do dashboard.');
      console.error('Error fetching dashboard stats:', error);
      // Definir stats padrão em caso de erro?
      setStats([
         { label: 'Usuários', value: '-', icon: Users, link: '/arearestrita/usuarios' },
         { label: 'Posts', value: '-', icon: FileText, link: '/arearestrita/posts' },
         { label: 'Eventos', value: '-', icon: Calendar, link: '/arearestrita/eventos' },
         { label: 'Anúncios', value: '-', icon: Bell, link: '/arearestrita/anuncios' },
         { label: 'Mídia', value: '-', icon: ImageIcon, link: '/arearestrita/media' },
      ]);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  // Seções de gerenciamento com links corretos
  const contentSections: ContentSection[] = [
     {
      title: 'Usuários',
      description: 'Gerencie administradores, especialistas e usuários',
      icon: Users,
      link: '/arearestrita/usuarios'
    },
    {
      title: 'Posts do Blog',
      description: 'Crie e edite artigos e notícias do blog',
      icon: FileText,
      link: '/arearestrita/posts'
    },
    {
      title: 'Mídia',
      description: 'Faça upload e gerencie imagens, vídeos e documentos',
      icon: ImageIcon,
      link: '/arearestrita/media'
    },
     {
      title: 'Carrossel Principal',
      description: 'Gerencie os slides do carrossel da página inicial',
      icon: LayoutDashboard, // Ícone mais apropriado
      link: '/arearestrita/carousel'
    },
    {
      title: 'Destaques',
      description: 'Edite os itens de destaque exibidos no site',
      icon: BarChart2, // Ícone mais apropriado
      link: '/arearestrita/destaques'
    },
    {
      title: 'Eventos',
      description: 'Gerencie os próximos eventos e o calendário',
      icon: Calendar,
      link: '/arearestrita/eventos'
    },
    {
      title: 'Anúncios',
      description: 'Configure banners e espaços publicitários',
      icon: Bell,
      link: '/arearestrita/anuncios'
    },
    {
      title: 'Aparência',
      description: 'Personalize cores, fontes e logo do site',
      icon: Palette,
      link: '/arearestrita/aparencia'
    },
    {
      title: 'Configurações',
      description: 'Ajuste configurações gerais e de contato',
      icon: SettingsIcon,
      link: '/arearestrita/configuracoes'
    },
  ];

  return (
    // Removido AdminLayout, pois o layout é aplicado pela rota em App.tsx
    <div className="space-y-6">
       <h1 className="text-2xl font-semibold text-gray-800">Dashboard Administrativo</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {loadingStats ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="bg-white p-4 rounded-xl shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-8 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))
          ) : (
            stats.map((stat) => (
              <Link
                key={stat.label}
                to={stat.link || '#'} // Link para a página de gerenciamento
                className={`bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center space-x-4 ${
                    stat.link ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                 <div className={`p-3 rounded-lg bg-blue-100 text-blue-600`}> {/* Cor dinâmica se necessário */}
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-800">
                    {stat.value}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Content Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentSections.map((section) => (
            <Link
              key={section.title}
              to={section.link}
              className="block bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center space-x-3 mb-3">
                 <div className={`p-2 rounded-lg bg-blue-100 text-blue-600`}> {/* Cor dinâmica */}
                  <section.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {section.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600">{section.description}</p>
              {/* Poderíamos adicionar contagem aqui se fosse fácil/rápido buscar */}
            </Link>
          ))}
        </div>

         {/* TODO: Adicionar seções de Ações Rápidas, Atividade Recente, Status do Sistema, etc. */}
         {/* Mantendo simples por enquanto para focar na funcionalidade principal */}

    </div>
  );
};

export default AdminDashboard;