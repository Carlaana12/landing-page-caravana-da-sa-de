import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Bell,
  Settings,
  ArrowRight,
  Image,
  Star
} from 'lucide-react';

interface DashboardCard {
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  color: string;
}

const dashboardCards: DashboardCard[] = [
  {
    title: 'Carrossel',
    description: 'Gerencie as imagens do carrossel da página inicial',
    icon: Image,
    path: '/admin/carrossel',
    color: 'bg-blue-500'
  },
  {
    title: 'Eventos',
    description: 'Gerencie os eventos e calendário',
    icon: Calendar,
    path: '/admin/eventos',
    color: 'bg-green-500'
  },
  {
    title: 'Destaques',
    description: 'Gerencie os destaques especiais',
    icon: Star,
    path: '/admin/destaques',
    color: 'bg-purple-500'
  },
  {
    title: 'Anúncios',
    description: 'Gerencie os anúncios e comunicados',
    icon: Bell,
    path: '/admin/anuncios',
    color: 'bg-orange-500'
  },
  {
    title: 'Configurações',
    description: 'Configure as opções do sistema',
    icon: Settings,
    path: '/admin/configuracoes',
    color: 'bg-gray-500'
  }
];

export default function Dashboard() {
  // const navigate = useNavigate(); // Comentado se não usado
  console.log('--- Dashboard renderizou ---'); // Log adicionado

  return (
    // Conteúdo original comentado
    // <div className="p-6">
    //   <div className="mb-8">
    //     <h1 className="text-2xl font-bold text-gray-900 mb-2">Painel Administrativo</h1>
    //     <p className="text-gray-600">Gerencie o conteúdo do site através dos cards abaixo.</p>
    //   </div>
    //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    //     {dashboardCards.map((card) => (
    //       <button
    //         key={card.title}
    //         onClick={() => navigate(card.path)}
    //         className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 text-left group relative overflow-hidden"
    //       >
    //         <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-10 ${card.color}`} />
    //         <div className="relative z-10">
    //           <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${card.color} text-white mb-4`}>
    //             <card.icon className="w-6 h-6" />
    //           </div>
    //           
    //           <h2 className="text-xl font-semibold text-gray-900 mb-2">{card.title}</h2>
    //           <p className="text-gray-600 mb-4">{card.description}</p>
    //           
    //           <div className="flex items-center text-verde-cia group-hover:translate-x-1 transition-transform duration-300">
    //             <span className="mr-2 text-sm font-medium">Acessar</span>
    //             <ArrowRight className="w-4 h-4" />
    //           </div>
    //         </div>
    //       </button>
    //     ))}
    //   </div>
    // </div>

    // --- Retorno Simplificado --- 
    <div>
      <h1 style={{ color: 'blue', fontSize: '24px', padding: '20px' }}>Dashboard Simplificado OK</h1>
    </div>
    // --- Fim Retorno Simplificado ---
  );
} 