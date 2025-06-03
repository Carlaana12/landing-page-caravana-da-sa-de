import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Search, Filter, Calendar, Heart } from 'lucide-react';
import HeroParallax from '@/components/HeroParallax';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

const categories = ['Todos', 'Saúde', 'Bem-estar', 'Medicina', 'Pesquisa', 'Tecnologia'];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_blog')
        .select('*')
        .eq('is_published', true)
        .lte('published_at', new Date().toISOString())
        .order('published_at', { ascending: false });
      if (!error && data) {
        setPosts(data);
      } else {
        setPosts([]);
      }
      setLoading(false);
    }
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'Todos' || (post.category && post.category === selectedCategory);
    const matchesSearch = (post.titulo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.resumo || '').toLowerCase().includes(searchTerm.toLowerCase());
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
      <section className="max-w-7xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="text-center py-12">Carregando artigos...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Nenhum artigo encontrado.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <Link to={`/blog/${post.slug}`}>
                  <img
                    src={post.imagem_url || post.cover_image}
                    alt={post.titulo}
                    className="w-full h-56 object-cover"
                  />
                </Link>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    {/* Se tiver avatar do autor, pode exibir aqui */}
                  </div>
                  <h3 className="text-xl font-bold mb-3 line-clamp-2 hover:text-verde-cia transition-colors">
                    <Link to={`/blog/${post.slug}`}>{post.titulo}</Link>
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.resumo}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {post.published_at ? format(new Date(post.published_at), 'dd MMM yyyy', { locale: ptBR }) : 'Data indisponível'}
                      </span>
                    </div>
                    {/* Se quiser exibir likes, pode colocar aqui */}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Blog;