import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Search, Filter, Calendar, Heart } from 'lucide-react';
import HeroParallax from '@/components/HeroParallax';

const categories = ['Todos', 'Saúde', 'Bem-estar', 'Medicina', 'Pesquisa', 'Tecnologia'];

const posts = [
  {
    id: '1',
    title: 'Os Avanços da Medicina Moderna no Tratamento do Câncer',
    slug: 'avancos-medicina-moderna-cancer',
    excerpt: 'Novas descobertas e tecnologias estão revolucionando a forma como tratamos o câncer, trazendo esperança para milhões de pacientes em todo o mundo.',
    cover_image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=2000',
    published_at: '2024-04-01T10:00:00Z',
    author: {
      name: 'Dra. Maria Silva',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150',
      specialty: 'Oncologista'
    },
    category: 'Medicina',
    likes: 245
  },
  {
    id: '2',
    title: 'Importância da Saúde Mental no Ambiente de Trabalho',
    slug: 'saude-mental-trabalho',
    excerpt: 'Como cuidar da saúde mental pode melhorar a produtividade e qualidade de vida.',
    cover_image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=500',
    published_at: '2024-03-30T15:00:00Z',
    author: {
      name: 'Dr. João Santos',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=150',
      specialty: 'Psiquiatra'
    },
    category: 'Saúde',
    likes: 183
  },
  {
    id: '3',
    title: 'Nutrição e Exercícios: A Combinação Perfeita',
    slug: 'nutricao-exercicios',
    excerpt: 'Descubra como alinhar sua alimentação com seus objetivos fitness.',
    cover_image: 'https://images.unsplash.com/photo-1574689096264-2adf441c3f14?auto=format&fit=crop&w=500',
    published_at: '2024-03-28T09:00:00Z',
    author: {
      name: 'Dra. Ana Costa',
      avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=150',
      specialty: 'Nutricionista'
    },
    category: 'Bem-estar',
    likes: 156
  }
];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'Todos' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroParallax
        title="Blog da Saúde"
        description="Artigos e informações escritos por nossos especialistas"
        image="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=2000"
        typeSequence={[
          'Saúde e Bem-estar',
          2000,
          'Medicina e Tecnologia',
          2000,
          'Pesquisas e Avanços',
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
                placeholder="Buscar artigos..."
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

      {/* Posts Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48">
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-verde-cia text-white px-3 py-1 rounded-full text-sm">
                  {post.category}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-medium">{post.author.name}</h4>
                    <p className="text-sm text-gray-600">{post.author.specialty}</p>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3 line-clamp-2 hover:text-verde-cia transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {format(new Date(post.published_at), 'dd MMM yyyy', { locale: ptBR })}
                    </span>
                  </div>
                  <span className="flex items-center">
                    <Heart className="w-4 h-4 mr-1" />
                    {post.likes}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Blog;