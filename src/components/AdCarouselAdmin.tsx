import { useState, useEffect } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'keen-slider/keen-slider.min.css';

interface AdminCarouselSlide {
  id: string;
  titulo: string;
  descricao: string;
  imagem_url: string;
  link?: string;
  ordem: number;
}

interface AdCarouselAdminProps {
  slides: AdminCarouselSlide[];
}

const AdCarouselAdmin: React.FC<AdCarouselAdminProps> = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      mode: 'snap',
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
        slider.on('created', () => {
          nextTimeout();
        });
        slider.on('dragStarted', clearNextTimeout);
        slider.on('animationEnded', nextTimeout);
        slider.on('updated', nextTimeout);
      },
    ]
  );

  const handleImageError = (imageUrl: string) => {
    setImageErrors((prev) => new Set([...prev, imageUrl]));
  };

  if (!slides || slides.length === 0) {
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
        {slides.map((item, idx) => (
          <a
            key={item.id}
            href={item.link}
            className={`keen-slider__slide relative h-[220px] sm:h-[350px] md:h-[500px] ${
              currentSlide === idx ? 'scale-100' : 'scale-95'
            } transition-all duration-500`}
            target={item.link ? '_blank' : undefined}
            rel="noopener noreferrer"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            {imageErrors.has(item.imagem_url) ? (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500 text-xs sm:text-base">Imagem não disponível</p>
              </div>
            ) : (
              <img
                src={item.imagem_url}
                alt={item.titulo}
                className="w-full h-full object-cover"
                onError={() => handleImageError(item.imagem_url)}
                loading="lazy"
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
              <div className="text-2xl font-bold drop-shadow-lg mb-2">{item.titulo}</div>
              <div className="text-base font-medium drop-shadow-lg max-w-2xl">{item.descricao}</div>
            </div>
          </a>
        ))}
      </div>
      {loaded && (
        <>
          <button
            onClick={() => instanceRef.current?.prev()}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white text-[#3a7bd5] rounded-full p-2 shadow-lg"
            aria-label="Anterior"
            style={{ outline: 'none' }}
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white text-[#3a7bd5] rounded-full p-2 shadow-lg"
            aria-label="Próximo"
            style={{ outline: 'none' }}
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </>
      )}
      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => instanceRef.current?.moveToIdx(idx)}
            className={`w-3 h-3 rounded-full border-2 ${currentSlide === idx ? 'bg-[#3a7bd5] border-[#3a7bd5]' : 'bg-white border-white/70'} transition-all`}
            aria-label={`Ir para slide ${idx + 1}`}
            style={{ outline: 'none' }}
          />
        ))}
      </div>
    </div>
  );
};

export default AdCarouselAdmin; 