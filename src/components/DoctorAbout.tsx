import React from 'react';
import { motion } from 'framer-motion';
import { Award, Languages, Shield, GraduationCap, Briefcase, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { Specialist } from '../lib/types';

interface DoctorAboutProps {
  doctor: Specialist;
}

const DoctorAbout: React.FC<DoctorAboutProps> = ({ doctor }) => {
  // Generate education based on specialty
  const generateEducation = () => {
    const universities = [
      'Universidade de São Paulo (USP)',
      'Universidade Federal do Rio de Janeiro (UFRJ)',
      'Universidade de Brasília (UnB)',
      'Universidade Federal de Minas Gerais (UFMG)',
      'Universidade Estadual de Campinas (UNICAMP)'
    ];
    
    const specializations = {
      'Cardiologia': ['Cardiologia', 'Cardiologia Intervencionista'],
      'Dermatologia': ['Dermatologia', 'Dermatologia Estética'],
      'Neurologia': ['Neurologia', 'Neurologia Clínica'],
      'Ortopedia': ['Ortopedia', 'Traumatologia'],
      'Ginecologia': ['Ginecologia', 'Obstetrícia'],
      'Pediatria': ['Pediatria', 'Neonatologia'],
      'Fisioterapia': ['Fisioterapia', 'Fisioterapia Esportiva'],
      'Médico Domiciliar': ['Medicina de Família', 'Geriatria']
    };
    
    const university = universities[Math.floor(Math.random() * universities.length)];
    const specialization = specializations[doctor.specialty as keyof typeof specializations] || [doctor.specialty];
    
    const graduationYear = 2024 - parseInt(doctor.experience?.replace(/[^0-9]/g, '') || '10') - 5;
    const specializationYear = graduationYear + 4;
    
    return [
      {
        degree: 'Graduação em Medicina',
        institution: university,
        year: graduationYear
      },
      {
        degree: `Residência em ${specialization[0]}`,
        institution: universities[(universities.indexOf(university) + 1) % universities.length],
        year: specializationYear
      },
      {
        degree: `Especialização em ${specialization[1] || specialization[0]}`,
        institution: universities[(universities.indexOf(university) + 2) % universities.length],
        year: specializationYear + 2
      }
    ];
  };
  
  // Generate work experience
  const generateExperience = () => {
    const hospitals = [
      'Hospital Sírio-Libanês',
      'Hospital Albert Einstein',
      'Hospital Santa Lúcia',
      'Hospital Brasília',
      'Hospital Santa Helena'
    ];
    
    const experienceYears = parseInt(doctor.experience?.replace(/[^0-9]/g, '') || '10');
    const currentYear = new Date().getFullYear();
    
    return [
      {
        position: `${doctor.specialty} Sênior`,
        institution: hospitals[0],
        startYear: currentYear - experienceYears,
        endYear: null,
        current: true
      },
      {
        position: `${doctor.specialty}`,
        institution: hospitals[1],
        startYear: currentYear - experienceYears,
        endYear: currentYear - Math.floor(experienceYears / 2),
        current: false
      },
      {
        position: `Residente em ${doctor.specialty}`,
        institution: hospitals[2],
        startYear: currentYear - experienceYears - 3,
        endYear: currentYear - experienceYears,
        current: false
      }
    ];
  };
  
  const education = generateEducation();
  const experience = generateExperience();

  return (
    <div className="space-y-8">
      {/* Bio */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Biografia</h2>
        <p className="text-gray-600">{doctor.bio || "Informações sobre o profissional não disponíveis."}</p>
      </div>

      {/* Education */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <GraduationCap className="w-5 h-5 mr-2 text-verde-cia" />
          Formação Acadêmica
        </h2>
        <div className="space-y-4">
          {education.map((edu, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex"
            >
              <div className="mr-4 relative">
                <div className="w-4 h-4 rounded-full bg-verde-cia"></div>
                {index < education.length - 1 && (
                  <div className="absolute top-4 bottom-0 left-1/2 w-0.5 -ml-px bg-gray-200 h-full"></div>
                )}
              </div>
              <div className="pb-5">
                <h3 className="font-medium">{edu.degree}</h3>
                <p className="text-gray-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">{edu.year}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Briefcase className="w-5 h-5 mr-2 text-verde-cia" />
          Experiência Profissional
        </h2>
        <div className="space-y-4">
          {experience.map((exp, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex"
            >
              <div className="mr-4 relative">
                <div className="w-4 h-4 rounded-full bg-verde-cia"></div>
                {index < experience.length - 1 && (
                  <div className="absolute top-4 bottom-0 left-1/2 w-0.5 -ml-px bg-gray-200 h-full"></div>
                )}
              </div>
              <div className="pb-5">
                <h3 className="font-medium">{exp.position}</h3>
                <p className="text-gray-600">{exp.institution}</p>
                <p className="text-sm text-gray-500">
                  {exp.startYear} - {exp.current ? 'Presente' : exp.endYear}
                  {exp.current && (
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      Atual
                    </span>
                  )}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Languages */}
      {doctor.languages && doctor.languages.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Languages className="w-5 h-5 mr-2 text-verde-cia" />
            Idiomas
          </h2>
          <div className="flex flex-wrap gap-2">
            {doctor.languages.map((lang) => (
              <span
                key={lang}
                className="bg-gray-100 px-3 py-1 rounded-full text-gray-700"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Insurance */}
      {doctor.insurance && doctor.insurance.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-verde-cia" />
            Convênios Aceitos
          </h2>
          <div className="flex flex-wrap gap-2">
            {doctor.insurance.map((ins) => (
              <span
                key={ins}
                className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full"
              >
                {ins}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contact Information */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Phone className="w-5 h-5 mr-2 text-verde-cia" />
          Informações de Contato
        </h2>
        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
          {doctor.address && (
            <div className="flex items-start">
              <MapPin className="w-5 h-5 mr-2 text-gray-400 mt-0.5" />
              <span>{doctor.address}</span>
            </div>
          )}
          {doctor.phone && (
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-2 text-gray-400" />
              <span>{doctor.phone}</span>
            </div>
          )}
          {doctor.email && (
            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-2 text-gray-400" />
              <span>{doctor.email}</span>
            </div>
          )}
          {doctor.website && (
            <div className="flex items-center">
              <Globe className="w-5 h-5 mr-2 text-gray-400" />
              <a href={doctor.website} className="text-verde-cia hover:underline">
                {doctor.website}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorAbout;