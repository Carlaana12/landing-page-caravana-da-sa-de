import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

interface HeroParallaxProps {
  title: string;
  description: string;
  image: string;
  height?: string;
  overlayColor?: string;
  typeSequence?: string[];
}

const HeroParallax: React.FC<HeroParallaxProps> = ({
  title,
  description,
  image,
  height = "h-[600px]",
  overlayColor = "from-verde-cia-escuro",
  typeSequence
}) => {
  return (
    <div className="relative">
      <div 
        className={`relative ${height} overflow-hidden`}
      >
        {/* Background Image with Parallax Effect */}
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transform hover:scale-105 transition-transform duration-1000"
            style={{ backgroundImage: `url(${image})` }}
          />
          <div className={`absolute inset-0 bg-gradient-to-b ${overlayColor} from-black/70 via-black/50 to-black/70`} />
        </motion.div>

        {/* Content Overlay */}
        <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold mb-6 shine-text"
            >
              {title}
            </motion.h1>
            
            {typeSequence ? (
              <TypeAnimation
                sequence={typeSequence}
                wrapper="p"
                speed={50}
                className="text-xl md:text-2xl text-white/90"
                repeat={Infinity}
              />
            ) : (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl md:text-2xl text-white/90"
              >
                {description}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 flex flex-wrap justify-center gap-6"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-sm md:text-base font-medium text-white/90">Profissionais Qualificados</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-sm md:text-base font-medium text-white/90">Atendimento Humanizado</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-sm md:text-base font-medium text-white/90">Tecnologia Avançada</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-float" />
          <div className="absolute top-1/2 -left-8 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float-delay" />
          <div className="absolute -bottom-8 right-1/4 w-40 h-40 bg-white/10 rounded-full blur-xl animate-float-slow" />
        </div>
      </div>
    </div>
  );
};

export default HeroParallax;