import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, Calendar, MapPin, Clock, Eye, EyeOff, Save, X, Link as LinkIcon, Image } from 'lucide-react';

// Interface local para o componente
interface Event {
  id: string;
  title: string;
  description: string;
  date_time: string; // Usado internamente, formato ISO string compatível com input datetime-local
  location?: string; // Opcional no componente
  image_url?: string;
  link_url?: string;
  is_active: boolean;
  created_at: string;
}

// Interface representando a tabela Supabase (ajustada conforme erros)
interface SupabaseEvent {
  id: string;
  title: string;
  description: string | null;
  date: string; // Parece ser string obrigatória
  location: string; // Parece ser string obrigatória
  image_url: string; // Parece ser string obrigatória
  link_url: string | null; // Permitindo null
  active: boolean;
  created_at: string;
  updated_at?: string;
}

const EventsManager: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Partial<Event>>({});

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      // Mapear dados do Supabase para a interface local Event
      const mappedData: Event[] = (data as SupabaseEvent[] || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        date_time: item.date,
        location: item.location || undefined, // Usar undefined para campos opcionais
        image_url: item.image_url || undefined,
        link_url: item.link_url || undefined,
        is_active: item.active,
        created_at: item.created_at,
      }));
      setEvents(mappedData);
    } catch (error) {
      toast.error('Erro ao carregar eventos.');
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const openModalForCreate = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      date_time: new Date().toISOString().slice(0, 16), // Default para agora
      location: '',
      image_url: '',
      link_url: '',
      is_active: true,
    });
    setShowModal(true);
  };

  const openModalForEdit = (event: Event) => {
    setEditingEvent(event);
    // Formatar data para datetime-local input
    const formattedDate = event.date_time ? new Date(event.date_time).toISOString().slice(0, 16) : '';
    setFormData({ ...event, date_time: formattedDate });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEvent(null);
    setFormData({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const inputValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: inputValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.date_time) {
      toast.error('Título, Descrição e Data/Hora são obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      // Mapear dados do formulário para a estrutura da tabela Supabase
      const payload = {
        title: formData.title,
        description: formData.description || null,
        date: new Date(formData.date_time).toISOString(), // Garantido que existe pela validação acima
        location: formData.location || '', // Usar '' como padrão se for obrigatório no DB
        image_url: formData.image_url || '', // Usar '' como padrão
        link_url: formData.link_url || null, // Permitir null se o DB permitir
        active: formData.is_active ?? false,
      };

      if (editingEvent) {
        // Update
        const { error } = await supabase
          .from('events')
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq('id', editingEvent.id);
        if (error) throw error;
        toast.success('Evento atualizado com sucesso!');
      } else {
        // Create
        const { error } = await supabase
          .from('events')
          .insert([payload]); // Passar o payload diretamente
        if (error) throw error;
        toast.success('Evento criado com sucesso!');
      }
      closeModal();
      fetchEvents();
    } catch (error) {
      toast.error(`Erro ao salvar evento: ${(error as Error).message}`);
      console.error('Error saving event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este evento?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Evento excluído com sucesso!');
      fetchEvents();
    } catch (error) {
      toast.error('Erro ao excluir evento.');
      console.error('Error deleting event:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleString('pt-BR', {
        dateStyle: 'short', timeStyle: 'short'
      });
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Gerenciamento de Eventos</h1>
        <button
          onClick={openModalForCreate}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Evento
        </button>
      </div>

      {/* Lista de Eventos */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading && events.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Nenhum evento encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Local</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{event.title}</div>
                      <div className="text-sm text-gray-500 truncate" style={{maxWidth: '300px'}} title={event.description}>{event.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(event.date_time)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                         <MapPin className="w-4 h-4 mr-1" />
                        {event.location || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ 
                        event.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {event.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openModalForEdit(event)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Editar"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
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
              {editingEvent ? 'Editar Evento' : 'Novo Evento'}
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
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                 <label htmlFor="date_time" className="block text-sm font-medium text-gray-700 mb-1">Data e Hora *</label>
                 <input
                   type="datetime-local"
                   id="date_time"
                   name="date_time"
                   value={formData.date_time || ''}
                   onChange={handleInputChange}
                   required
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                 />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Local (Opcional)</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem (Opcional)</label>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url || ''}
                  onChange={handleInputChange}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                 {formData.image_url && <img src={formData.image_url} alt="Preview" className="mt-2 h-20 rounded" />}
              </div>
              <div>
                <label htmlFor="link_url" className="block text-sm font-medium text-gray-700 mb-1">URL do Link Externo (Opcional)</label>
                <input
                  type="url"
                  id="link_url"
                  name="link_url"
                  value={formData.link_url || ''}
                  onChange={handleInputChange}
                  placeholder="https://exemplo.com/pagina-evento"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
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
                    Ativo (Visível no site)
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
                  Salvar Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsManager;