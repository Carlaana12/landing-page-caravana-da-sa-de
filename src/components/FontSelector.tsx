import React from 'react';
import { Search } from 'lucide-react';
import FontPreview from './FontPreview';

interface FontSelectorProps {
  fonts: string[];
  selectedFont: string;
  onChange: (font: string) => void;
  category: string;
  previewText?: string;
}

const FontSelector: React.FC<FontSelectorProps> = ({
  fonts,
  selectedFont,
  onChange,
  category,
  previewText = 'O ágil cachorro marrom pula sobre o preguiçoso cão.'
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);

  const filteredFonts = fonts.filter(font =>
    font.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border rounded-lg cursor-pointer flex justify-between items-center bg-white"
      >
        <span style={{ fontFamily: selectedFont }}>{selectedFont}</span>
        <span className="text-gray-400">▼</span>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar fonte..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-md text-sm"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto p-2">
            {filteredFonts.map((font) => (
              <div
                key={font}
                onClick={() => {
                  onChange(font);
                  setIsOpen(false);
                }}
                className="mb-2"
              >
                <FontPreview
                  font={font}
                  text={previewText}
                  className={`cursor-pointer ${
                    selectedFont === font ? 'ring-2 ring-verde-cia' : ''
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FontSelector;