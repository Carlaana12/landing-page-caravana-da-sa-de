import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Trash2, Edit2, Save, X, ArrowUp, ArrowDown, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import MediaManager from '../../components/admin/MediaManager';

interface CarouselItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

const CarouselManager = () => {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showMediaManager, setShowMediaManager] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    active: true
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('carousel_items')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching carousel items:', error);
      toast.error('Erro ao carregar itens do carrossel');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editing) {
        const { error } = await supabase
          .from('carousel_items')
          .update(formData)
          .eq('id', editing);

        if (error) throw error;
        toast.success('Item atualizado com sucesso');
      } else {
        const { error } = await supabase
          .from('carousel_items')
          .insert([{
            ...formData,
            display_order: items.length
          }]);

        if (error) throw error;
        toast.success('Item adicionado com sucesso');
      }

      setEditing(null);
      setFormData({
        title: '',
        description: '',
        image_url: '',
        active: true
      });
      fetchItems();
    } catch (error) {
      console.error('Error saving carousel item:', error);
      toast.error('Erro ao salvar item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;

    try {
      const { error } = await supabase
        .from('carousel_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Item excluído com sucesso');
      fetchItems();
    } catch (error) {
      console.error('Error deleting carousel item:', error);
      toast.error('Erro ao excluir item');
    }
  };

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = items.findIndex(item => item.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === items.length - 1)
    ) {
      return;
    }

    const newItems = [...items];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const [movedItem] = newItems.splice(currentIndex, 1);
    newItems.splice(targetIndex, 0, movedItem);

    try {
      // Update display_order for all affected items
      const updates = newItems.map((item, index) => ({
        id: item.id,
        display_order: index
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('carousel_items')
          .update({ display_order: update.display_order })
          .eq('id', update.id);

        if (error) throw error;
      }

      setItems(newItems);
      toast.success('Ordem atualizada com sucesso');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Erro ao atualizar ordem');
      fetchItems(); // Refresh to ensure consistent state
    }
  };

  const handleImageSelect = (url: string) => {
    setFormData({ ...formData, image_url: url });
    setShowMediaManager(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Gerenciar Carrossel</h1>
          <button
            onClick={() => {
              setEditing(null);
              setFormData({
                title: '',
                description: '',
                image_url: '',
                active: true
              });
              setShowMediaManager(true);
            }}
            className="px-4 py-2 bg-verde-cia text-white rounded-lg hover:bg-verde-cia-escuro transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Item
          </button>
        </div>

        {/* Form */}
        {(editing !== null || formData.title !== '' || formData.image_url !== '') && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagem
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="flex-1 px-3 py-2 border rounded-md"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowMediaManager(true)}
                    className="px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">Ativo</span>
                </label>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-verde-cia text-white rounded-md hover:bg-verde-cia-escuro transition-colors flex items-center"
                disabled={loading}
              >
                <Save className="h-4 w-4 mr-2" />
                {editing ? 'Atualizar' : 'Adicionar'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setFormData({
                    title: '',
                    description: '',
                    image_url: '',
                    active: true
                  });
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* Items List */}
        <div className="grid grid-cols-1 gap-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg shadow border hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  {item.description && (
                    <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                  )}
                  <div className="flex items-center mt-2">
                    <span className={`text-sm ${item.active ? 'text-green-500' : 'text-red-500'}`}>
                      {item.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleMove(item.id, 'up')}
                    disabled={index === 0}
                    className={`p-2 rounded-md transition-colors ${
                      index === 0
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    title="Mover para cima"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleMove(item.id, 'down')}
                    disabled={index === items.length - 1}
                    className={`p-2 rounded-md transition-colors ${
                      index === items.length - 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    title="Mover para baixo"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditing(item.id);
                      setFormData({
                        title: item.title,
                        description: item.description || '',
                        image_url: item.image_url,
                        active: item.active
                      });
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum item no carrossel
            </div>
          )}
        </div>

        {/* Media Manager Modal */}
        {showMediaManager && (
          <MediaManager
            onSelect={handleImageSelect}
            onClose={() => setShowMediaManager(false)}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default CarouselManager;