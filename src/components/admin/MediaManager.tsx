import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Upload, Image as ImageIcon, Loader, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface MediaManagerProps {
  onSelect: (url: string) => void;
  onClose: () => void;
}

const MediaManager: React.FC<MediaManagerProps> = ({ onSelect, onClose }) => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Erro ao carregar arquivos');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `media/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('media_items')
        .insert([{
          title: file.name,
          type: 'image',
          url: publicUrl,
          active: true
        }]);

      if (dbError) throw dbError;

      toast.success('Arquivo enviado com sucesso');
      fetchFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Erro ao enviar arquivo');
    } finally {
      setUploading(false);
    }
  };

  const filteredFiles = files.filter(file =>
    file.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Gerenciador de Mídia</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar arquivos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md"
              />
            </div>
            <label className="px-4 py-2 bg-verde-cia text-white rounded-md hover:bg-verde-cia-escuro transition-colors cursor-pointer flex items-center">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
                disabled={uploading}
              />
              <Upload className="w-5 h-5 mr-2" />
              {uploading ? 'Enviando...' : 'Enviar Arquivo'}
            </label>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader className="w-8 h-8 animate-spin text-verde-cia" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => onSelect(file.url)}
                  className="group relative aspect-square border rounded-lg overflow-hidden cursor-pointer hover:border-verde-cia transition-colors"
                >
                  {file.type === 'image' ? (
                    <img
                      src={file.url}
                      alt={file.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-sm px-2 text-center truncate">
                      {file.title}
                    </p>
                  </div>
                </div>
              ))}

              {filteredFiles.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  Nenhum arquivo encontrado
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaManager;