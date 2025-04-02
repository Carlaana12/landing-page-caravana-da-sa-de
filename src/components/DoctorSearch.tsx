import React, { useState } from 'react';
import { Search, MapPin, Video, Building2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const DoctorSearch = () => {
  const [selectedType, setSelectedType] = useState<'teleconsulta' | 'presencial' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [hoveredType, setHoveredType] = useState<'teleconsulta' | 'presencial' | null>(null);

  const searchTypes = [
    {
      id: 'teleconsulta',
      title: 'Teleconsulta',
      icon: Video,
      description: 'Consulte com médicos online de onde estiver',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'presencial',
      title: 'Atendimento no Local',
      icon: Building2,
      description: 'Encontre médicos próximos a você',
      color: 'bg-verde-cia',
      hoverColor: 'hover:bg-verde-cia-escuro',
      gradient: 'from-verde-cia to-verde-cia-escuro'
    },
  ];

  return (
    <section className="bg-white rounded-xl shadow-lg p-8">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-800 mb-6 text-center"
      >
        Encontre o Médico Ideal
      </motion.h2>

      {/* Tipo de Atendimento */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {searchTypes.map((type) => (
          <motion.div
            key={type.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setHoveredType(type.id as 'teleconsulta' | 'presencial')}
            onHoverEnd={() => setHoveredType(null)}
            onClick={() => setSelectedType(type.id as 'teleconsulta' | 'presencial')}
            className={`cursor-pointer rounded-xl transition-all duration-500 relative overflow-hidden ${
              selectedType === type.id
                ? `bg-gradient-to-br ${type.gradient} text-white shadow-lg`
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            {/* Animated Background */}
            <motion.div
              className="absolute inset-0 opacity-0 transition-opacity duration-500"
              animate={{
                opacity: hoveredType === type.id || selectedType === type.id ? 0.1 : 0
              }}
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDUwIDAgTCAwIDAgMCA1MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS1vcGFjaXR5PSIwLjIiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] animate-float" />
            </motion.div>

            {/* Content */}
            <div className="relative p-6">
              <div className="flex items-center space-x-4">
                <motion.div
                  animate={{
                    scale: hoveredType === type.id ? 1.1 : 1,
                    rotate: hoveredType === type.id ? 5 : 0
                  }}
                  className={`p-3 rounded-full ${
                    selectedType === type.id
                      ? 'bg-white/20'
                      : `${type.color} bg-opacity-10`
                  }`}
                >
                  <type.icon className={`w-6 h-6 ${
                    selectedType === type.id
                      ? 'text-white'
                      : type.color.replace('bg-', 'text-')
                  }`} />
                </motion.div>
                <div>
                  <motion.h3
                    animate={{
                      x: hoveredType === type.id ? 5 : 0
                    }}
                    className={`font-semibold ${
                      selectedType === type.id ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    {type.title}
                  </motion.h3>
                  <motion.p
                    animate={{
                      x: hoveredType === type.id ? 5 : 0,
                      opacity: hoveredType === type.id ? 0.9 : 0.7
                    }}
                    className={
                      selectedType === type.id ? 'text-white/90' : 'text-gray-600'
                    }
                  >
                    {type.description}
                  </motion.p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Campos de Busca */}
      {selectedType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                placeholder="Especialidade ou nome do médico"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-verde-cia focus:border-transparent transition-all duration-300"
              />
            </div>

            {selectedType === 'presencial' && (
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  placeholder="Localização"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-verde-cia focus:border-transparent transition-all duration-300"
                />
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center justify-center px-6 py-3 rounded-lg text-white transition-all duration-300 ${
                selectedType === 'teleconsulta'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                  : 'bg-gradient-to-r from-verde-cia to-verde-cia-escuro hover:from-verde-cia-escuro hover:to-verde-cia-escuro'
              } shadow-lg hover:shadow-xl`}
            >
              <span>Buscar</span>
              <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default DoctorSearch;