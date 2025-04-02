import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Trash2, Edit2, Save, X, Image as ImageIcon, Video, File, Filter, Loader, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

interface MediaItem {
  id: string;
  title: string;
  type: string;
  description: string | null;
  url: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

const MEDIA_TYPES = ['image', 'video', 'document'];
const ALLOWED_FILE_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  video: ['video/mp4', 'video/webm'],
  document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
};

const Media = () => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    type: 'image',
    description: '',
    url: '',
    active: true
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Erro ao carregar itens de mídia:', error);
      toast.error('Erro ao carregar itens de mídia');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      // Validar tipo do arquivo
      const fileType = MEDIA_TYPES.find(type => 
        ALLOWED_FILE_TYPES[type as keyof typeof ALLOWED_FILE_TYPES].includes(file.type)
      );

      if (!fileType) {
        throw new Error('Tipo de arquivo não suportado');
      }

      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileType}/${fileName}`;

      // Upload do arquivo
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      // Criar registro no banco
      const { error: dbError } = await supabase
        .from('media_items')
        .insert([{
          title: file.name,
          type: fileType,
          url: publicUrl,
          active: true
        }]);

      if (dbError) throw dbError;

      toast.success('Arquivo enviado com sucesso');
      fetchItems();
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao enviar arquivo');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editing) {
        const { error } = await supabase
          .from('media_items')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editing);

        if (error) throw error;
        toast.success('Item atualizado com sucesso');
      } else {
        const { error } = await supabase
          .from('media_items')
          .insert([{
            ...formData,
            created_at: new Date().toISOString()
          }]);

        if (error) throw error;
        toast.success('Item adicionado com sucesso');
      }

      setEditing(null);
      setFormData({
        title: '',
        type: 'image',
        description: '',
        url: '',
        active: true
      });
      fetchItems();
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      toast.error('Erro ao salvar item');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: MediaItem) => {
    setEditing(item.id);
    setFormData({
      title: item.title,
      type: item.type,
      description: item.description || '',
      url: item.url,
      active: item.active
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;

    try {
      // Primeiro, obter o item para pegar a URL
      const { data: item, error: fetchError } = await supabase
        .from('media_items')
        .select('url')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Extrair o caminho do arquivo da URL
      const filePath = new URL(item.url).pathname.split('/').slice(-2).join('/');
      
      // Deletar o arquivo do storage
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Deletar o registro do banco
      const { error: dbError } = await supabase
        .from('media_items')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      toast.success('Item excluído com sucesso');
      fetchItems();
    } catch (error) {
      console.error('Erro ao excluir item:', error);
      toast.error('Erro ao excluir item');
    }
  };

  const filteredItems = items.filter(item => {
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-6 w-6" />;
      case 'video':
        return <Video className="h-6 w-6" />;
      default:
        return <File className="h-6 w-6" />;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader className="w-8 h-8 animate-spin text-verde-cia" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Mídia</h1>
          <label className="px-4 py-2 bg-verde-cia text-white rounded-lg hover:bg-verde-cia-escuro transition-colors flex items-center cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
              accept={Object.values(ALLOWED_FILE_TYPES).flat().join(',')}
            />
            <Upload className="h-5 w-5 mr-2" />
            {uploading ? 'Enviando...' : 'Enviar Arquivo'}
          </label>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Pesquisar mídia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-4 py-2 rounded-lg ${
                  selectedType === 'all'
                    ? 'bg-verde-cia text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos
              </button>
              {MEDIA_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedType === type
                      ? 'bg-verde-cia text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg shadow border hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {getTypeIcon(item.type)}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span className="flex items-center">
                      {getTypeIcon(item.type)}
                      <span className="ml-1">
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </span>
                    </span>
                    <span>•</span>
                    <span className={item.active ? 'text-green-500' : 'text-red-500'}>
                      {item.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {item.description && (
                <p className="text-gray-600 text-sm">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Media;