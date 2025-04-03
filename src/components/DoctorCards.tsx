import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Calendar, Clock, Award, Languages, Shield, Video, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Tilt } from 'react-tilt';
import { useKeenSlider } from 'keen-slider/react';
import { Link } from 'react-router-dom';
import 'keen-slider/keen-slider.min.css';
import { specialists } from '../data/specialists';

const DoctorCards = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "free-snap",
    slides: {
      perView: 3,
      spacing: 32,
    },
    breakpoints: {
      "(max-width: 1024px)": {
        slides: { perView: 2, spacing: 16 },
      },
      "(max-width: 640px)": {
        slides: { perView: 1, spacing: 16 },
      },
    },
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

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

  // Use the first 3 doctors from the specialists array
  const doctors = specialists.slice(0, 3);

  return (
    <section className="py-16 relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-4 shine-text">
          Médicos em Destaque
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Conheça alguns dos nossos especialistas altamente qualificados
        </p>
      </motion.div>

      <div className="relative px-4">
        <div ref={sliderRef} className="keen-slider">
          {doctors.map((doctor, index) => (
            <div key={doctor.id} className="keen-slider__slide">
              <Tilt options={defaultTiltOptions}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden transform-gpu hover:shadow-xl transition-all duration-300"
                >
                  {/* Card Header */}
                  <div className="relative">
                    <img
                      src={doctor.imageUrl}
                      alt={doctor.name}
                      className="w-full h-48 object-cover"
                    />
                    {doctor.teleconsultation && (
                      <div className="absolute top-4 right-4 bg-verde-cia text-white px-3 py-1 rounded-full text-sm flex items-center">
                        <Video className="w-4 h-4 mr-1" />
                        Teleconsulta
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h3 className="text-white text-xl font-bold">{doctor.name}</h3>
                      <p className="text-white/90">{doctor.specialty}</p>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    {/* Rating and Reviews */}
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
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => instanceRef.current?.prev()}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <button
          onClick={() => instanceRef.current?.next()}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
        >
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>
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

export default DoctorCards;