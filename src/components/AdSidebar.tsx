import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface AdSidebarProps {
  className?: string;
}

interface AdminAd {
  id: string;
  titulo: string;
  cor_titulo: string;
  imagens: {
    url: string;
    titulo: string;
    cor_titulo: string;
    subtitulo: string;
    cor_subtitulo: string;
    frase_menor: string;
    cor_frase_menor: string;
    texto_extra: string;
  }[];
  criado_em: string;
  atualizado_em: string;
  divulgado: boolean;
}

const AdSidebar: React.FC<AdSidebarProps> = ({ className = '' }) => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [currentText, setCurrentText] = useState(0);
  const [slideDirection, setSlideDirection] = useState('right');
  const [anuncios, setAnuncios] = useState<AdminAd[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnuncios();
  }, []);

  const fetchAnuncios = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_ads')
        .select('*')
        .eq('divulgado', true)
        .order('criado_em', { ascending: false });

      if (error) throw error;
      setAnuncios(data || []);
    } catch (error) {
      console.error('Erro ao carregar anúncios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (anuncios.length > 0) {
      const bannerInterval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % anuncios.length);
      }, 5000);

      const textInterval = setInterval(() => {
        setSlideDirection(prev => prev === 'right' ? 'left' : 'right');
        setCurrentText((prev) => (prev + 1) % anuncios.length);
      }, 3000);

      return () => {
        clearInterval(bannerInterval);
        clearInterval(textInterval);
      };
    }
  }, [anuncios]);

  if (loading) {
    return (
      <div className={`absolute left-0 top-0 h-full w-[250px] bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a] text-white p-4 shadow-lg ${className}`}>
        <div className="sticky top-4">
          <div className="text-center mb-6">
            <div className="h-8 overflow-hidden">
              <h2 className="text-2xl font-bold text-[#00ff00]">Carregando...</h2>
            </div>
            <div className="w-20 h-1 bg-[#00ff00] mx-auto mt-2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (anuncios.length === 0) {
    return (
      <div className={`absolute left-0 top-0 h-full w-[250px] bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a] text-white p-4 shadow-lg ${className}`}>
        <div className="sticky top-4">
          <div className="text-center mb-6">
            <div className="h-8 overflow-hidden">
              <h2 className="text-2xl font-bold text-[#00ff00]">ANUNCIE AQUI!</h2>
            </div>
            <div className="w-20 h-1 bg-[#00ff00] mx-auto mt-2"></div>
          </div>
          <div className="space-y-4">
            <div className="relative h-[500px] rounded-lg overflow-hidden flex items-center justify-center bg-gray-800">
              <div className="text-center p-4">
                <h3 className="text-lg font-bold text-[#00ff00]">QUER DIVULGAR?</h3>
                <p className="text-sm text-gray-300 mt-2">Seja nosso parceiro e alcance mais pacientes</p>
                <button 
                  onClick={() => window.open('https://mail.google.com/mail/?view=cm&fs=1&to=ciacomunicacaointegrada@gmail.com&su=Divulgacao%20Anuario%20da%20Saude')}
                  className="mt-4 w-full bg-[#00ff00] text-black font-bold py-3 px-6 rounded-lg hover:bg-[#00ff00]/80 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#00ff00]/20"
                >
                  FALE CONOSCO
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentAnuncio = anuncios[currentBanner];
  const currentImagem = currentAnuncio?.imagens[currentBanner % currentAnuncio.imagens.length];

  return (
    <div className={`absolute left-0 top-0 h-full w-[250px] bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a] text-white p-4 shadow-lg ${className}`}>
      <div className="sticky top-4">
        <div className="text-center mb-6">
          <div className="h-8 overflow-hidden">
            <h2 
              className={`text-2xl font-bold transition-all duration-500 ${
                slideDirection === 'right' 
                  ? 'animate-slide-right' 
                  : 'animate-slide-left'
              }`}
              style={{ color: currentImagem?.cor_frase_menor || '#00ff00' }}
            >
              {currentImagem?.frase_menor || 'ANUNCIE AQUI!'}
            </h2>
          </div>
          <div className="w-20 h-1 bg-[#00ff00] mx-auto mt-2"></div>
        </div>
        
        <div className="space-y-4">
          <div className="relative h-[500px] rounded-lg overflow-hidden flex items-center justify-center">
            {anuncios.map((anuncio, index) => (
              <div
                key={anuncio.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentBanner ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {anuncio.imagens.map((imagem, imgIndex) => (
                  <div
                    key={imgIndex}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      imgIndex === (currentBanner % anuncio.imagens.length) ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <img
                      src={imagem.url}
                      alt={imagem.titulo}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-center">
                      <h3 className="text-lg font-bold" style={{ color: imagem.cor_titulo }}>{imagem.titulo}</h3>
                      <p className="text-sm text-gray-300" style={{ color: imagem.cor_subtitulo }}>{imagem.subtitulo}</p>
                      {imagem.texto_extra && (
                        <p className="text-xs text-gray-400 mt-2">{imagem.texto_extra}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#00ff00] mb-2">QUER DIVULGAR?</h3>
            <button 
              onClick={() => window.open('https://mail.google.com/mail/?view=cm&fs=1&to=anuariodesaude@gmail.com&su=Divulgacao%20Anuario%20da%20Saude')}
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