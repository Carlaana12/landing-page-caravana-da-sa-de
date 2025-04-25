import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Loader2, Edit2, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Destaque {
  id: string;
  titulo: string;
  descricao: string;
  imagem_url: string;
  ativo: boolean;
  ordem: number;
}

const DestaquesManager: React.FC = () => {
  const [destaques, setDestaques] = useState<Destaque[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDestaque, setEditingDestaque] = useState<Destaque | null>(null);

  useEffect(() => {
    fetchDestaques();
  }, []);

  const fetchDestaques = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('destaques')
        .select('*')
        .order('ordem', { ascending: true });

      if (error) throw error;
      setDestaques(data || []);
    } catch (error) {
      toast.error('Erro ao carregar destaques');
      console.error('Erro ao buscar destaques:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrdem = async (index1: number, index2: number) => {
    const newDestaques = [...destaques];
    const temp = newDestaques[index1];
    newDestaques[index1] = newDestaques[index2];
    newDestaques[index2] = temp;

    try {
      await Promise.all([
        supabase
          .from('destaques')
          .update({ ordem: newDestaques[index1].ordem })
          .eq('id', newDestaques[index1].id),
        supabase
          .from('destaques')
          .update({ ordem: newDestaques[index2].ordem })
          .eq('id', newDestaques[index2].id),
      ]);

      // Troca visual
      [newDestaques[index1].ordem, newDestaques[index2].ordem] = [newDestaques[index2].ordem, newDestaques[index1].ordem];
      setDestaques(newDestaques);
      toast.success('Ordem atualizada');
    } catch (error) {
      toast.error('Erro ao atualizar ordem');
      console.error('Erro na troca de ordem:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este destaque?')) return;
    try {
      const { error } = await supabase.from('destaques').delete().eq('id', id);
      if (error) throw error;
      setDestaques(prev => prev.filter(d => d.id !== id));
      toast.success('Destaque removido');
    } catch (error) {
      toast.error('Erro ao excluir destaque');
      console.error('Erro ao excluir:', error);
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
        <h1 className="text-2xl font-bold text-gray-800">Gerenciar Destaques</h1>
        <button
          onClick={() => {
            setEditingDestaque(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-verde-cia text-white px-4 py-2 rounded-lg hover:bg-verde-cia-dark transition-colors"
        >
          <Plus className="h-5 w-5" />
          Adicionar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destaques.map((d, index) => (
          <div key={d.id} className="bg-white rounded-xl shadow overflow-hidden">
            <div className="relative aspect-video">
              <img src={d.imagem_url} alt={d.titulo} className="w-full h-full object-cover" />
              <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${d.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {d.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{d.titulo}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{d.descricao}</p>

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingDestaque(d);
                      setShowModal(true);
                    }}
                    title="Editar"
                    className="text-gray-600 hover:text-verde-cia transition-colors"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(d.id)}
                    title="Excluir"
                    className="text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => updateOrdem(index, index - 1)}
                    disabled={index === 0}
                    title="Mover para cima"
                    className="text-gray-600 hover:text-verde-cia transition-colors disabled:opacity-50"
                  >
                    <ArrowUp className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => updateOrdem(index, index + 1)}
                    disabled={index === destaques.length - 1}
                    title="Mover para baixo"
                    className="text-gray-600 hover:text-verde-cia transition-colors disabled:opacity-50"
                  >
                    <ArrowDown className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DestaquesManager;
