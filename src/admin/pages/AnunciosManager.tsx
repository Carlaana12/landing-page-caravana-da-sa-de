import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Loader2, Bell, AlertTriangle, Info, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Anuncio {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'alerta' | 'informativo';
  ativo: boolean;
}

const AnunciosManager: React.FC = () => {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAnuncio, setEditingAnuncio] = useState<Anuncio | null>(null);
  const [formData, setFormData] = useState({ titulo: '', mensagem: '', tipo: 'informativo' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAnuncios();
  }, []);

  useEffect(() => {
    if (editingAnuncio) {
      setFormData({
        titulo: editingAnuncio.titulo,
        mensagem: editingAnuncio.mensagem,
        tipo: editingAnuncio.tipo,
      });
    } else {
      setFormData({ titulo: '', mensagem: '', tipo: 'informativo' });
    }
  }, [editingAnuncio]);

  const fetchAnuncios = async () => {
    try {
      const { data, error } = await supabase
        .from('anuncios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnuncios(data || []);
    } catch (error) {
      toast.error('Erro ao carregar anúncios');
      console.error('Error fetching anuncios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este anúncio?')) return;

    try {
      const { error } = await supabase.from('anuncios').delete().eq('id', id);
      if (error) throw error;

      setAnuncios(anuncios.filter(anuncio => anuncio.id !== id));
      toast.success('Anúncio excluído com sucesso');
    } catch (error) {
      toast.error('Erro ao excluir anúncio');
      console.error('Error deleting anuncio:', error);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('anuncios')
        .update({ ativo: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      setAnuncios(anuncios.map(anuncio =>
        anuncio.id === id ? { ...anuncio, ativo: !currentStatus } : anuncio
      ));
      toast.success('Status do anúncio atualizado');
    } catch (error) {
      toast.error('Erro ao atualizar status do anúncio');
      console.error('Error updating anuncio status:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação simples para garantir que os campos não estão vazios
    if (!formData.titulo || !formData.mensagem) {
      toast.error('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    setSaving(true);

    try {
      if (editingAnuncio) {
        const { error } = await supabase
          .from('anuncios')
          .update(formData)
          .eq('id', editingAnuncio.id);
        if (error) throw error;
        toast.success('Anúncio atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('anuncios')
          .insert([{ ...formData, ativo: true }]);
        if (error) throw error;
        toast.success('Anúncio criado com sucesso!');
      }

      fetchAnuncios(); // Recarregar os anúncios após salvar
      setShowModal(false); // Fechar o modal após salvar
    } catch (err) {
      toast.error('Erro ao salvar anúncio');
      console.error(err);
    } finally {
      setSaving(false);
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
        <h1 className="text-2xl font-bold text-gray-800">Gerenciar Anúncios</h1>
        <button
          onClick={() => {
            setEditingAnuncio(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-verde-cia text-white px-4 py-2 rounded-lg hover:bg-verde-cia-dark transition-colors"
        >
          <Plus className="h-5 w-5" />
          Adicionar Anúncio
        </button>
      </div>

      <div className="space-y-4">
        {anuncios.map((anuncio) => (
          <div
            key={anuncio.id}
            className={`bg-white p-4 rounded-xl shadow-sm border-l-4 ${
              anuncio.tipo === 'alerta' ? 'border-red-500' : 'border-blue-500'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {anuncio.tipo === 'alerta' ? (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                ) : (
                  <Info className="h-5 w-5 text-blue-500" />
                )}
                <h3 className="text-lg font-semibold text-gray-800">
                  {anuncio.titulo}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleStatus(anuncio.id, anuncio.ativo)}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    anuncio.ativo
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {anuncio.ativo ? 'Ativo' : 'Inativo'}
                </button>
                <button
                  onClick={() => {
                    setEditingAnuncio(anuncio);
                    setShowModal(true);
                  }}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(anuncio.id)}
                  className="text-gray-600 hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            <p className="mt-2 text-gray-600">{anuncio.mensagem}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {editingAnuncio ? 'Editar Anúncio' : 'Adicionar Anúncio'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Título</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-verde-cia focus:border-verde-cia"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Mensagem</label>
                <textarea
                  value={formData.mensagem}
                  onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-verde-cia focus:border-verde-cia"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-verde-cia focus:border-verde-cia"
                >
                  <option value="informativo">Informativo</option>
                  <option value="alerta">Alerta</option>
                </select>
              </div>
              <div className="mt-4 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={`px-4 py-2 ${saving ? 'bg-gray-400' : 'bg-verde-cia text-white'} rounded-lg`}
                >
                  {saving ? 'Salvando...' : editingAnuncio ? 'Salvar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnunciosManager;
