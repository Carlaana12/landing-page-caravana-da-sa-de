import { useState, useEffect } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import 'keen-slider/keen-slider.min.css';

interface CarouselItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  link?: string;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

const AdCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      mode: "snap",
      slides: {
        perView: 1,
        spacing: 0,
      },
      initial: 0,
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
      created() {
        setLoaded(true);
      },
      defaultAnimation: {
        duration: 1000,
      },
    },
    [
      (slider) => {
        let timeout: ReturnType<typeof setTimeout>;
        
        function clearNextTimeout() {
          clearTimeout(timeout);
        }

        function nextTimeout() {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            slider.next();
          }, 5000);
        }

        slider.on("created", () => {
          nextTimeout();
        });

        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

  useEffect(() => {
    console.log('Iniciando componente AdCarousel');
    fetchCarouselItems();
  }, []);

  const fetchCarouselItems = async () => {
    try {
      setLoading(true);
      console.log('Iniciando busca dos itens do carrossel...');
      
      const { data, error } = await supabase
        .from('carousel_items')
        .select('*')
        .eq('active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Erro ao buscar itens do carrossel:', error);
        throw error;
      }

      console.log('Itens do carrossel carregados:', data);
      
      if (!data || data.length === 0) {
        console.warn('Nenhum item do carrossel encontrado');
        // Adicionar dados de exemplo para teste
        const sampleData: CarouselItem[] = [
          {
            id: '1',
            title: 'Cuidando da Sua Saúde',
            description: 'Encontre os melhores profissionais de saúde para cuidar de você e sua família',
            image_url: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=2000&q=80',
            display_order: 1,
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Especialistas Qualificados',
            description: 'Uma rede completa de médicos e especialistas à sua disposição',
            image_url: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=2000&q=80',
            display_order: 2,
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '3',
            title: 'Tecnologia e Saúde',
            description: 'Utilizando o que há de mais moderno para seu atendimento',
            image_url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=2000&q=80',
            display_order: 3,
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        setItems(sampleData);
        return;
      }

      setItems(data);
    } catch (err) {
      console.error('Erro ao carregar itens do carrossel:', err);
      setError('Falha ao carregar itens do carrossel');
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (imageUrl: string) => {
    console.error(`Erro ao carregar imagem: ${imageUrl}`);
    setImageErrors(prev => new Set([...prev, imageUrl]));
  };

  const handleImageLoad = (imageUrl: string) => {
    console.log(`Imagem carregada com sucesso: ${imageUrl}`);
  };

  if (loading) {
    return (
      <div className="relative max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="h-[220px] sm:h-[350px] md:h-[500px] bg-gray-200 rounded-xl sm:rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="h-[220px] sm:h-[350px] md:h-[500px] rounded-xl sm:rounded-2xl bg-red-50 flex items-center justify-center">
          <p className="text-red-600 text-sm sm:text-base">{error}</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="relative max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="h-[220px] sm:h-[350px] md:h-[500px] rounded-xl sm:rounded-2xl bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500 text-sm sm:text-base">Nenhum item disponível no carrossel</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div ref={sliderRef} className="keen-slider rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl h-[220px] sm:h-[350px] md:h-[500px]">
        {items.map((item, idx) => (
          <a
            key={item.id}
            href={item.link}
            className={`keen-slider__slide relative h-[220px] sm:h-[350px] md:h-[500px] ${
              currentSlide === idx ? 'scale-100' : 'scale-95'
            } transition-all duration-500`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            {imageErrors.has(item.image_url) ? (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500 text-xs sm:text-base">Imagem não disponível</p>
              </div>
            ) : (
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={() => handleImageError(item.image_url)}
                onLoad={() => handleImageLoad(item.image_url)}
                loading="lazy"
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 md:p-12">
              <h3 className="text-lg sm:text-2xl md:text-4xl font-bold text-white mb-2 sm:mb-4">
                {item.title}
              </h3>
              {item.description && (
                <p className="text-xs sm:text-lg md:text-xl text-white/90">
                  {item.description}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>

      {/* Navigation Arrows */}
      {loaded && instanceRef.current && items.length > 1 && (
        <>
          <button
            onClick={() => instanceRef.current?.prev()}
            className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </button>

          <button
            onClick={() => instanceRef.current?.next()}
            className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </button>
        </>
      )}

      {/* Progress Indicators */}
      {loaded && instanceRef.current && items.length > 1 && (
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                currentSlide === idx
                  ? 'bg-white w-6 sm:w-8'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdCarousel;