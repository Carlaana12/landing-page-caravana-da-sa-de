import React from 'react';
import { motion } from 'framer-motion';
import { 
  Stethoscope, 
  Microscope, 
  Scissors, 
  Pill, 
  Shield, 
  Siren,
  ArrowRight
} from 'lucide-react';

const services = [
  {
    icon: Stethoscope,
    title: 'Consultas Especializadas',
    description: 'Atendimento com profissionais altamente qualificados em diversas especialidades',
    color: 'bg-blue-500',
    link: '/especialidades'
  },
  {
    icon: Microscope,
    title: 'Exames Diagnósticos',
    description: 'Exames laboratoriais e de imagem com tecnologia de ponta',
    color: 'bg-purple-500',
    link: '/exames'
  },
  {
    icon: Scissors,
    title: 'Cirurgias',
    description: 'Procedimentos cirúrgicos com equipe especializada e infraestrutura moderna',
    color: 'bg-green-500',
    link: '/cirurgias'
  },
  {
    icon: Pill,
    title: 'Tratamentos Específicos',
    description: 'Protocolos personalizados para cada condição e paciente',
    color: 'bg-red-500',
    link: '/tratamentos'
  },
  {
    icon: Shield,
    title: 'Programas de Prevenção',
    description: 'Cuidados preventivos e acompanhamento contínuo da sua saúde',
    color: 'bg-yellow-500',
    link: '/prevencao'
  },
  {
    icon: Siren,
    title: 'Atendimento de Emergência',
    description: 'Pronto atendimento 24 horas para urgências e emergências',
    color: 'bg-orange-500',
    link: '/emergencia'
  }
];

const FeaturedServices = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-verde-cia/5 via-white to-verde-cia/5">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4 shine-text">
            Serviços em Destaque
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Oferecemos uma ampla gama de serviços médicos com excelência e tecnologia de ponta
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer relative overflow-hidden"
            >
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDUwIDAgTCAwIDAgMCA1MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS1vcGFjaXR5PSIwLjIiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] animate-float" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start space-x-4">
                  <div className={`${service.color} p-3 rounded-xl bg-opacity-10 transform group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className={`w-6 h-6 ${service.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-verde-cia transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {service.description}
                    </p>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center text-verde-cia font-medium group-hover:translate-x-2 transition-transform"
                    >
                      <span>Saiba mais</span>
                      <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;