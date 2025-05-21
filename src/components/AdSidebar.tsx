import React, { useState, useEffect } from 'react';

interface AdSidebarProps {
  className?: string;
}

const AdSidebar: React.FC<AdSidebarProps> = ({ className = '' }) => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [currentText, setCurrentText] = useState(0);
  const [slideDirection, setSlideDirection] = useState('right');

  const banners = [
    {
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=2000",
      title: "ANUNCIE SEU CONSULTÓRIO!",
      description: "Alcance mais pacientes"
    },
    {
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=2000",
      title: "PROMOVA SEUS SERVIÇOS!",
      description: "Destaque-se no mercado"
    },
    {
      image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=2000",
      title: "AUMENTE SUA VISIBILIDADE!",
      description: "Cresça seu negócio"
    }
  ];

  const texts = [
    { text: "ANUNCIE AQUI!", duration: 5000 },
    { text: "SE CONECTE!", duration: 3000 },
    { text: "DESTAQUE-SE!", duration: 3000 },
    { text: "CRESÇA!", duration: 3000 }
  ];

  useEffect(() => {
    const bannerInterval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);

    const textInterval = setInterval(() => {
      setSlideDirection(prev => prev === 'right' ? 'left' : 'right');
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, texts[currentText].duration);

    return () => {
      clearInterval(bannerInterval);
      clearInterval(textInterval);
    };
  }, [currentText]);

  return (
    <div className={`absolute left-0 top-0 h-full w-[250px] bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a] text-white p-4 shadow-lg ${className}`}>
      <div className="sticky top-4">
        <div className="text-center mb-6">
          <div className="h-8 overflow-hidden">
            <h2 
              className={`text-2xl font-bold text-[#00ff00] transition-all duration-500 ${
                slideDirection === 'right' 
                  ? 'animate-slide-right' 
                  : 'animate-slide-left'
              }`}
            >
              {texts[currentText].text}
            </h2>
          </div>
          <div className="w-20 h-1 bg-[#00ff00] mx-auto mt-2"></div>
        </div>
        
        <div className="space-y-4">
          <div className="relative h-[500px] rounded-lg overflow-hidden flex items-center justify-center">
            {banners.map((banner, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentBanner ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-center">
                  <h3 className="text-lg font-bold text-[#00ff00]">{banner.title}</h3>
                  <p className="text-sm text-gray-300">{banner.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#2a2a2a] p-4 rounded-lg border border-[#00ff00]/20 text-center">
            <h3 className="text-lg font-bold text-[#00ff00] mb-2">QUER DIVULGAR?</h3>
            <button 
              onClick={() => window.open('https://mail.google.com/mail/?view=cm&fs=1&to=ciacomunicacaointegrada@gmail.com&su=Divulgacao%20Anuario%20da%20Saude')}
              className="w-full bg-[#00ff00] text-black font-bold py-3 px-6 rounded-lg hover:bg-[#00ff00]/80 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#00ff00]/20"
            >
              FALE CONOSCO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdSidebar; 