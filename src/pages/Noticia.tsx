import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Noticia: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [noticia, setNoticia] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNoticia() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('admin_news')
        .select('*')
        .eq('slug', slug)
        .single();
      if (error || !data) {
        setError('Notícia não encontrada.');
        setNoticia(null);
      } else {
        setNoticia(data);
      }
      setLoading(false);
    }
    if (slug) fetchNoticia();
  }, [slug]);

  if (loading) {
    return <div className="max-w-3xl mx-auto py-16 text-center">Carregando notícia...</div>;
  }
  if (error) {
    return <div className="max-w-3xl mx-auto py-16 text-center text-red-500">{error}</div>;
  }
  if (!noticia) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <Link to="/noticias" className="inline-flex items-center text-verde-cia hover:text-verde-cia-escuro mb-8">
        <ArrowLeft className="w-5 h-5 mr-2" /> Voltar para Notícias
      </Link>
      <img src={noticia.imagem_url || noticia.cover_image} alt={noticia.titulo} className="w-full rounded-xl mb-6" />
      <h1 className="text-3xl font-bold mb-4">{noticia.titulo}</h1>
      <div className="flex items-center text-sm text-gray-500 mb-6 space-x-4">
        <span className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          {noticia.published_at ? format(new Date(noticia.published_at), 'dd MMM yyyy', { locale: ptBR }) : 'Data indisponível'}
        </span>
        {noticia.autor && (
          <span className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            {noticia.autor}
          </span>
        )}
      </div>
      <div className="prose prose-lg max-w-none mb-8" dangerouslySetInnerHTML={{ __html: noticia.conteudo || noticia.resumo || '' }} />
    </div>
  );
};

export default Noticia; 