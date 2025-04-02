import React from 'react';
import { motion } from 'framer-motion';

const partners = [
  {
    name: 'Hospital Santa Lúcia',
    logo: 'https://via.placeholder.com/150x80?text=Hospital+Santa+Lucia'
  },
  {
    name: 'Clínica Saúde Integral',
    logo: 'https://via.placeholder.com/150x80?text=Clinica+Saude+Integral'
  },
  {
    name: 'Centro Médico Brasília',
    logo: 'https://via.placeholder.com/150x80?text=Centro+Medico+Brasilia'
  },
  {
    name: 'Hospital Anchieta',
    logo: 'https://via.placeholder.com/150x80?text=Hospital+Anchieta'
  },
  {
    name: 'Laboratório Sabin',
    logo: 'https://via.placeholder.com/150x80?text=Laboratorio+Sabin'
  },
  {
    name: 'Clínica Pasteur',
    logo: 'https://via.placeholder.com/150x80?text=Clinica+Pasteur'
  }
];

const PartnerLogos = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Parceiros de Confiança
          </h2>
          <p className="text-gray-600">
            Trabalhamos com as melhores instituições de saúde
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center h-24"
            >
              <img 
                src={partner.logo} 
                alt={partner.name} 
                className="max-h-16 max-w-full"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerLogos;