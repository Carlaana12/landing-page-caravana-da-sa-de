import React from 'react';
import { Heart, Brain, Eye, Stethoscope, Baby, Bone } from 'lucide-react';
import { Link } from 'react-router-dom';

const specialties = [
  { icon: Heart, name: 'Cardiologia', link: '/especialidades/cardiologia' },
  { icon: Brain, name: 'Neurologia', link: '/especialidades/neurologia' },
  { icon: Eye, name: 'Oftalmologia', link: '/especialidades/oftalmologia' },
  { icon: Stethoscope, name: 'Clínica Geral', link: '/especialidades/clinica-geral' },
  { icon: Baby, name: 'Pediatria', link: '/especialidades/pediatria' },
  { icon: Bone, name: 'Ortopedia', link: '/especialidades/ortopedia' },
];

const SpecialtiesGrid = () => {
  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Especialidades Médicas
      </h2>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {specialties.map((specialty) => (
            <Link
              key={specialty.name}
              to={specialty.link}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center group flex flex-col items-center justify-center h-full"
            >
              <specialty.icon className="w-16 h-16 mb-6 text-verde-cia group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-800 text-base sm:text-lg">{specialty.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialtiesGrid;