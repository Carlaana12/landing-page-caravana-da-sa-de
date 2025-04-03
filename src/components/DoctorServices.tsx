import React from 'react';
import { motion } from 'framer-motion';
import { FileText, DollarSign, Clock, Calendar, Info } from 'lucide-react';

interface Service {
  name: string;
  price?: string;
  duration?: string;
  description?: string;
}

interface DoctorServicesProps {
  exams: string[];
  specialty: string;
  availability?: string[];
}

const DoctorServices: React.FC<DoctorServicesProps> = ({ exams, specialty, availability }) => {
  // Generate services based on specialty and exams
  const generateServices = (): Service[] => {
    const services: Service[] = [];
    
    // Add consultation service
    services.push({
      name: `Consulta de ${specialty}`,
      price: 'R$ 300,00',
      duration: '50 minutos',
      description: `Consulta completa com especialista em ${specialty}.`
    });
    
    // Add return consultation
    services.push({
      name: 'Consulta de Retorno',
      price: 'R$ 150,00',
      duration: '30 minutos',
      description: 'Acompanhamento e avaliação de resultados.'
    });
    
    // Add exams as services
    exams.forEach(exam => {
      const price = Math.floor(Math.random() * 300) + 100;
      services.push({
        name: exam,
        price: `R$ ${price},00`,
        duration: `${Math.floor(Math.random() * 30) + 15} minutos`,
        description: `Exame de ${exam.toLowerCase()} com laudo.`
      });
    });
    
    return services;
  };
  
  const services = generateServices();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Serviços Oferecidos</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {services.map((service, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-start mb-3 md:mb-0">
                <FileText className="w-5 h-5 text-verde-cia mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">{service.name}</h3>
                  {service.description && (
                    <p className="text-sm text-gray-500">{service.description}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-3 md:gap-4">
                {service.price && (
                  <div className="flex items-center text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                    <DollarSign className="w-4 h-4 mr-1 text-verde-cia" />
                    <span className="text-sm font-medium">{service.price}</span>
                  </div>
                )}
                {service.duration && (
                  <div className="flex items-center text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                    <Clock className="w-4 h-4 mr-1 text-verde-cia" />
                    <span className="text-sm font-medium">{service.duration}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Availability Section */}
      {availability && availability.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-verde-cia" />
            Horários de Atendimento
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ul className="space-y-2">
              {availability.map((time, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-verde-cia rounded-full mr-2"></div>
                  <span>{time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Insurance Information */}
      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-800 mb-2">Informações Importantes</h3>
            <p className="text-sm text-blue-700">
              Os preços podem variar de acordo com o plano de saúde. Consulte a cobertura do seu convênio antes do agendamento.
              Cancelamentos devem ser realizados com pelo menos 24 horas de antecedência.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorServices;