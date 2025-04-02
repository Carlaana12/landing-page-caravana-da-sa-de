import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Calendar, Clock, Award, Languages, Shield, Video, Phone, Mail } from 'lucide-react';
import { Specialist } from '../lib/types';
import { Link } from 'react-router-dom';

interface SpecialistCardProps {
  specialist: Specialist;
  onClick?: () => void;
}

const SpecialistCard: React.FC<SpecialistCardProps> = ({ specialist, onClick }) => {
  // Create slug from specialist name
  const specialistSlug = specialist.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden transform-gpu hover:shadow-xl transition-all duration-300"
      onClick={onClick}
    >
      {/* Card Header */}
      <div className="relative">
        <img
          src={specialist.imageUrl || 'https://via.placeholder.com/300x200?text=Sem+Foto'}
          alt={specialist.name}
          className="w-full h-48 object-cover"
        />
        {specialist.teleconsultation && (
          <div className="absolute top-4 right-4 bg-verde-cia text-white px-3 py-1 rounded-full text-sm flex items-center">
            <Video className="w-4 h-4 mr-1" />
            Teleconsulta
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-white text-xl font-bold">{specialist.name}</h3>
          <p className="text-white/90">{specialist.specialty}</p>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 space-y-4">
        {/* Rating and Reviews */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="ml-1 font-semibold">{specialist.rating}</span>
            <span className="text-gray-500 text-sm ml-1">
              ({specialist.reviewCount} avaliações)
            </span>
          </div>
          <div className="flex items-center text-verde-cia">
            <Award className="w-5 h-5 mr-1" />
            <span className="text-sm">{specialist.experience || 'Verificado'}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-600">
          <MapPin className="w-5 h-5 mr-2 text-gray-400" />
          <span>{specialist.address || specialist.city}</span>
        </div>

        {/* Contact */}
        {specialist.phone && (
          <div className="flex items-center text-gray-600">
            <Phone className="w-5 h-5 mr-2 text-gray-400" />
            <span>{specialist.phone}</span>
          </div>
        )}

        {/* Languages */}
        {specialist.languages && specialist.languages.length > 0 && (
          <div className="flex items-center text-gray-600">
            <Languages className="w-5 h-5 mr-2 text-gray-400" />
            <div className="flex flex-wrap gap-1">
              {specialist.languages.slice(0, 2).map(lang => (
                <span
                  key={lang}
                  className="bg-gray-100 px-2 py-1 rounded-full text-xs"
                >
                  {lang}
                </span>
              ))}
              {specialist.languages.length > 2 && (
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  +{specialist.languages.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Exams */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-700">Exames disponíveis:</p>
          <div className="flex flex-wrap gap-1">
            {specialist.exams.slice(0, 2).map((exam, index) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs"
              >
                {exam}
              </span>
            ))}
            {specialist.exams.length > 2 && (
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                +{specialist.exams.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Availability */}
        {specialist.availability && specialist.availability.length > 0 && (
          <div className="flex items-center text-gray-600">
            <Clock className="w-5 h-5 mr-2 text-gray-400" />
            <span className="text-sm">{specialist.availability[0]}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-verde-cia text-white py-2 rounded-lg hover:bg-verde-cia-escuro transition-colors"
          >
            Agendar Consulta
          </motion.button>
          <Link
            to={`/medico/${specialistSlug}`}
            className="px-4 py-2 border-2 border-verde-cia text-verde-cia rounded-lg hover:bg-verde-cia hover:text-white transition-colors flex items-center justify-center"
          >
            Ver Perfil
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default SpecialistCard;