import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Loader } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Highlight {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  display_order: number;
  active: boolean;
  category: string;
  type: string;
  value?: string;
}

interface HighlightsProps {
  category: string;
  title?: string;
  description?: string;
}

const Highlights: React.FC<HighlightsProps> = ({ 
  category,
  title,
  description
}) => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const fetchHighlights = useCallback(async () => {
    try {
      console.log('Fetching highlights for category:', category);
      
      const { data, error } = await supabase
        .from('highlights')
        .select('*')
        .eq('active', true)
        .eq('category', category)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Fetched highlights:', data);
      setHighlights(data || []);
      setError(null);
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error('Error fetching highlights:', error);
      setError('Failed to load highlights');
      
      // Retry logic
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying... Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          fetchHighlights();
        }, Math.pow(2, retryCount) * 1000); // Exponential backoff
      }
    } finally {
      setLoading(false);
    }
  }, [category, retryCount]);

  useEffect(() => {
    fetchHighlights();
  }, [category, fetchHighlights]);

  useEffect(() => {
    // Subscribe to realtime changes
    const channel = supabase
      .channel(`highlights_${category}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'highlights',
          filter: `category=eq.${category}`
        },
        async (payload) => {
          // Handle different types of changes
          switch (payload.eventType) {
            case 'INSERT':
              if (payload.new.active) {
                setHighlights(current => 
                  [...current, payload.new as Highlight]
                    .sort((a, b) => a.display_order - b.display_order)
                );
              }
              break;

            case 'DELETE':
              setHighlights(current => 
                current.filter(h => h.id !== payload.old.id)
              );
              break;

            case 'UPDATE':
              const newHighlight = payload.new as Highlight;
              setHighlights(current => {
                // If highlight was deactivated, remove it
                if (!newHighlight.active) {
                  return current.filter(h => h.id !== newHighlight.id);
                }
                
                // If highlight was activated or updated, update it
                const exists = current.some(h => h.id === newHighlight.id);
                if (exists) {
                  return current
                    .map(h => h.id === newHighlight.id ? newHighlight : h)
                    .sort((a, b) => a.display_order - b.display_order);
                } else {
                  return [...current, newHighlight]
                    .sort((a, b) => a.display_order - b.display_order);
                }
              });
              break;
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [category]);

  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Star;
    return <IconComponent className="w-8 h-8" />;
  };

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <Loader className="w-8 h-8 animate-spin text-verde-cia" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center text-red-600">
        {error}
        {retryCount < MAX_RETRIES && (
          <p className="text-sm mt-2">Tentando novamente...</p>
        )}
      </div>
    );
  }

  if (highlights.length === 0) {
    return null;
  }

  // Get title and description based on category if not provided
  const getTitle = () => {
    if (title) return title;
    
    switch (category) {
      case 'home':
        return 'Nosso Impacto';
      case 'about':
        return 'Nossa História em Números';
      case 'specialties':
        return 'Nossas Especialidades';
      case 'diseases':
        return 'Principais Condições';
      case 'utilities':
        return 'Contatos de Emergência';
      default:
        return 'Destaques';
    }
  };

  const getDescription = () => {
    if (description) return description;
    
    switch (category) {
      case 'home':
        return 'Fazendo a diferença em nossa comunidade através de dedicação, inovação e colaboração.';
      case 'about':
        return 'Conheça nossos números e o impacto que causamos na saúde da comunidade.';
      case 'specialties':
        return 'Oferecemos atendimento especializado em diversas áreas da medicina.';
      case 'diseases':
        return 'Tratamos as principais condições médicas com excelência e cuidado.';
      case 'utilities':
        return 'Tenha em mãos os principais contatos de emergência.';
      default:
        return '';
    }
  };

  return (
    <div className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{getTitle()}</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {getDescription()}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {highlights.map((highlight) => (
            <motion.div
              key={highlight.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div 
                className="mb-4 flex justify-center"
                style={{ color: highlight.color }}
              >
                {renderIcon(highlight.icon)}
              </div>
              <div className="text-xl font-bold text-gray-900 mb-2">
                {highlight.title}
                {highlight.value && (
                  <span className="ml-2 text-verde-cia">{highlight.value}</span>
                )}
              </div>
              <div className="text-gray-600">{highlight.description}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Highlights;