import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Users, Target, Heart, Newspaper, ArrowRight, QrCode } from 'lucide-react';
import HeroParallax from '@/components/HeroParallax';
import { QRCodeSVG } from 'qrcode.react';

const About = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardHover = {
    scale: 1.05,
    transition: { duration: 0.3 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <HeroParallax
        title="Sobre o Anuário de Saúde"
        description="Inovação e excelência em informação sobre saúde"
        image="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=2000"
        typeSequence={[
          'Informação ao alcance dos cidadãos',
          2000,
          'Excelência em Saúde',
          2000,
          'Inovação Constante',
          2000
        ]}
      />

      {/* História */}
      <section className="py-20 bg-white relative overflow-hidden">
        <motion.div
          style={{ scale, opacity }}
          className="absolute inset-0 bg-[#00ff00]/5"
        />
        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-4xl font-bold mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              Nossa História
            </motion.h2>
            <motion.div 
              className="w-20 h-1 bg-[#00ff00] mx-auto mb-8"
              whileHover={{ width: 100 }}
              transition={{ duration: 0.3 }}
            />
            <motion.p 
              className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              A revista digital Anuário de Saúde é uma iniciativa da empresa Cia Comunicação Integrada, 
              de propriedade do jornalista responsável, e foi criada em 10 de março de 2020, no Riacho Fundo I – DF.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <motion.p 
              className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              Trata-se de uma plataforma digital diferenciada, que oferece aos usuários uma ampla variedade 
              de conteúdos e informações essenciais sobre as diversas especialidades da área da saúde, 
              além de apresentar serviços e preços acessíveis.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Fundador */}
      <section className="py-20 bg-gray-50 relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-[#00ff00]/10 to-transparent"
        />
        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-4xl font-bold mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              Nosso Fundador
            </motion.h2>
            <motion.div 
              className="w-20 h-1 bg-[#00ff00] mx-auto mb-8"
              whileHover={{ width: 100 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
            whileHover={{ 
              boxShadow: "0 20px 25px -5px rgba(0, 255, 0, 0.1), 0 10px 10px -5px rgba(0, 255, 0, 0.04)"
            }}
          >
            <div className="md:flex">
              <motion.div 
                className="md:w-1/3"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="https://i.imgur.com/nvVZDLe.jpeg"
                  alt="Fabio Rodrigues"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="md:w-2/3 p-8">
                <motion.h3 
                  className="text-2xl font-bold mb-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  Fabio Rodrigues
                </motion.h3>
                <motion.p 
                  className="text-[#00ff00] font-semibold mb-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  Jornalista e Fundador
                </motion.p>
                <motion.p 
                  className="text-gray-600 leading-relaxed"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  Atualmente, o Anuário de Saúde é produzido na sede da Cia Comunicação Integrada, 
                  localizada no Setor Bernardo Sayão, Núcleo Bandeirante – DF.
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Equipe */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-4">Nossos Colaboradores</h2>
            <div className="w-20 h-1 bg-[#00ff00] mx-auto mb-2" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center text-center hover:shadow-lg transition-all">
              <span className="text-lg font-bold text-gray-800 mb-1">Ana Carla</span>
              <span className="text-sm text-[#00ff00]">analista e desenvolvedora de sistemas</span>
            </div>
            {/* Card 2 */}
            <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center text-center hover:shadow-lg transition-all">
              <span className="text-lg font-bold text-gray-800 mb-1">Pablo Cézar</span>
              <span className="text-sm text-[#00ff00]">desenvolvedor</span>
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center text-center hover:shadow-lg transition-all">
              <span className="text-lg font-bold text-gray-800 mb-1">Silvaneide Sérgia</span>
              <span className="text-sm text-[#00ff00]">auxiliar geral</span>
            </div>
            {/* Card 4 */}
            <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center text-center hover:shadow-lg transition-all">
              <span className="text-lg font-bold text-gray-800 mb-1">Larissa Rodrigues</span>
              <span className="text-sm text-[#00ff00]">auxiliar de suporte de conteúdo</span>
            </div>
            {/* Card 5 */}
            <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center text-center hover:shadow-lg transition-all">
              <span className="text-lg font-bold text-gray-800 mb-1">Bianca Bazemate</span>
              <span className="text-sm text-[#00ff00]">auxiliar de suporte de conteúdo</span>
            </div>
            {/* Card 6 */}
            <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center text-center hover:shadow-lg transition-all">
              <span className="text-lg font-bold text-gray-800 mb-1">Emilly Lorrany</span>
              <span className="text-sm text-[#00ff00]">estagiária</span>
            </div>
          </div>
        </div>
      </section>

      {/* Missão e Valores */}
      <section className="py-20 bg-white relative overflow-hidden">
        <motion.div
          style={{ scale, opacity }}
          className="absolute inset-0 bg-[#00ff00]/5"
        />
        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-4xl font-bold mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              Nossa Missão
            </motion.h2>
            <motion.div 
              className="w-20 h-1 bg-[#00ff00] mx-auto mb-8"
              whileHover={{ width: 100 }}
              transition={{ duration: 0.3 }}
            />
            <motion.p 
              className="text-2xl font-semibold text-[#00ff00] mb-8"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              "A informação ao alcance dos cidadãos."
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: <Target className="w-8 h-8" />,
                title: "Objetivo",
                description: "Inovar na criação de um website profissional voltado para a disseminação de informações relevantes sobre saúde."
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Especialistas",
                description: "Reunimos os mais qualificados especialistas da área da saúde em nossos cadastros."
              },
              {
                icon: <Newspaper className="w-8 h-8" />,
                title: "Conteúdo",
                description: "Oferecemos uma ampla variedade de conteúdos e informações essenciais sobre saúde."
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Compromisso",
                description: "Equipe dedicada e comprometida em oferecer a melhor plataforma digital possível."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={cardHover}
                className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-all duration-300 relative group"
              >
                <motion.div 
                  className="absolute inset-0 bg-[#00ff00]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <motion.div 
                  className="text-[#00ff00] mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {item.icon}
                </motion.div>
                <motion.h3 
                  className="text-xl font-semibold mb-2"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  {item.title}
                </motion.h3>
                <motion.p 
                  className="text-gray-600"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {item.description}
                </motion.p>
                <motion.div
                  className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ x: 5 }}
                >
                  <ArrowRight className="w-5 h-5 text-[#00ff00]" />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Localização */}
      <section className="py-20 bg-gray-50 relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-gradient-to-l from-[#00ff00]/10 to-transparent"
        />
        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-4xl font-bold mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              Nossa Localização
            </motion.h2>
            <motion.div 
              className="w-20 h-1 bg-[#00ff00] mx-auto mb-8"
              whileHover={{ width: 100 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div 
              className="flex items-center justify-center text-gray-600 mb-8"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <MapPin className="w-6 h-6 mr-2 text-[#00ff00]" />
              <p className="text-lg">
                Setor Bernardo Sayão, Núcleo Bandeirante – DF
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-xl overflow-hidden shadow-xl h-[400px]"
            whileHover={{ 
              boxShadow: "0 20px 25px -5px rgba(0, 255, 0, 0.1), 0 10px 10px -5px rgba(0, 255, 0, 0.04)"
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3839.7721854633467!2d-47.8647!3d-15.8707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDUyJzE0LjUiUyA0N8KwNTEnNTIuOSJX!5e0!3m2!1spt-BR!2sbr!4v1635000000000!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </motion.div>
        </div>
      </section>

      {/* QR Code Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <motion.div
          style={{ scale, opacity }}
          className="absolute inset-0 bg-[#00ff00]/5"
        />
        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-4xl font-bold mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              Acesse Nosso Site
            </motion.h2>
            <motion.div 
              className="w-20 h-1 bg-[#00ff00] mx-auto mb-8"
              whileHover={{ width: 100 }}
              transition={{ duration: 0.3 }}
            />
            <motion.p 
              className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              Escaneie o QR Code abaixo para acessar nosso site diretamente do seu celular
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-2xl shadow-xl"
            >
              <QRCodeSVG
                value="https://anuariodesaude.com.br"
                size={200}
                level="H"
                includeMargin={true}
                className="rounded-lg"
              />
            </motion.div>
            <motion.p 
              className="mt-4 text-gray-600"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              anuariodesaude.com.br
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
