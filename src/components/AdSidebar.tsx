import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import LogoAnimada from './LogoAnimada';

// Array de anúncios
const anuncios = [
  {
    id: 1,
    titulo: "Evento Especial",
    descricao: "Participe do maior evento de saúde do Distrito Federal. Palestras, workshops e networking com os principais especialistas da área.",
    data: "15 de Março, 2024",
    local: "Centro de Convenções Ulysses Guimarães"
  },
  {
    id: 2,
    titulo: "Workshop de Saúde",
    descricao: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Workshops exclusivos com profissionais renomados.",
    data: "20 de Março, 2024",
    local: "Hospital Regional de Brasília"
  },
  {
    id: 3,
    titulo: "Congresso Médico",
    descricao: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Participe do maior congresso médico do Centro-Oeste.",
    data: "25 de Março, 2024",
    local: "Centro de Eventos Brasil"
  }
];

const AnuncioPanel = ({ currentAnuncio }: { currentAnuncio: number }) => (
  <div className="bg-[#4caf50] text-white p-3 rounded-r-2xl shadow-xl w-56 mb-2">
    <AnimatePresence mode="wait">
      <motion.div
        key={currentAnuncio}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <div className="space-y-0.5">
          <h2 className="text-base font-bold leading-tight">{anuncios[currentAnuncio].titulo}</h2>
          <div className="flex items-center text-yellow-400 text-xs">
            {"★".repeat(5)}
          </div>
        </div>

        <p className="text-xs text-white/90 line-clamp-2 leading-snug">
          {anuncios[currentAnuncio].descricao}
        </p>

        <div className="space-y-0.5">
          <p className="text-xs font-medium">{anuncios[currentAnuncio].data}</p>
          <p className="text-xs text-white/90">{anuncios[currentAnuncio].local}</p>
        </div>

        <button 
          className="w-full bg-white text-[#4caf50] py-1 px-2 rounded-lg text-xs font-medium flex items-center justify-center space-x-1 hover:bg-white/90 transition-colors"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.open('https://exemplo.com/inscricao', '_blank', 'noopener,noreferrer');
            }
          }}
        >
          <span>Inscreva-se</span>
          <ArrowRight size={12} />
        </button>

        <div className="flex justify-center space-x-1 pt-1">
          {anuncios.map((_, index) => (
            <div
              key={index}
              className={`h-0.5 rounded-full transition-all duration-300 ${
                index === currentAnuncio ? 'w-2 bg-white' : 'w-0.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  </div>
);

const AdSidebar: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [currentAnuncio1, setCurrentAnuncio1] = useState(0);
  const [currentAnuncio2, setCurrentAnuncio2] = useState(1);
  const [currentAnuncio3, setCurrentAnuncio3] = useState(2);
  const [maxHeight, setMaxHeight] = useState('100vh');
  const location = useLocation();
  const triggerHeight = 600;

  useEffect(() => {
    setIsMounted(true);
    
    const updateMaxHeight = () => {
      if (typeof window !== 'undefined') {
        const footer = document.querySelector('footer');
        if (footer) {
          const footerTop = footer.getBoundingClientRect().top;
          const windowHeight = window.innerHeight;
          const availableHeight = footerTop - 40; // 40px de margem de segurança
          setMaxHeight(`${Math.max(0, availableHeight)}px`); // Garantir que não seja negativo
        }
      }
    };

    // Timers
    const timer1 = setInterval(() => setCurrentAnuncio1((prev) => (prev + 1) % anuncios.length), 5000);
    const timer2 = setInterval(() => setCurrentAnuncio2((prev) => (prev + 1) % anuncios.length), 5000);
    const timer3 = setInterval(() => setCurrentAnuncio3((prev) => (prev + 1) % anuncios.length), 5000);

    // Scroll listener
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        setShowPanel(scrollTop > triggerHeight);
        updateMaxHeight();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", updateMaxHeight);
      handleScroll(); // Chamada inicial
      updateMaxHeight(); // Chamada inicial
    }

    // Cleanup
    return () => {
      clearInterval(timer1);
      clearInterval(timer2);
      clearInterval(timer3);
      if (typeof window !== 'undefined') {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", updateMaxHeight);
      }
    };
  }, []);

  const isExcludedPage = 
    location.pathname === '/contato' || 
    location.pathname === '/fale-conosco' ||
    location.pathname === '/tratamentos';

  if (isExcludedPage || !isMounted) {
    return null;
  }

  return (
    <div
      role="complementary"
      aria-label="Painéis de anúncio"
      className={`hidden md:block fixed left-8 z-50 transition-all duration-500 ${
        showPanel ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full pointer-events-none"
      }`}
      style={{
        top: '50%',
        transform: 'translateY(-50%)',
        maxHeight: maxHeight,
        overflow: 'hidden'
      }}
    >
      <div className="flex flex-col">
        <AnuncioPanel currentAnuncio={currentAnuncio1} />
        <AnuncioPanel currentAnuncio={currentAnuncio2} />
        <AnuncioPanel currentAnuncio={currentAnuncio3} />
      </div>
    </div>
  );
};

export default AdSidebar; 