import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Stethoscope, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-verde-cia to-verde-cia-escuro text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Junte-se à Nossa Comunidade de Saúde
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Seja você um profissional de saúde ou paciente, o Anuário de Saúde oferece ferramentas e recursos para melhorar sua experiência.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/especialista/login"
                className="bg-white text-verde-cia-escuro px-6 py-3 rounded-lg font-medium flex items-center justify-center hover:bg-gray-100 transition-colors group"
              >
                <Stethoscope className="w-5 h-5 mr-2" />
                <span>Sou Profissional</span>
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/usuario/login"
                className="bg-verde-cia-escuro text-white border border-white px-6 py-3 rounded-lg font-medium flex items-center justify-center hover:bg-verde-cia transition-colors group"
              >
                <User className="w-5 h-5 mr-2" />
                <span>Sou Paciente</span>
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative hidden md:block"
          >
            <div className="absolute inset-0 bg-white/10 rounded-2xl transform rotate-6"></div>
            <div className="relative bg-white/20 backdrop-blur-sm p-8 rounded-2xl">
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Para Profissionais</h3>
                    <p className="text-white/80">Aumente sua visibilidade e alcance</p>
                  </div>
                </div>
                
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                    <span>Perfil profissional personalizado</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                    <span>Gestão de agenda e pacientes</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                    <span>Teleconsultas e atendimento remoto</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                    <span>Divulgação de serviços e especialidades</span>
                  </li>
                </ul>
                
                <div className="pt-4 border-t border-white/20">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">Para Pacientes</h3>
                      <p className="text-white/80">Encontre o melhor atendimento</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mt-4">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                      <span>Busca avançada de especialistas</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                      <span>Agendamento online simplificado</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                      <span>Histórico médico organizado</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                      <span>Avaliações e recomendações</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;