import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';

const events = [
  {
    id: 1,
    title: "Congresso Internacional de Cardiologia",
    date: "15-17 Abril, 2024",
    location: "Centro de Convenções, São Paulo",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800",
    description: "O maior evento de cardiologia da América Latina, reunindo especialistas mundiais."
  },
  {
    id: 2,
    title: "Simpósio de Medicina Preventiva",
    date: "22-23 Abril, 2024",
    location: "Hotel Grand Hyatt, Rio de Janeiro",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800",
    description: "Discussões sobre as últimas tendências em prevenção de doenças."
  },
  {
    id: 3,
    title: "Workshop de Tecnologia na Saúde",
    date: "5 Maio, 2024",
    location: "Centro Médico, Curitiba",
    image: "https://images.unsplash.com/photo-1576091160291-31957ab2724f?auto=format&fit=crop&w=800",
    description: "Explorando as inovações tecnológicas no campo da medicina."
  }
];

const EventsPreview = () => {
  const [activeEvent, setActiveEvent] = useState(0);
  const timerRef = useRef<number>();

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setActiveEvent((prev) => (prev + 1) % events.length);
    }, 5000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <section className="py-16 bg-gradient-to-br from-verde-cia/10 to-white rounded-xl shadow-md my-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 shine-text">
            Próximos Eventos
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fique por dentro dos principais eventos da área da saúde
          </p>
        </div>

        <div className="relative overflow-hidden rounded-xl shadow-lg">
          {events.map((event, index) => (
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
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-verde-cia transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-white/90 mb-4">{event.description}</p>
                    <div className="flex flex-wrap gap-4 mb-6">
                      <div className="flex items-center text-white/80">
                        <Calendar className="h-5 w-5 mr-2" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-white/80">
                        <MapPin className="h-5 w-5 mr-2" />
                        {event.location}
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
          ))}
        </div>

        <div className="flex justify-center space-x-2 mt-4">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveEvent(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === activeEvent
                  ? 'bg-verde-cia w-6'
                  : 'bg-verde-cia/20 hover:bg-verde-cia/30'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsPreview;