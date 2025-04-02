import React from 'react';
import { X } from 'lucide-react';
import { useThemeStore } from '../../lib/theme';

interface PagePreviewProps {
  title: string;
  content: string;
  onClose: () => void;
  isFullscreen?: boolean;
}

const PagePreview: React.FC<PagePreviewProps> = ({ title, content, onClose, isFullscreen }) => {
  const { colors, typography, spacing } = useThemeStore();

  return (
    <div 
      className={`${isFullscreen ? 'fixed inset-0 z-50' : 'h-full'} bg-gray-100 flex flex-col overflow-hidden`}
      style={{
        '--color-primary': colors.primary,
        '--color-secondary': colors.secondary,
        '--color-accent': colors.accent,
        '--color-text': colors.text,
        '--color-background': colors.background,
        '--font-heading': typography.headingFont,
        '--font-body': typography.bodyFont,
        '--font-size': typography.baseFontSize,
        '--line-height': typography.lineHeight,
        '--container-padding': spacing.containerPadding,
        '--section-spacing': spacing.sectionSpacing,
      } as React.CSSProperties}
    >
      {/* Preview Header */}
      <div className="bg-verde-cia text-white py-4 px-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Anuário de Saúde</h1>
          <div className="text-sm opacity-75">Visualizando: {title}</div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-verde-cia-escuro rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto">
        <main className="max-w-7xl mx-auto px-4 py-8">
          <article className="bg-white rounded-lg shadow-lg p-8">
            <div 
              className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </article>
        </main>
      </div>

      {/* Preview Footer */}
      <footer className="bg-verde-cia-escuro text-white py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm">© {new Date().getFullYear()} Anuário de Saúde. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default PagePreview;