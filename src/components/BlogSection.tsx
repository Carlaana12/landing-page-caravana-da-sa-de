import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Calendar, 
  User, 
  ArrowRight, 
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ThumbsUp,
  Send
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data with additional fields
const weeklyArticle = {
  id: '1',
  title: 'Os Avanços da Medicina Moderna no Tratamento do Câncer',
  slug: 'avancos-medicina-moderna-cancer',
  excerpt: 'Novas descobertas e tecnologias estão revolucionando a forma como tratamos o câncer, trazendo esperança para milhões de pacientes em todo o mundo.',
  cover_image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=2000',
  published_at: '2024-04-01T10:00:00Z',
  author: {
    name: 'Dra. Maria Silva',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150',
    specialty: 'Oncologista',
    bio: 'Especialista em oncologia com 15 anos de experiência'
  },
  likes: 245,
  comments: 32,
  shares: 18,
  feature_type: 'weekly',
  start_date: '2024-04-01',
  end_date: null
};

const recentPosts = [
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
      specialty: 'Psiquiatra',
      bio: 'Especialista em saúde mental corporativa'
    },
    likes: 183,
    comments: 24,
    shares: 15
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
      specialty: 'Nutricionista',
      bio: 'Especialista em nutrição esportiva'
    },
    likes: 156,
    comments: 19,
    shares: 12
  }
];

const BlogSection = () => {
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);

  const handleLike = (postId: string) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleSave = (postId: string) => {
    setSavedPosts(prev => 
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle comment submission
    setComment('');
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 shine-text">
            Blog da Saúde
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Artigos e informações escritos por nossos especialistas
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Weekly Article */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 group"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative">
                <img
                  src={weeklyArticle.cover_image}
                  alt={weeklyArticle.title}
                  className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-verde-cia text-white px-4 py-2 rounded-full text-sm font-medium">
                  Artigo da Semana
                </div>
                
                {/* Author Info */}
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={weeklyArticle.author.avatar}
                      alt={weeklyArticle.author.name}
                      className="w-12 h-12 rounded-full border-2 border-white mr-4"
                    />
                    <div>
                      <h4 className="font-medium">{weeklyArticle.author.name}</h4>
                      <p className="text-gray-600 text-sm">{weeklyArticle.author.specialty}</p>
                    </div>
                  </div>

                  <Link
                    to={`/blog/${weeklyArticle.slug}`}
                    className="inline-block"
                  >
                    <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-verde-cia transition-colors">
                      {weeklyArticle.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {weeklyArticle.excerpt}
                  </p>

                  {/* Article Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {format(new Date(weeklyArticle.published_at), 'dd MMM yyyy', { locale: ptBR })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Engagement Section */}
              <div className="p-4 border-t flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => handleLike(weeklyArticle.id)}
                    className={`flex items-center space-x-2 ${
                      likedPosts.includes(weeklyArticle.id) ? 'text-red-500' : 'text-gray-600'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${
                      likedPosts.includes(weeklyArticle.id) ? 'fill-current' : ''
                    }`} />
                    <span>{weeklyArticle.likes}</span>
                  </button>
                  <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center space-x-2 text-gray-600"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>{weeklyArticle.comments}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600">
                    <Share2 className="w-5 h-5" />
                    <span>{weeklyArticle.shares}</span>
                  </button>
                </div>
                <button
                  onClick={() => handleSave(weeklyArticle.id)}
                  className={`${
                    savedPosts.includes(weeklyArticle.id) ? 'text-verde-cia' : 'text-gray-600'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${
                    savedPosts.includes(weeklyArticle.id) ? 'fill-current' : ''
                  }`} />
                </button>
              </div>

              {/* Comments Section */}
              {showComments && (
                <div className="p-4 border-t">
                  <form onSubmit={handleComment} className="flex space-x-2">
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Adicione um comentário..."
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-verde-cia focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-verde-cia text-white rounded-lg hover:bg-verde-cia-escuro transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Posts */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6">Artigos Recentes</h3>
              <div className="space-y-6">
                <AnimatePresence>
                  {recentPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <Link to={`/blog/${post.slug}`} className="block">
                        <div className="flex items-start space-x-4">
                          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={post.cover_image}
                              alt={post.title}
                              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <div className="flex items-center mb-2">
                              <img
                                src={post.author.avatar}
                                alt={post.author.name}
                                className="w-6 h-6 rounded-full mr-2"
                              />
                              <span className="text-sm text-gray-600">{post.author.name}</span>
                            </div>
                            <h4 className="font-semibold text-gray-800 group-hover:text-verde-cia transition-colors line-clamp-2">
                              {post.title}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {format(new Date(post.published_at), 'dd MMM yyyy', { locale: ptBR })}
                              </div>
                              <div className="flex items-center">
                                <Heart className="w-4 h-4 mr-1" />
                                <span>{post.likes}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                      {index < recentPosts.length - 1 && (
                        <div className="border-b my-4" />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <Link
                to="/blog"
                className="inline-flex items-center text-verde-cia hover:text-verde-cia-escuro mt-6 transition-colors group"
              >
                <span>Ver todos os artigos</span>
                <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;