import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Calendar, 
  Video, 
  Clock, 
  Star, 
  Shield, 
  FileText, 
  MessageSquare 
} from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Busca Inteligente',
    description: 'Encontre o especialista ideal com nossa busca avançada por especialidade, localização ou disponibilidade.',
    color: 'bg-blue-500/10 text-blue-500'
  },
  {
    icon: Calendar,
    title: 'Agendamento Online',
    description: 'Marque consultas com facilidade, escolhendo o horário que melhor se adapta à sua rotina.',
    color: 'bg-green-500/10 text-green-500'
  },
  {
    icon: Video,
    title: 'Teleconsultas',
    description: 'Consulte-se com especialistas de qualquer lugar, sem sair de casa, através de videochamadas seguras.',
    color: 'bg-purple-500/10 text-purple-500'
  },
  {
    icon: Clock,
    title: 'Disponibilidade em Tempo Real',
    description: 'Veja a agenda dos médicos em tempo real e encontre horários disponíveis rapidamente.',
    color: 'bg-orange-500/10 text-orange-500'
  },
  {
    icon: Star,
    title: 'Avaliações Verificadas',
    description: 'Leia avaliações reais de outros pacientes para escolher o melhor profissional.',
    color: 'bg-yellow-500/10 text-yellow-500'
  },
  {
    icon: Shield,
    title: 'Profissionais Verificados',
    description: 'Todos os especialistas passam por um rigoroso processo de verificação de credenciais.',
    color: 'bg-red-500/10 text-red-500'
  },
  {
    icon: FileText,
    title: 'Histórico Médico',
    description: 'Mantenha seu histórico médico organizado e acessível a qualquer momento.',
    color: 'bg-indigo-500/10 text-indigo-500'
  },
  {
    icon: MessageSquare,
    title: 'Comunicação Direta',
    description: 'Comunique-se diretamente com seu médico para tirar dúvidas ou obter orientações.',
    color: 'bg-teal-500/10 text-teal-500'
  }
];

const FeatureHighlights = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4 shine-text">
            Por Que Escolher o Anuário de Saúde
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Oferecemos ferramentas e recursos inovadores para conectar pacientes e profissionais de saúde
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;