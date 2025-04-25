import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Clock, Heart } from 'lucide-react';
import HeroParallax from '@/components/HeroParallax';

const About = () => {
  const stats = [
    { icon: <Users />, label: 'Pacientes Atendidos', value: '50k+' },
    { icon: <Award />, label: 'Anos de Experiência', value: '25+' },
    { icon: <Clock />, label: 'Horas de Atendimento', value: '24/7' },
    { icon: <Heart />, label: 'Vidas Impactadas', value: '100k+' },
  ];

  const teamMembers = [
    { name: 'Fabio Rodrigues', role: 'Jornalista e fundador', image: 'https://i.imgur.com/nvVZDLe.jpeg' },
    { name: 'Ana Carla', role: 'Analista de sistemas', image: 'https://i.imgur.com/lC9VO6M.jpeg' },
    { name: 'Pablo Cézar', role: 'Desenvolvedor', image: 'https://i.imgur.com/fSWp7am.jpeg' },
    { name: 'Larissa Rodrigues', role: 'Auxiliar de produção de conteúdos', image: 'https://i.imgur.com/iCq7UsT.jpeg' },
    { name: 'Bianca Bazemate', role: 'Auxiliar de produção de conteúdos', image: 'https://i.imgur.com/OnsWbYE.jpeg' },
    { name: 'Silvaneide Sérgia', role: 'Secretária', image: 'https://i.imgur.com/XNpLFs9.jpeg' },
    { name: 'Ciro Souza', role: 'Representante comercial', image: 'https://i.imgur.com/22oQIlV.png' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Wrapper para o HeroParallax */}
      <div className="md:w-screen md:relative md:left-1/2 md:right-1/2 md:-ml-[50vw] md:mr-[50vw] md:max-w-none">
         <HeroParallax
           title="Sobre o Anuário & Saúde"
           description="Conectando profissionais de saúde e pacientes com excelência e inovação"
           image="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=2000"
           typeSequence={[
             'Excelência em Saúde',
             '2000',
             'Inovação Constante',
             '2000',
             'Compromisso com o Bem-estar',
             '2000'
           ]}
         />
      </div>

      {/* Conteúdo restante DENTRO do container padrão com margem para AdSidebar */}
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-16 md:ml-[240px]">
          {/* Missão, Visão, Valores */}
          <section className="grid md:grid-cols-3 gap-8 text-center">
            {/* ... conteúdo ... */}
          </section>

          {/* Team */}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-4xl font-bold text-center mb-12">
                Nossa Equipe
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                 {teamMembers.map((member, index) => (
                   <motion.div
                     key={index}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.6, delay: index * 0.2 }}
                     className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow w-64 mx-auto"
                   >
                     <div className="w-64 h-64 overflow-hidden flex justify-center items-center">
                       <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                     </div>
                     <div className="p-4 text-center">
                       <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                       <p className="text-gray-600 text-sm">{member.role}</p>
                     </div>
                   </motion.div>
                 ))}
              </div>
            </div>
          </section>
      </div>
    </div>
  );
};

export default About;
