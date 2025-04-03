import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Search, Calendar, User, Tag, ArrowRight } from 'lucide-react';
import HeroParallax from '@/components/HeroParallax';

const categories = ['Todas', 'Medicina', 'Pesquisa', 'Tecnologia', 'Saúde Pública', 'Bem-estar'];

const news = [
  {
    id: 1,
    title: 'Avanços na Medicina Preventiva',
    excerpt: 'Novos estudos revelam a importância da prevenção na saúde a longo prazo...',
    content: 'Conteúdo completo da notícia...',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800',
    date: '2024-03-15',
    author: 'Dr. João Silva',
    category: 'Medicina',
    readTime: '5 min'
  },
  {
    id: 2,
    title: 'Inteligência Artificial na Saúde',
    excerpt: 'Como a IA está revolucionando diagnósticos e tratamentos médicos...',
    content: 'Conteúdo completo da notícia...',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800',
    date: '2024-03-14',
    author: 'Dra. Maria Santos',
    category: 'Tecnologia',
    readTime: '7 min'
  },
  // Add more news items...
];

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNews = news.filter(item => {
    const matchesCategory = selectedCategory === 'Todas' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroParallax
        title="Notícias e Atualizações"
        description="Fique por dentro das últimas novidades do mundo da saúde"
        image="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=2000"
        typeSequence={[
          'Últimas Notícias',
          2000,
          'Avanços Médicos',
          2000,
          'Pesquisas Inovadoras',
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
                placeholder="Buscar notícias..."
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

      {/* News Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory + searchTerm}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredNews.map((item) => (
              <motion.article
                key={item.id}
                layout
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-verde-cia text-white px-3 py-1 rounded-full text-sm">
                    {item.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {format(new Date(item.date), 'dd MMM yyyy', { locale: ptBR })}
                    </span>
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {item.author}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 line-clamp-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{item.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <button className="text-verde-cia hover:text-verde-cia-escuro font-medium flex items-center transition-colors">
                      Ler mais
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-500">{item.readTime} de leitura</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredNews.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 py-12"
          >
            Nenhuma notícia encontrada com os critérios selecionados.
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default News;