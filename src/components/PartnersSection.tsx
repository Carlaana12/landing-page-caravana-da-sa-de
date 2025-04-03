import React from 'react';
import { motion } from 'framer-motion';
import { Building2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const partners = [
  { id: 1, name: 'Hospital São Lucas', logo: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Clínica Bem Estar', logo: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Centro Médico Vida', logo: 'https://via.placeholder.com/150' },
  { id: 4, name: 'Hospital Santa Maria', logo: 'https://via.placeholder.com/150' },
  { id: 5, name: 'Clínica Saúde Total', logo: 'https://via.placeholder.com/150' },
  { id: 6, name: 'Centro de Diagnósticos', logo: 'https://via.placeholder.com/150' },
];

const PartnersSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-verde-cia/5 to-white rounded-xl">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Nossos Parceiros</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Contamos com uma rede de parceiros comprometidos com a excelência em saúde
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <div className="aspect-square rounded-lg bg-gray-50 flex items-center justify-center mb-4">
                <Building2 className="w-12 h-12 text-verde-cia" />
              </div>
              <h3 className="text-center font-medium text-gray-800 text-sm">
                {partner.name}
              </h3>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            to="/parceiros"
            className="inline-flex items-center text-verde-cia hover:text-verde-cia-escuro transition-colors group"
          >
            <span className="font-medium">Conheça todos os nossos parceiros</span>
            <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersSection;