import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import HeroParallax from '../components/HeroParallax';

const specialties = [
  {
    icon: LucideIcons.Heart,
    name: 'Cardiologia',
    description: 'Tratamento de doenças do coração e sistema circulatório.',
    procedures: ['Cateterismo', 'Ecocardiograma', 'Holter']
  },
  {
    icon: LucideIcons.Brain,
    name: 'Neurologia',
    description: 'Diagnóstico e tratamento de doenças do sistema nervoso.',
    procedures: ['Eletroencefalograma', 'Ressonância Magnética', 'Tomografia']
  },
  {
    icon: LucideIcons.Eye,
    name: 'Oftalmologia',
    description: 'Cuidados com a saúde dos olhos e visão.',
    procedures: ['Exame de Vista', 'Cirurgia de Catarata', 'Tratamento de Glaucoma']
  },
  {
    icon: LucideIcons.Stethoscope,
    name: 'Clínica Geral',
    description: 'Atendimento médico primário e preventivo.',
    procedures: ['Check-up', 'Consultas de Rotina', 'Prevenção de Doenças']
  },
  {
    icon: LucideIcons.Baby,
    name: 'Pediatria',
    description: 'Cuidados com a saúde de crianças e adolescentes.',
    procedures: ['Vacinação', 'Acompanhamento do Crescimento', 'Tratamento de Doenças Infantis']
  },
  {
    icon: LucideIcons.Bone,
    name: 'Ortopedia',
    description: 'Tratamento de problemas musculoesqueléticos.',
    procedures: ['Cirurgia Ortopédica', 'Fisioterapia', 'Tratamento de Fraturas']
  },
  {
    icon: LucideIcons.Lungs,
    name: 'Pneumologia',
    description: 'Tratamento de doenças respiratórias.',
    procedures: ['Espirometria', 'Broncoscopia', 'Tratamento de Asma']
  },
  {
    icon: LucideIcons.Pill,
    name: 'Endocrinologia',
    description: 'Tratamento de distúrbios hormonais.',
    procedures: ['Controle de Diabetes', 'Tratamento de Tireoide', 'Obesidade']
  },
  {
    icon: LucideIcons.Syringe,
    name: 'Dermatologia',
    description: 'Cuidados com a saúde da pele.',
    procedures: ['Tratamentos Estéticos', 'Cirurgias Dermatológicas', 'Tratamento de Acne']
  },
  {
    icon: LucideIcons.Activity,
    name: 'Cardiologia',
    description: 'Diagnóstico e tratamento de doenças cardíacas.',
    procedures: ['Eletrocardiograma', 'Teste Ergométrico', 'Angioplastia']
  }
];

const Specialties = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Wrapper para o HeroParallax */}
      <div className="md:w-screen md:relative md:left-1/2 md:right-1/2 md:-ml-[50vw] md:mr-[50vw] md:max-w-none">
        <HeroParallax 
          title="Especialidades Médicas"
          description="Conheça as diversas áreas de atuação e encontre o especialista certo."
          image="https://images.unsplash.com/photo-1551192422-a9ca9a2c41e1?auto=format&fit=crop&w=2000"
          typeSequence={[
            'Cardiologia',
            '2000',
            'Neurologia',
            '2000',
            'Oftalmologia',
            '2000',
            'Pediatria',
            '2000'
          ]}
        />
      </div>

      {/* Conteúdo restante DENTRO do container padrão */}
       <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Specialties Grid */}
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {specialties.map((specialty, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-verde-cia/10 rounded-lg mr-4">
                    <specialty.icon className="w-8 h-8 text-verde-cia" />
                  </div>
                  <h3 className="text-xl font-semibold">{specialty.name}</h3>
                </div>
                <p className="text-gray-600 mb-4">{specialty.description}</p>
                <div>
                  <h4 className="font-semibold mb-2">Procedimentos principais:</h4>
                  <ul className="list-disc list-inside text-gray-600">
                    {specialty.procedures.map((procedure, idx) => (
                      <li key={idx}>{procedure}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
       </div>
    </div>
  );
};

export default Specialties;