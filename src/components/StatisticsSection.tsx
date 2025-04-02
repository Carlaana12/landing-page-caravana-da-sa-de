import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Clock, Heart, Star, FileText } from 'lucide-react';
import CountUp from 'react-countup';

const stats = [
  {
    icon: Users,
    value: 5000,
    label: 'Profissionais Cadastrados',
    suffix: '+',
    color: 'bg-blue-500/10 text-blue-500'
  },
  {
    icon: Star,
    value: 25000,
    label: 'Pacientes Atendidos',
    suffix: '+',
    color: 'bg-yellow-500/10 text-yellow-500'
  },
  {
    icon: FileText,
    value: 15000,
    label: 'Consultas Realizadas',
    suffix: '+',
    color: 'bg-green-500/10 text-green-500'
  },
  {
    icon: Award,
    value: 9,
    label: 'Anos de Experiência',
    suffix: '',
    color: 'bg-purple-500/10 text-purple-500'
  }
];

const StatisticsSection = () => {
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
            Nossos Números
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Conectando profissionais de saúde e pacientes com excelência e inovação
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex justify-center mb-4">
                <div className={`w-16 h-16 rounded-full ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-2 text-gray-800">
                <CountUp end={stat.value} duration={2.5} separator="," suffix={stat.suffix} />
              </h3>
              <p className="text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;