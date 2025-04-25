import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Calendar, Tag, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// Tipo erro da query aninhada
type SelectQueryError = { message: string; details: string; hint: string; code: string };

interface Post {
  id: string;
  title: string;
  content: string;
  published_at: string;
  // Ajustar tipo author
  author?: {
    full_name?: string | null;
  } | SelectQueryError[] | null;
  tags: string[];
}

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  // Usar tipo correto aqui, Post | null
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          content,
          published_at,
          author:profiles(full_name),
          tags
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      // Type assertion para contornar problema
      setPost((data as any) as Post | null);
    } catch (error) {
      console.error('Error fetching post:', error);
      setPost(null); // Garante que post é null em caso de erro
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Post não encontrado</h1>
        <Link
          to="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para o blog
        </Link>
      </div>
    );
  }

  // Helper para obter o nome do autor com segurança
  const getAuthorName = (authorData: Post['author']): string => {
    if (authorData && !Array.isArray(authorData) && authorData.full_name) {
      return authorData.full_name;
    }
    return 'Autor desconhecido';
  };

  return (
    <div>
      <div className="md:w-screen md:relative md:left-1/2 md:right-1/2 md:-ml-[50vw] md:mr-[50vw] md:max-w-none">
        <div className="bg-gray-100 py-12 border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para o blog
            </Link>
            <header>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
              <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4 gap-x-4 gap-y-1">
                <div className="flex items-center">
                   <Calendar className="w-4 h-4 mr-1" />
                   <time dateTime={post.published_at}>
                    {new Date(post.published_at).toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                   </time>
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  <span>{getAuthorName(post.author)}</span>
                </div>
              </div>
              {post.tags && post.tags.length > 0 && (
                 <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        <Tag className="w-4 h-4 mr-1" />
                        {tag}
                      </span>
                    ))}
                 </div>
              )}
            </header>
          </div>
        </div>
      </div>
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
};

export default BlogPost; 