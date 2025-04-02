import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Edit2, Save, X, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface Ad {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link: string | null;
  active: boolean;
}

const AdsManager = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    link: '',
    active: true
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAds(data || []);
    } catch (error) {
      toast.error('Erro ao carregar anúncios');
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
          .from('ads')
          .update(formData)
          .eq('id', editing);

        if (error) throw error;
        toast.success('Anúncio atualizado com sucesso');
      } else {
        const { error } = await supabase
          .from('ads')
          .insert([formData]);

        if (error) throw error;
        toast.success('Anúncio adicionado com sucesso');
      }

      setEditing(null);
      setFormData({
        title: '',
        description: '',
        image_url: '',
        link: '',
        active: true
      });
      fetchAds();
    } catch (error) {
      toast.error('Erro ao salvar anúncio');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ad: Ad) => {
    setEditing(ad.id);
    setFormData({
      title: ad.title,
      description: ad.description || '',
      image_url: ad.image_url,
      link: ad.link || '',
      active: ad.active
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este anúncio?')) return;

    try {
      const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Anúncio excluído com sucesso');
      fetchAds();
    } catch (error) {
      toast.error('Erro ao excluir anúncio');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Carregando...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Gerenciar Anúncios</h2>
      
      <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-4 rounded-lg">
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
              URL da Imagem
            </label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link do Anúncio
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
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
        </div>

        <div className="mt-4 flex space-x-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            {editing ? 'Atualizar' : 'Adicionar'}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setFormData({
                  title: '',
                  description: '',
                  image_url: '',
                  link: '',
                  active: true
                });
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ads.map((ad) => (
          <div
            key={ad.id}
            className="bg-white p-4 rounded-lg shadow border hover:shadow-md transition-shadow"
          >
            <img
              src={ad.image_url}
              alt={ad.title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="font-semibold mb-2">{ad.title}</h3>
            {ad.description && (
              <p className="text-gray-600 text-sm mb-4">{ad.description}</p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {ad.link && (
                  <a
                    href={ad.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <LinkIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm">Link</span>
                  </a>
                )}
                <span className={`text-sm ${ad.active ? 'text-green-500' : 'text-red-500'}`}>
                  {ad.active ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(ad)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(ad.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdsManager;