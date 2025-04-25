import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import {
  Plus, Edit2, Trash2, Image, Link as LinkIcon,
  Eye, EyeOff, Save, X, DollarSign, Calendar, MapPin
} from 'lucide-react';

interface Ad {
  id: string;
  title: string;
  image_url: string;
  link_url: string;
  placement: 'sidebar_left' | 'banner_top' | 'in_content'; // Exemplo de placements
  start_date?: string; // ISO string
  end_date?: string;   // ISO string
  is_active: boolean;
  created_at: string;
}

const PLACEMENT_OPTIONS = {
  sidebar_left: 'Barra Lateral Esquerda',
  banner_top: 'Banner Superior',
  in_content: 'Dentro do Conteúdo'
};

const AdsManager: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [formData, setFormData] = useState<Partial<Ad>>({});

  const fetchAds = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('advertisements') // Nome da sua tabela de anúncios
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAds(data || []);
    } catch (error) {
      toast.error('Erro ao carregar anúncios.');
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  const openModalForCreate = () => {
    setEditingAd(null);
    setFormData({
      title: '',
      image_url: '',
      link_url: '',
      placement: 'sidebar_left',
      start_date: '',
      end_date: '',
      is_active: true,
    });
    setShowModal(true);
  };

  const openModalForEdit = (ad: Ad) => {
    setEditingAd(ad);
    // Formatar datas para input date (YYYY-MM-DD)
    const formatForInput = (dateString?: string) => dateString ? dateString.split('T')[0] : '';
    setFormData({
      ...ad,
      start_date: formatForInput(ad.start_date),
      end_date: formatForInput(ad.end_date),
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAd(null);
    setFormData({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const inputValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;

    // Converter datas de input (YYYY-MM-DD) para ISO string com T00:00:00.000Z
    if ((name === 'start_date' || name === 'end_date') && value) {
      const dateValue = new Date(value + 'T00:00:00.000Z').toISOString();
       setFormData(prev => ({ ...prev, [name]: dateValue }));
    } else {
       setFormData(prev => ({ ...prev, [name]: inputValue }));
    }

  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.image_url || !formData.link_url || !formData.placement) {
      toast.error('Título, URL da Imagem, URL do Link e Posicionamento são obrigatórios.');
      return;
    }

    setLoading(true);
    try {
       // As datas já estão em formato ISO no estado formData devido ao handleInputChange
      const dataToSave = { ...formData };

      if (editingAd) {
        // Update
        const { error } = await supabase
          .from('advertisements')
          .update({ ...dataToSave, updated_at: new Date().toISOString() })
          .eq('id', editingAd.id);
        if (error) throw error;
        toast.success('Anúncio atualizado com sucesso!');
      } else {
        // Create
        const { error } = await supabase
          .from('advertisements')
          .insert([{ ...dataToSave }]);
        if (error) throw error;
        toast.success('Anúncio criado com sucesso!');
      }
      closeModal();
      fetchAds();
    } catch (error) {
      toast.error(`Erro ao salvar anúncio: ${(error as Error).message}`);
      console.error('Error saving ad:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este anúncio?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Anúncio excluído com sucesso!');
      fetchAds();
    } catch (error) {
      toast.error('Erro ao excluir anúncio.');
      console.error('Error deleting ad:', error);
    } finally {
      setLoading(false);
    }
  };

   const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return 'Inválida';
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Gerenciamento de Anúncios</h1>
        <button
          onClick={openModalForCreate}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Anúncio
        </button>
      </div>

      {/* Lista de Anúncios */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading && ads.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : ads.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Nenhum anúncio encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagem</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posicionamento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Período</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ads.map((ad) => (
                  <tr key={ad.id} className="hover:bg-gray-50">
                     <td className="px-6 py-4">
                      {ad.image_url ? (
                        <img src={ad.image_url} alt={ad.title} className="h-10 w-16 object-cover rounded" />
                      ) : (
                        <div className="h-10 w-16 bg-gray-200 rounded flex items-center justify-center">
                          <Image className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{ad.title}</div>
                       <a href={ad.link_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline truncate block" style={{maxWidth: '200px'}}>{ad.link_url}</a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                       {PLACEMENT_OPTIONS[ad.placement] || ad.placement}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(ad.start_date)} - {formatDate(ad.end_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        ad.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {ad.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openModalForEdit(ad)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Editar"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(ad.id)}
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
              {editingAd ? 'Editar Anúncio' : 'Novo Anúncio'}
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
                <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem *</label>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url || ''}
                  onChange={handleInputChange}
                  required
                  placeholder="https://exemplo.com/banner.jpg"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                 {formData.image_url && <img src={formData.image_url} alt="Preview" className="mt-2 h-20 rounded" />}
              </div>
              <div>
                <label htmlFor="link_url" className="block text-sm font-medium text-gray-700 mb-1">URL do Link *</label>
                <input
                  type="url"
                  id="link_url"
                  name="link_url"
                  value={formData.link_url || ''}
                  onChange={handleInputChange}
                  required
                  placeholder="https://destino-anuncio.com"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                 <label htmlFor="placement" className="block text-sm font-medium text-gray-700 mb-1">Posicionamento *</label>
                 <select
                   id="placement"
                   name="placement"
                   value={formData.placement || 'sidebar_left'}
                   onChange={handleInputChange}
                   required
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                 >
                   {Object.entries(PLACEMENT_OPTIONS).map(([key, label]) => (
                     <option key={key} value={key}>{label}</option>
                   ))}
                 </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">Data Início (Opcional)</label>
                    <input
                      type="date"
                      id="start_date"
                      name="start_date"
                      value={formData.start_date?.split('T')[0] || ''} // Exibe YYYY-MM-DD
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                     <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">Data Fim (Opcional)</label>
                     <input
                       type="date"
                       id="end_date"
                       name="end_date"
                       value={formData.end_date?.split('T')[0] || ''} // Exibe YYYY-MM-DD
                       onChange={handleInputChange}
                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                     />
                  </div>
              </div>
               <div className="flex items-center pt-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active ?? true}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                    Ativo (Exibir este anúncio)
                  </label>
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
                  Salvar Anúncio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdsManager;