import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';

const events = [
  {
    id: 1,
    title: "Congresso Internacional de Cardiologia",
    date: "15-17 Abril, 2024",
    location: "Centro de Convenções, São Paulo",
    image: "https://images.unsplash.com/photo-1690306816872-91063f6de36b?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=800",
    description: "O maior evento de cardiologia da América Latina, reunindo especialistas mundiais."
  },
  {
    id: 2,
    title: "Simpósio de Medicina Preventiva",
    date: "22-23 Abril, 2024",
    location: "Hotel Grand Hyatt, Rio de Janeiro",
    image: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=800",
    description: "Discussões sobre as últimas tendências em prevenção de doenças."
  },
  {
    id: 3,
    title: "Workshop de Tecnologia na Saúde",
    date: "5 Maio, 2024",
    location: "Centro Médico, Curitiba",
    image: "https://images.unsplash.com/photo-1644088379091-d574269d422f?q=80&w=1093&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=80",
    description: "Explorando as inovações tecnológicas no campo da medicina."
  },
  {
    id: 4,
    title: "Conferência de Saúde Mental",
    date: "12-13 Maio, 2024",
    location: "Centro de Eventos, Porto Alegre",
    image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=800&q=80",
    description: "Um encontro dedicado à discussão de temas relevantes sobre saúde mental e bem-estar."
  }
];

interface EventsPreviewProps {
  events?: any[];
}

const EventsPreview: React.FC<EventsPreviewProps> = ({ events }) => {
  const eventsToShow = events || events;
  const [activeEvent, setActiveEvent] = useState(0);
  const timerRef = useRef<number>();
  const [loading, setLoading] = useState(true);
  const [eventsData, setEvents] = useState<any[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_events')
        .select('*')
        .order('ordem', { ascending: true });
      if (!error && data) setEvents(data);
      setLoading(false);
    }
    fetchEvents();
  }, []);

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      const total = (eventsData || []).length;
      setActiveEvent((prev) => total > 0 ? (prev + 1) % total : 0);
    }, 5000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <section className="py-16 rounded-xl shadow-md my-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 shine-text">
            Próximos Eventos
          </h2>
          <p className="text-white max-w-2xl mx-auto">
            Fique por dentro dos principais eventos da área da saúde
          </p>
        </div>

        <div className="relative overflow-hidden rounded-xl shadow-lg">
          {loading ? (
            <div>Loading events...</div>
          ) : (
            (eventsData || []).map((event: any, index: number) => (
              <div
                key={event.id}
                className={`transition-all duration-500 ${
                  index === activeEvent
                    ? 'opacity-100 transform translate-x-0'
                    : 'opacity-0 absolute inset-0 transform translate-x-full'
                }`}
                onMouseEnter={() => setActiveEvent(index)}
              >
                <div className="relative h-[400px] group">
                  <img
                    src={event.imagem_url}
                    alt={event.titulo}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-verde-cia transition-colors">
                        {event.titulo}
                      </h3>
                      <p className="text-white/90 mb-4">{event.descricao}</p>
                      <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex items-center text-white/80">
                          <Calendar className="h-5 w-5 mr-2" />
                          {event.data}
                        </div>
                        <div className="flex items-center text-white/80">
                          <MapPin className="h-5 w-5 mr-2" />
                          {event.local}
                        </div>
                      </div>
                      <Link
                        to="/eventos"
                        className="inline-block bg-verde-cia text-white px-6 py-2 rounded-full hover:bg-verde-cia-escuro transition-all transform hover:scale-105"
                      >
                        Saiba mais
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-center space-x-2 mt-4">
          {(eventsData || []).map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => setActiveEvent(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === activeEvent
                  ? 'bg-white w-6'
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsPreview;