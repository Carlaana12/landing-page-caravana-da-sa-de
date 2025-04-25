import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Plus,
  Loader2,
  Calendar,
  MapPin,
  Edit2,
  Trash2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  local: string;
  imagem_url: string;
}

const EventosManager: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null);

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .order('data', { ascending: true });

      if (error) throw error;
      setEventos(data || []);
    } catch (error) {
      toast.error('Erro ao carregar eventos');
      console.error('Error fetching eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este evento?')) return;

    try {
      const { error } = await supabase
        .from('eventos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEventos(eventos.filter(evento => evento.id !== id));
      toast.success('Evento excluído com sucesso');
    } catch (error) {
      toast.error('Erro ao excluir evento');
      console.error('Error deleting evento:', error);
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
        <h1 className="text-2xl font-bold text-gray-800">Gerenciar Eventos</h1>
        <button
          onClick={() => {
            setEditingEvento(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-verde-cia text-white px-4 py-2 rounded-lg hover:bg-verde-cia-dark transition-colors"
        >
          <Plus className="h-5 w-5" />
          Adicionar Evento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventos.map((evento) => (
          <div
            key={evento.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="relative aspect-video">
              <img
                src={evento.imagem_url}
                alt={evento.titulo}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {evento.titulo}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {evento.descricao}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    {new Date(evento.data).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{evento.local}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setEditingEvento(evento);
                    setShowModal(true);
                  }}
                  className="p-2 text-gray-600 hover:text-verde-cia transition-colors"
                  title="Editar"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(evento.id)}
                  className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              {editingEvento ? 'Editar Evento' : 'Novo Evento'}
            </h2>
            {/* Formulário de edição/criação aqui */}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventosManager; 