import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const news = [
  {
    id: 1,
    title: 'Avanços na Medicina Preventiva',
    excerpt: 'Novos estudos revelam a importância da prevenção na saúde a longo prazo...',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800',
    date: '15 Mar 2024',
    author: 'Dr. João Silva',
    category: 'Medicina',
    readTime: '5 min'
  },
  {
    id: 2,
    title: 'Inteligência Artificial na Saúde',
    excerpt: 'Como a IA está revolucionando diagnósticos e tratamentos médicos...',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800',
    date: '14 Mar 2024',
    author: 'Dra. Maria Santos',
    category: 'Tecnologia',
    readTime: '7 min'
  },
  {
    id: 3,
    title: 'Saúde Mental em Foco',
    excerpt: 'A importância do cuidado psicológico no mundo moderno...',
    image: 'https://images.unsplash.com/photo-1604881991720-f91add269bed?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2F1ZGUlMjBtZW50YWx8ZW58MHx8MHx8fDA%3D=800',
    date: '13 Mar 2024',
    author: 'Dr. Pedro Costa',
    category: 'Saúde Mental',
    readTime: '6 min'
  }
];

const NewsSection = () => {
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
          {news.map((item, index) => (
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
                    {item.date}
                  </span>
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {item.author}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold mb-3 line-clamp-2 hover:text-verde-cia transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {item.excerpt}
                </p>
                
                <div className="flex justify-between items-center">
                  <Link
                    to={`/noticias/${item.id}`}
                    className="text-verde-cia hover:text-verde-cia-escuro font-medium inline-flex items-center group"
                  >
                    Ler mais
                    <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <span className="text-sm text-gray-500">{item.readTime} de leitura</span>
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