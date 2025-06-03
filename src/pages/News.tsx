import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

const News = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_news')
        .select('*')
        .eq('is_published', true)
        .lte('published_at', new Date().toISOString())
        .order('published_at', { ascending: false });
      if (!error && data) {
        const transformed = data.map(item => ({
          ...item,
          slug: item.slug || item.link || item.id
        }));
        setNews(transformed);
      } else {
        setNews([]);
      }
      setLoading(false);
    }
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-10 text-center">Notícias</h1>
        {loading ? (
          <div className="text-center py-12">Carregando notícias...</div>
        ) : news.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Nenhuma notícia encontrada.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              (() => { console.log('Notícia:', item); return null; })(),
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={item.imagem_url || item.cover_image}
                  alt={item.titulo}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 line-clamp-2 hover:text-verde-cia transition-colors">
                    {item.titulo}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{item.resumo}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {item.published_at ? format(new Date(item.published_at), 'dd MMM yyyy', { locale: ptBR }) : 'Data indisponível'}
                  </div>
                  <Link
                    to={`/noticias/${item.slug}`}
                    className="text-verde-cia hover:text-verde-cia-escuro font-medium flex items-center transition-colors mt-2"
                  >
                    Ler mais ({item.slug})
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                  <pre style={{ fontSize: 10, color: 'red' }}>{JSON.stringify(item, null, 2)}</pre>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;