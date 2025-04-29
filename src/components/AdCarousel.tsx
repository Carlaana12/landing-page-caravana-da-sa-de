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
}

const AdCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    fetchCarouselItems();
  }, []);

  const fetchCarouselItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('carousel_items')
        .select('*')
        .eq('active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error('Error fetching carousel items:', err);
      setError('Failed to load carousel items');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <div className="h-[500px] bg-gray-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <div className="h-[500px] rounded-2xl bg-red-50 flex items-center justify-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <div className="h-[500px] rounded-2xl bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500">No carousel items available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-7xl mx-auto px-4 py-8">
      <div ref={sliderRef} className="keen-slider rounded-2xl overflow-hidden shadow-2xl">
        {items.map((item, idx) => (
          <a
            key={item.id}
            href={item.link}
            className={`keen-slider__slide relative h-[500px] ${
              currentSlide === idx ? 'scale-100' : 'scale-95'
            } transition-all duration-500`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-12">
              <h3 className="text-4xl font-bold text-white mb-4">
                {item.title}
              </h3>
              {item.description && (
                <p className="text-xl text-white/90">
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
            className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={() => instanceRef.current?.next()}
            className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Progress Indicators */}
      {loaded && instanceRef.current && items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === idx
                  ? 'bg-white w-8'
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