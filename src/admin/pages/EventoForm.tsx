import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, Save, ArrowLeft, Upload, Calendar, Clock, MapPin, User, Phone, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

interface Evento {
  id?: string;
  titulo: string;
  descricao: string;
  imagem_url?: string;
  data_evento: string;
  hora_evento: string;
  local: string;
  endereco: string;
  organizador: string;
  contato: string;
  categoria: string;
  ativo: boolean;
  link_inscricao?: string;
}

const EventoForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [evento, setEvento] = useState<Evento>({
    titulo: '',
    descricao: '',
    data_evento: new Date().toISOString().split('T')[0],
    hora_evento: '08:00',
    local: '',
    endereco: '',
    organizador: '',
    contato: '',
    categoria: '',
    ativo: true,
    link_inscricao: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchEvento();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchEvento = async () => {
    try {
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setEvento(data);
        if (data.imagem_url) {
          setImagePreview(data.imagem_url);
        }
      }
    } catch (error) {
      toast.error('Erro ao carregar evento');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setEvento(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedImage(file);
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `eventos/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);
      
    if (uploadError) {
      throw uploadError;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);
      
    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = evento.imagem_url;
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }
      
      const eventoData = {
        ...evento,
        imagem_url: imageUrl
      };
      
      let response;
      if (id) {
        response = await supabase
          .from('eventos')
          .update(eventoData)
          .eq('id', id)
          .select();
      } else {
        response = await supabase
          .from('eventos')
          .insert([eventoData])
          .select();
      }
      
      if (response.error) throw response.error;
      
      toast.success(id ? 'Evento atualizado com sucesso!' : 'Evento criado com sucesso!');
      navigate('/admin/eventos');
    } catch (error: any) {
      toast.error(id ? 'Erro ao atualizar evento' : 'Erro ao criar evento');
      console.error('Erro ao salvar evento:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este evento?')) return;

    try {
      const { error } = await supabase
        .from('eventos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Evento excluído com sucesso');
      navigate('/admin/eventos');
    } catch (error) {
      toast.error('Erro ao excluir evento');
      console.error('Error:', error);
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
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/admin/eventos')}
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {id ? 'Editar Evento' : 'Novo Evento'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {id && (
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-5 w-5" />
              Excluir
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-verde-cia hover:bg-verde-cia-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde-cia disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Imagem do Evento
              </label>
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-lg border border-gray-300"
                    />
                  ) : (
                    <div className="h-32 w-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col">
                    <label
                      htmlFor="imagem"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {imagePreview ? 'Trocar imagem' : 'Escolher imagem'}
                    </label>
                    <input
                      id="imagem"
                      name="imagem"
                      type="file"
                      className="sr-only"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      JPG, PNG ou GIF. Tamanho máximo de 2MB.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
                Título do Evento
              </label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={evento.titulo}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-verde-cia focus:border-verde-cia"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                id="descricao"
                name="descricao"
                rows={5}
                value={evento.descricao}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-verde-cia focus:border-verde-cia"
              ></textarea>
            </div>
            
            <div className="relative">
              <label htmlFor="data_evento" className="block text-sm font-medium text-gray-700 mb-1">
                Data do Evento
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="data_evento"
                  name="data_evento"
                  value={evento.data_evento}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-verde-cia focus:border-verde-cia"
                />
              </div>
            </div>
            
            <div className="relative">
              <label htmlFor="hora_evento" className="block text-sm font-medium text-gray-700 mb-1">
                Hora do Evento
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="time"
                  id="hora_evento"
                  name="hora_evento"
                  value={evento.hora_evento}
                  onChange={handleChange}
                  className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-verde-cia focus:border-verde-cia"
                />
              </div>
            </div>
            
            <div className="relative">
              <label htmlFor="local" className="block text-sm font-medium text-gray-700 mb-1">
                Local
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="local"
                  name="local"
                  value={evento.local}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-verde-cia focus:border-verde-cia"
                  placeholder="Nome do local"
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-1">
                Endereço
              </label>
              <input
                type="text"
                id="endereco"
                name="endereco"
                value={evento.endereco}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-verde-cia focus:border-verde-cia"
                placeholder="Endereço completo do local"
              />
            </div>
            
            <div className="relative">
              <label htmlFor="organizador" className="block text-sm font-medium text-gray-700 mb-1">
                Organizador
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="organizador"
                  name="organizador"
                  value={evento.organizador}
                  onChange={handleChange}
                  className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-verde-cia focus:border-verde-cia"
                />
              </div>
            </div>
            
            <div className="relative">
              <label htmlFor="contato" className="block text-sm font-medium text-gray-700 mb-1">
                Contato
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="contato"
                  name="contato"
                  value={evento.contato}
                  onChange={handleChange}
                  className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-verde-cia focus:border-verde-cia"
                  placeholder="Telefone, email ou site"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Categoria
              </label>
              <select
                name="categoria"
                value={evento.categoria}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-verde-cia focus:border-verde-cia"
              >
                <option value="">Selecione uma categoria</option>
                <option value="webinar">Webinar</option>
                <option value="workshop">Workshop</option>
                <option value="conferencia">Conferência</option>
                <option value="curso">Curso</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Link para Inscrições
              </label>
              <input
                type="url"
                name="link_inscricao"
                value={evento.link_inscricao}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-verde-cia focus:border-verde-cia"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="ativo"
                  checked={evento.ativo}
                  onChange={handleChange}
                  className="h-4 w-4 text-verde-cia focus:ring-verde-cia border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Evento ativo
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventoForm; 