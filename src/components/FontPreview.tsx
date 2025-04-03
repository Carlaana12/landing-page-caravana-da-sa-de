import React from 'react';

interface FontPreviewProps {
  font: string;
  text: string;
  size?: string;
  lineHeight?: string;
  className?: string;
}

const FontPreview: React.FC<FontPreviewProps> = ({
  font,
  text,
  size,
  lineHeight,
  className = ''
}) => {
  return (
    <div 
      className={`p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow ${className}`}
      style={{ 
        fontFamily: font,
        fontSize: size,
        lineHeight: lineHeight
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">{font}</span>
        <span className="text-xs text-gray-400">
          {size && `${size} / `}
          {lineHeight && `${lineHeight}`}
        </span>
      </div>
      <div className="border-t pt-2">
        <h3 className="text-xl mb-2">Aa Bb Cc Dd Ee</h3>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default FontPreview;