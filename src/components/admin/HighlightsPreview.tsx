import React from 'react';
import * as LucideIcons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Highlight {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  value?: string;
}

interface HighlightsPreviewProps {
  highlights: Highlight[];
  onClose: () => void;
}

const HighlightsPreview: React.FC<HighlightsPreviewProps> = ({ highlights, onClose }) => {
  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Star;
    return <IconComponent className="w-8 h-8" />;
  };

  // Get title and description based on category
  const getTitle = (category: string) => {
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

  const getDescription = (category: string) => {
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

  // Get category from first highlight (they should all be the same category)
  const category = highlights[0]?.category || 'home';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Preview dos Destaques</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <LucideIcons.X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{getTitle(category)}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {getDescription(category)}
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
        </div>
      </div>
    </div>
  );
};

export default HighlightsPreview;