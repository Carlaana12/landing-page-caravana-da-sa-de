import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Calendar, Clock, Award, Languages, Shield, Video, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Tilt } from 'react-tilt';
import { Link } from 'react-router-dom';
import { specialists } from '../data/specialists';

const DoctorGrid = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [hoveredDoctor, setHoveredDoctor] = useState<string | null>(null);

  const defaultTiltOptions = {
    reverse: false,
    max: 15,
    perspective: 1000,
    scale: 1,
    speed: 1000,
    transition: true,
    axis: null,
    reset: true,
    easing: "cubic-bezier(.03,.98,.52,.99)",
  };

  return (
    <section className="py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-4 shine-text">
          Especialistas em Destaque
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Conheça nossa equipe de profissionais altamente qualificados
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {specialists.slice(0, 6).map((doctor, index) => (
          <Tilt key={doctor.id} options={defaultTiltOptions}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onHoverStart={() => setHoveredDoctor(doctor.id)}
              onHoverEnd={() => setHoveredDoctor(null)}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transform-gpu hover:shadow-xl transition-all duration-300"
            >
              {/* Card Header */}
              <div className="relative">
                <motion.img
                  src={doctor.imageUrl}
                  alt={doctor.name}
                  className="w-full h-48 object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                {doctor.teleconsultation && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute top-4 right-4 bg-verde-cia text-white px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    <Video className="w-4 h-4 mr-1" />
                    Teleconsulta
                  </motion.div>
                )}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
                >
                  <h3 className="text-white text-xl font-bold">{doctor.name}</h3>
                  <p className="text-white/90">{doctor.specialty}</p>
                </motion.div>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-4">
                {/* Rating and Experience */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-semibold">{doctor.rating}</span>
                    <span className="text-gray-500 text-sm ml-1">
                      ({doctor.reviewCount} avaliações)
                    </span>
                  </div>
                  <div className="flex items-center text-verde-cia">
                    <Award className="w-5 h-5 mr-1" />
                    <span className="text-sm">{doctor.experience}</span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                  <span>{doctor.location}</span>
                </div>

                {/* Next Available */}
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Próxima disponibilidade: Hoje, 15:00</span>
                </div>

                {/* Languages */}
                <div className="flex items-center text-gray-600">
                  <Languages className="w-5 h-5 mr-2 text-gray-400" />
                  <div className="flex flex-wrap gap-1">
                    {doctor.languages?.map(lang => (
                      <span
                        key={lang}
                        className="bg-gray-100 px-2 py-1 rounded-full text-sm"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Insurance */}
                <div className="flex items-center text-gray-600">
                  <Shield className="w-5 h-5 mr-2 text-gray-400" />
                  <div className="flex flex-wrap gap-1">
                    {doctor.insurance?.map(ins => (
                      <span
                        key={ins}
                        className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-sm"
                      >
                        {ins}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-verde-cia text-white py-2 rounded-lg hover:bg-verde-cia-escuro transition-colors"
                  >
                    Agendar Consulta
                  </motion.button>
                  <Link
                    to={`/medico/${doctor.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="px-4 py-2 border-2 border-verde-cia text-verde-cia rounded-lg hover:bg-verde-cia hover:text-white transition-colors flex items-center justify-center"
                  >
                    Ver Perfil
                  </Link>
                </div>
              </div>
            </motion.div>
          </Tilt>
        ))}
      </div>

      {/* Modal de Perfil Detalhado */}
      <AnimatePresence>
        {selectedDoctor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
            >
              <button
                onClick={() => setSelectedDoctor(null)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* Modal content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Perfil Detalhado</h3>
                <p className="text-gray-600 mb-4">
                  Veja mais informações sobre este profissional na página de perfil completa.
                </p>
                <Link
                  to={`/medico/${specialists.find(d => d.id === selectedDoctor)?.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="w-full block text-center bg-verde-cia text-white py-2 rounded-lg hover:bg-verde-cia-escuro transition-colors"
                  onClick={() => setSelectedDoctor(null)}
                >
                  Ver Perfil Completo
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default DoctorGrid;