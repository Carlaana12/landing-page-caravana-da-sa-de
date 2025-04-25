import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Loader2 } from 'lucide-react';
import CardCarrossel from '@/components/CardCarrossel';
import { toast } from 'react-hot-toast';

interface CarouselItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  active: boolean;
  order: number;
}

const CarouselManager: React.FC = () => {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<CarouselItem | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('carousel')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      toast.error('Erro ao carregar itens do carrossel');
      console.error('Error fetching carousel items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;

    try {
      await Promise.all([
        supabase
          .from('carousel')
          .update({ order: index })
          .eq('id', newItems[index].id),
        supabase
          .from('carousel')
          .update({ order: index - 1 })
          .eq('id', newItems[index - 1].id)
      ]);

      setItems(newItems);
      toast.success('Ordem atualizada com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar ordem');
      console.error('Error updating order:', error);
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === items.length - 1) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;

    try {
      await Promise.all([
        supabase
          .from('carousel')
          .update({ order: index })
          .eq('id', newItems[index].id),
        supabase
          .from('carousel')
          .update({ order: index + 1 })
          .eq('id', newItems[index + 1].id)
      ]);

      setItems(newItems);
      toast.success('Ordem atualizada com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar ordem');
      console.error('Error updating order:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este item?')) return;

    try {
      const { error } = await supabase
        .from('carousel')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setItems(items.filter(item => item.id !== id));
      toast.success('Item excluído com sucesso');
    } catch (error) {
      toast.error('Erro ao excluir item');
      console.error('Error deleting item:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciar Carrossel</h1>
        <button
          onClick={() => {
            setEditingItem(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-verde-cia text-white px-4 py-2 rounded-lg hover:bg-verde-cia-dark transition-colors"
        >
          <Plus className="h-5 w-5" />
          Adicionar Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <CardCarrossel
            key={item.id}
            {...item}
            onEdit={() => {
              setEditingItem(item);
              setShowModal(true);
            }}
            onDelete={() => handleDelete(item.id)}
            onMoveUp={() => handleMoveUp(index)}
            onMoveDown={() => handleMoveDown(index)}
            canMoveUp={index > 0}
            canMoveDown={index < items.length - 1}
          />
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              {editingItem ? 'Editar Item' : 'Novo Item'}
            </h2>
            {/* Formulário de edição/criação aqui */}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarouselManager; 