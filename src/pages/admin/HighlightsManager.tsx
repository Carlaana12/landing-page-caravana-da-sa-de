import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, Image, Link as LinkIcon, Eye, EyeOff, Save, X } from 'lucide-react';

// Interface local
interface Highlight {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  is_active: boolean;
  order: number;
  created_at: string;
}

// Interface Supabase (inferida/ajustada)
interface SupabaseHighlight {
  id: string;
  title: string;
  description: string | null;
  icon: string; // Mapeado para/de image_url
  color: string; // Ausente no form, precisa de padrão?
  link_url: string | null; // Mapeado para/de link_url, permitindo null
  order: number;
  active: boolean; // Mapeado para/de is_active
  created_at: string;
  updated_at?: string;
}

const HighlightsManager: React.FC = () => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHighlight, setEditingHighlight] = useState<Highlight | null>(null);
  const [formData, setFormData] = useState<Partial<Highlight>>({});

  const fetchHighlights = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('highlights')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      // Mapear dados do Supabase para a interface local Highlight
      const mappedData: Highlight[] = (data as SupabaseHighlight[] || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        image_url: item.icon || '', // Mapeia icon para image_url, com fallback
        link_url: item.link_url || '', // Fallback para string vazia
        is_active: item.active, // Mapeia active para is_active
        order: item.order,
        created_at: item.created_at,
      }));
      setHighlights(mappedData);
    } catch (error) {
      toast.error('Erro ao carregar destaques.');
      console.error('Error fetching highlights:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHighlights();
  }, [fetchHighlights]);

  const openModalForCreate = () => {
    setEditingHighlight(null);
    setFormData({
      title: '',
      description: '',
      image_url: '',
      link_url: '',
      is_active: true,
      order: (highlights.length + 1) * 10, // Default order
    });
    setShowModal(true);
  };

  const openModalForEdit = (highlight: Highlight) => {
    setEditingHighlight(highlight);
    setFormData({ ...highlight });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingHighlight(null);
    setFormData({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const inputValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;
    const finalValue = name === 'order' ? parseInt(inputValue as string, 10) || 0 : inputValue;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.image_url) {
      toast.error('Título e URL da Imagem são obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      // Mapear dados do formulário para a estrutura da tabela Supabase
      const payload = {
        title: formData.title,
        description: formData.description || null,
        icon: formData.image_url, // Mapeia image_url para icon
        color: '', // Valor padrão, já que não está no formulário
        link_url: formData.link_url || null,
        order: formData.order || 0,
        active: formData.is_active ?? false,
      };

      if (editingHighlight) {
        // Update
        const { error } = await supabase
          .from('highlights')
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq('id', editingHighlight.id);
        if (error) throw error;
        toast.success('Destaque atualizado com sucesso!');
      } else {
        // Create
        const { error } = await supabase
          .from('highlights')
          .insert([payload]);
        if (error) throw error;
        toast.success('Destaque criado com sucesso!');
      }
      closeModal();
      fetchHighlights();
    } catch (error) {
      toast.error(`Erro ao salvar destaque: ${(error as Error).message}`);
      console.error('Error saving highlight:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este destaque?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('highlights')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Destaque excluído com sucesso!');
      fetchHighlights();
    } catch (error) {
      toast.error('Erro ao excluir destaque.');
      console.error('Error deleting highlight:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Gerenciamento de Destaques</h1>
        <button
          onClick={openModalForCreate}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Destaque
        </button>
      </div>

      {/* Lista de Destaques */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading && highlights.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : highlights.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Nenhum destaque encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ordem</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagem</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {highlights.map((highlight) => (
                  <tr key={highlight.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{highlight.order}</td>
                    <td className="px-6 py-4">
                      {highlight.image_url ? (
                        <img src={highlight.image_url} alt={highlight.title} className="h-10 w-16 object-cover rounded" />
                      ) : (
                        <div className="h-10 w-16 bg-gray-200 rounded flex items-center justify-center">
                          <Image className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{highlight.title}</div>
                      <div className="text-sm text-gray-500 truncate" style={{maxWidth: '300px'}} title={highlight.description}>{highlight.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        highlight.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {highlight.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openModalForEdit(highlight)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Editar"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(highlight.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal para Criar/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              {editingHighlight ? 'Editar Destaque' : 'Novo Destaque'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem *</label>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url || ''}
                  onChange={handleInputChange}
                  required
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                 {formData.image_url && <img src={formData.image_url} alt="Preview" className="mt-2 h-20 rounded" />}
              </div>
              <div>
                <label htmlFor="link_url" className="block text-sm font-medium text-gray-700 mb-1">URL do Link (Opcional)</label>
                <input
                  type="url"
                  id="link_url"
                  name="link_url"
                  value={formData.link_url || ''}
                  onChange={handleInputChange}
                  placeholder="https://exemplo.com/pagina-destino"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">Ordem</label>
                    <input
                      type="number"
                      id="order"
                      name="order"
                      value={formData.order || 0}
                      onChange={handleInputChange}
                      min="0"
                      className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center pt-6">
                    <input
                      type="checkbox"
                      id="is_active"
                      name="is_active"
                      checked={formData.is_active ?? true}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                      Ativo
                    </label>
                  </div>
              </div>
              <div className="pt-6 flex justify-end space-x-3 border-t border-gray-200 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
                    loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="w-4 h-4 mr-1" />
                  )}
                  Salvar Destaque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HighlightsManager;