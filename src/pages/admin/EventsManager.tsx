import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Edit2, Save, X, Calendar, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image_url: string;
  active: boolean;
}

const EventsManager = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    image_url: '',
    active: true
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      toast.error('Erro ao carregar eventos');
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
          .from('events')
          .update(formData)
          .eq('id', editing);

        if (error) throw error;
        toast.success('Evento atualizado com sucesso');
      } else {
        const { error } = await supabase
          .from('events')
          .insert([formData]);

        if (error) throw error;
        toast.success('Evento adicionado com sucesso');
      }

      setEditing(null);
      setFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        image_url: '',
        active: true
      });
      fetchEvents();
    } catch (error) {
      toast.error('Erro ao salvar evento');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event: Event) => {
    setEditing(event.id);
    setFormData({
      title: event.title,
      description: event.description || '',
      date: event.date,
      location: event.location,
      image_url: event.image_url,
      active: event.active
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Evento excluído com sucesso');
      fetchEvents();
    } catch (error) {
      toast.error('Erro ao excluir evento');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Carregando...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Gerenciar Eventos</h2>
      
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
              Data
            </label>
            <input
              type="text"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Ex: 15-17 Abril, 2024"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Local
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
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
                  date: '',
                  location: '',
                  image_url: '',
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white p-4 rounded-lg shadow border hover:shadow-md transition-shadow"
          >
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="font-semibold mb-2">{event.title}</h3>
            <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {event.date}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {event.location}
              </div>
            </div>
            {event.description && (
              <p className="text-gray-600 text-sm mb-4">{event.description}</p>
            )}
            <div className="flex items-center justify-between">
              <span className={`text-sm ${event.active ? 'text-green-500' : 'text-red-500'}`}>
                {event.active ? 'Ativo' : 'Inativo'}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
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

export default EventsManager;