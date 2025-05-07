import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, MapPin, Clock, Users, Filter, Search } from 'lucide-react';
import HeroParallax from '@/components/HeroParallax';

const categories = ['Todos', 'Congressos', 'Simpósios', 'Workshops', 'Palestras', 'Cursos'];

const events = [
  {
    id: 1,
    title: 'Congresso Internacional de Cardiologia',
    description: 'O maior evento de cardiologia da América Latina, reunindo especialistas mundiais.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800',
    date: '2024-04-15',
    endDate: '2024-04-17',
    location: 'Centro de Convenções, São Paulo',
    category: 'Congressos',
    time: '09:00 - 18:00',
    capacity: 500,
    price: 'R$ 1.200,00'
  },
  {
    id: 2,
    title: 'Workshop de Tecnologia na Saúde',
    description: 'Explorando as inovações tecnológicas no campo da medicina.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800',
    date: '2024-05-05',
    location: 'Centro Médico, Curitiba',
    category: 'Workshops',
    time: '14:00 - 18:00',
    capacity: 100,
    price: 'R$ 400,00'
  },
  // Add more events...
];

const Events = () => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'Todos' || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      <HeroParallax
        title="Eventos e Congressos"
        description="Participe dos principais eventos do setor de saúde"
        image="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=2000"
        typeSequence={[
          'Congressos Médicos',
          2000,
          'Workshops e Palestras',
          2000,
          'Networking Profissional',
          2000
        ]}
      />

      {/* Search and Filters */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 -mt-20 relative z-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-verde-cia focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-verde-cia text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory + searchTerm}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredEvents.map((event) => (
              <motion.article
                key={event.id}
                layout
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-verde-cia text-white px-3 py-1 rounded-full text-sm">
                    {event.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{event.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        {format(new Date(event.date), 'dd MMM yyyy', { locale: ptBR })}
                        {event.endDate && ` - ${format(new Date(event.endDate), 'dd MMM yyyy', { locale: ptBR })}`}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      <span>Capacidade: {event.capacity} pessoas</span>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    <span className="font-semibold text-verde-cia">{event.price}</span>
                    <button className="bg-verde-cia hover:bg-verde-cia-escuro text-white px-4 py-2 rounded-lg transition-colors">
                      Inscrever-se
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 py-12"
          >
            Nenhum evento encontrado com os critérios selecionados.
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Events;