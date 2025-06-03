import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      setError(null);
      // Buscar pelo slug (ou id, se preferir)
      const { data, error } = await supabase
        .from('admin_blog')
        .select('*')
        .eq('slug', slug)
        .single();
      if (error || !data) {
        setError('Artigo não encontrado.');
        setPost(null);
      } else {
        setPost(data);
      }
      setLoading(false);
    }
    if (slug) fetchPost();
  }, [slug]);

  if (loading) {
    return <div className="max-w-3xl mx-auto py-16 text-center">Carregando artigo...</div>;
  }
  if (error) {
    return <div className="max-w-3xl mx-auto py-16 text-center text-red-500">{error}</div>;
  }
  if (!post) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <Link to="/blog" className="inline-flex items-center text-verde-cia hover:text-verde-cia-escuro mb-8">
        <ArrowLeft className="w-5 h-5 mr-2" /> Voltar para o Blog
      </Link>
      <img src={post.imagem_url || post.cover_image} alt={post.titulo} className="w-full rounded-xl mb-6" />
      <h1 className="text-3xl font-bold mb-4">{post.titulo}</h1>
      <div className="flex items-center text-sm text-gray-500 mb-6 space-x-4">
        <span className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          {post.published_at ? format(new Date(post.published_at), 'dd MMM yyyy', { locale: ptBR }) : 'Data indisponível'}
        </span>
        <span className="flex items-center">
          <User className="w-4 h-4 mr-1" />
          {post.autor || 'Autor desconhecido'}
        </span>
      </div>
      <div className="prose prose-lg max-w-none mb-8" dangerouslySetInnerHTML={{ __html: post.conteudo || post.resumo || '' }} />
    </div>
  );
};

export default BlogPost; 