import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const NewsSection: React.FC = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_news')
        .select('*')
        .order('ordem', { ascending: true });
      if (!error && data) {
        const transformed = data.map(item => ({
          ...item,
          slug: item.slug || item.link || item.id
        }));
        setNews(transformed);
      }
      setLoading(false);
    }
    fetchNews();
  }, []);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4 shine-text">Últimas Notícias</h2>
            <p className="text-white">Fique por dentro das novidades da área da saúde</p>
          </div>
          <Link
            to="/noticias"
            className="flex items-center text-verde-cia hover:text-verde-cia-escuro transition-colors group"
          >
            <span>Ver todas</span>
            <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {news.slice(0, 3).map((item: any, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.imagem_url}
                  alt={item.titulo}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-verde-cia text-white px-3 py-1 rounded-full text-sm">
                  {item.categoria}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {item.data}
                  </span>
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {item.autor}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold mb-3 line-clamp-2 hover:text-verde-cia transition-colors">
                  {item.titulo}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {item.resumo}
                </p>
                
                <div className="flex justify-between items-center">
                  <Link
                    to={item.slug ? `/noticias/${item.slug}` : '#'}
                    className="text-verde-cia hover:text-verde-cia-escuro font-medium inline-flex items-center group"
                  >
                    Ler mais
                    <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <span className="text-sm text-gray-500">{item.tempo_leitura} de leitura</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;