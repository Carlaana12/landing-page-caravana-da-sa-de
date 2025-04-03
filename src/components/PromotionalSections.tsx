import React from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  TrendingUp, 
  Users, 
  Brain, 
  Star, 
  Zap,
  MessageSquare,
  Clock,
  Shield,
  ArrowRight,
  Sparkles,
  Target
} from 'lucide-react';

const PromotionalSections = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4 shine-text">
            Faça Parte da Nossa Rede
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Escolha a melhor opção para você: seja um especialista parceiro ou utilize nosso atendimento inteligente
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Medical Specialist Promotion */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="group cursor-pointer"
          >
            <div className="bg-gradient-to-br from-verde-cia to-verde-cia-escuro rounded-2xl p-8 text-white overflow-hidden relative h-full transform transition-transform duration-300 group-hover:scale-[1.02]">
              {/* Animated Background */}
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDUwIDAgTCAwIDAgMCA1MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] animate-float" />
                <div className="absolute inset-0 bg-gradient-to-t from-verde-cia-escuro/50 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-white/10 rounded-xl mr-4">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Destaque-se como Especialista</h2>
                    <p className="text-white/80">Faça parte da nossa rede de profissionais</p>
                  </div>
                </div>

                <p className="text-lg mb-8 text-white/90">
                  Amplie sua visibilidade e alcance mais pacientes. Junte-se à nossa rede de especialistas renomados.
                </p>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <motion.div 
                    className="flex items-start"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="p-2 bg-white/10 rounded-lg mr-3">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Maior Visibilidade</h3>
                      <p className="text-sm text-white/80">Aumente sua presença online</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-start"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="p-2 bg-white/10 rounded-lg mr-3">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Mais Pacientes</h3>
                      <p className="text-sm text-white/80">Expanda sua base de clientes</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-start"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="p-2 bg-white/10 rounded-lg mr-3">
                      <Star className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Reputação</h3>
                      <p className="text-sm text-white/80">Construa sua marca pessoal</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-start"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="p-2 bg-white/10 rounded-lg mr-3">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Gestão Eficiente</h3>
                      <p className="text-sm text-white/80">Ferramentas exclusivas</p>
                    </div>
                  </motion.div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white text-verde-cia font-semibold py-4 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center group shadow-lg"
                >
                  <span>Cadastre-se como Especialista</span>
                  <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* AI Self-Service Promotion */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="group cursor-pointer"
          >
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-8 text-white overflow-hidden relative h-full transform transition-transform duration-300 group-hover:scale-[1.02]">
              {/* Animated Background */}
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDUwIDAgTCAwIDAgMCA1MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] animate-float-delay" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-700/50 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-white/10 rounded-xl mr-4">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Atendimento Inteligente</h2>
                    <p className="text-white/80">Assistente virtual com IA</p>
                  </div>
                </div>

                <p className="text-lg mb-8 text-white/90">
                  Experimente nosso assistente virtual com IA para orientação médica inicial e agendamentos.
                </p>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <motion.div 
                    className="flex items-start"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="p-2 bg-white/10 rounded-lg mr-3">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Consulta Inicial</h3>
                      <p className="text-sm text-white/80">Orientação preliminar</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-start"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="p-2 bg-white/10 rounded-lg mr-3">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">24/7 Disponível</h3>
                      <p className="text-sm text-white/80">Atendimento contínuo</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-start"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="p-2 bg-white/10 rounded-lg mr-3">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">IA Avançada</h3>
                      <p className="text-sm text-white/80">Análise inteligente</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-start"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="p-2 bg-white/10 rounded-lg mr-3">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Seguro</h3>
                      <p className="text-sm text-white/80">Dados protegidos</p>
                    </div>
                  </motion.div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white text-blue-600 font-semibold py-4 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center group shadow-lg"
                >
                  <span>Iniciar Atendimento Virtual</span>
                  <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PromotionalSections;