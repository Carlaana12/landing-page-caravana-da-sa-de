import React from 'react';
import { Edit2, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface CardCarrosselProps {
  id: string;
  title: string;
  description: string;
  image_url: string;
  active: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

const CardCarrossel: React.FC<CardCarrosselProps> = ({
  title,
  description,
  image_url,
  active,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="relative aspect-video sm:aspect-auto">
        <img
          src={image_url}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              active
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {active ? 'Ativo' : 'Inativo'}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="p-2 text-gray-600 hover:text-verde-cia transition-colors"
              title="Editar"
              aria-label="Editar"
            >
              <Edit2 className="h-5 w-5" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-600 hover:text-red-500 transition-colors"
              title="Excluir"
              aria-label="Excluir"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onMoveUp}
              disabled={!canMoveUp}
              className={`p-2 ${
                canMoveUp
                  ? 'text-gray-600 hover:text-verde-cia'
                  : 'text-gray-300 cursor-not-allowed opacity-50'
              } transition-colors`}
              title="Mover para cima"
              aria-label="Mover para cima"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
            <button
              onClick={onMoveDown}
              disabled={!canMoveDown}
              className={`p-2 ${
                canMoveDown
                  ? 'text-gray-600 hover:text-verde-cia'
                  : 'text-gray-300 cursor-not-allowed opacity-50'
              } transition-colors`}
              title="Mover para baixo"
              aria-label="Mover para baixo"
            >
              <ArrowDown className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

CardCarrossel.defaultProps = {
  onEdit: () => {},
  onDelete: () => {},
  onMoveUp: () => {},
  onMoveDown: () => {},
};

export default CardCarrossel;
