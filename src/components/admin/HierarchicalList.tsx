'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, File, Plus, Edit, Trash2 } from 'lucide-react';
import { HierarchicalItemWithChildren } from '@/lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface HierarchicalListProps {
  items: HierarchicalItemWithChildren[];
  onAdd: (parentId: string | null) => void;
  onEdit: (item: HierarchicalItemWithChildren) => void;
  onDelete: (item: HierarchicalItemWithChildren) => void;
  type: 'page' | 'category' | 'section';
}

export default function HierarchicalList({
  items,
  onAdd,
  onEdit,
  onDelete,
  type
}: HierarchicalListProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const renderItem = (item: HierarchicalItemWithChildren, level: number = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children.length > 0;
    const Icon = type === 'page' ? File : Folder;

    return (
      <div key={item.id}>
        <div
          className="flex items-center py-2 px-4 hover:bg-gray-50"
          style={{ paddingLeft: `${level * 1.5}rem` }}
        >
          {hasChildren && (
            <button
              onClick={() => toggleExpand(item.id)}
              className="mr-2 text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          {!hasChildren && <div className="w-6" />}
          
          <Icon className="mr-2 text-gray-500" size={16} />
          <span className="flex-1">{item.name}</span>
          
          <div className="flex items-center space-x-2 text-gray-500">
            <span className="text-sm">
              {format(new Date(item.updated_at), 'dd/MM/yyyy', { locale: ptBR })}
            </span>
            <button
              onClick={() => onAdd(item.id)}
              className="p-1 hover:text-blue-600"
              title="Adicionar filho"
            >
              <Plus size={16} />
            </button>
            <button
              onClick={() => onEdit(item)}
              className="p-1 hover:text-yellow-600"
              title="Editar"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete(item)}
              className="p-1 hover:text-red-600"
              title="Excluir"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div>
            {item.children.map(child => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between">
        <h3 className="font-medium text-gray-700">
          {type === 'page' ? 'Páginas' : type === 'category' ? 'Categorias' : 'Seções'}
        </h3>
        <button
          onClick={() => onAdd(null)}
          className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
        >
          <Plus size={16} />
          <span>Adicionar {type === 'page' ? 'Página' : type === 'category' ? 'Categoria' : 'Seção'}</span>
        </button>
      </div>
      <div className="divide-y">
        {items.map(item => renderItem(item))}
      </div>
    </div>
  );
} 