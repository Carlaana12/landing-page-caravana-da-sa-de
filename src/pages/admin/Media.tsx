import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { Upload, Trash2, FileText, Image, Video, Music } from 'lucide-react';
import { FileObject } from '@supabase/storage-js';

interface MediaFile extends Omit<FileObject, 'metadata'> {
  metadata: {
    mimetype?: string;
    size?: number;
    [key: string]: any;
  };
}

const MediaPage: React.FC = () => {
  const [files, setFiles] = useState<FileObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const BUCKET_NAME = 'media';

  const listFiles = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage.from(BUCKET_NAME).list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      toast.error('Erro ao listar arquivos de mídia.');
      console.error('Error listing files:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    listFiles();
  }, [listFiles]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Selecione um arquivo para enviar.');
      return;
    }

    setUploading(true);
    try {
      const fileName = `${Date.now()}_${selectedFile.name.replace(/\s+/g, '_')}`;
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, selectedFile);

      if (error) throw error;

      toast.success('Arquivo enviado com sucesso!');
      setSelectedFile(null);
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      listFiles();
    } catch (error) {
      toast.error('Erro ao enviar arquivo.');
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o arquivo ${fileName}?`)) {
      return;
    }

    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([fileName]);

      if (error) throw error;

      toast.success('Arquivo excluído com sucesso!');
      listFiles();
    } catch (error) {
      toast.error('Erro ao excluir arquivo.');
      console.error('Error deleting file:', error);
    }
  };

  const getFileIcon = (metadata?: Record<string, any>) => {
    const mimeType = metadata?.mimetype as string | undefined;
    if (!mimeType) return <FileText className="w-6 h-6 text-gray-500" />;

    if (mimeType.startsWith('image/')) {
      return <Image className="w-6 h-6 text-blue-500" />;
    }
    if (mimeType.startsWith('video/')) {
      return <Video className="w-6 h-6 text-red-500" />;
    }
    if (mimeType.startsWith('audio/')) {
      return <Music className="w-6 h-6 text-purple-500" />;
    }
    return <FileText className="w-6 h-6 text-gray-500" />;
  };

  const formatBytes = (metadata?: Record<string, any>, decimals = 2) => {
    const bytes = metadata?.size as number | undefined;
    if (bytes === undefined || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800">Gerenciamento de Mídia</h1>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Upload de Arquivo</h2>
        <div className="flex items-center space-x-4">
          <label htmlFor="file-upload" className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors">
            Selecionar Arquivo
          </label>
          <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
          {selectedFile && (
            <span className="text-sm text-gray-600">{selectedFile.name}</span>
          )}
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors text-white ${
              !selectedFile || uploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Enviando...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Enviar
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <h2 className="text-lg font-medium text-gray-700 px-6 py-4 border-b border-gray-200">Arquivos Enviados</h2>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : files.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Nenhum arquivo encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tamanho</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enviado em</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {files.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-3 flex-shrink-0">
                          {getFileIcon(file.metadata)}
                        </div>
                        <span className="text-sm font-medium text-gray-900 truncate" style={{maxWidth: '300px'}} title={file.name}>
                          {file.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.metadata?.mimetype ?? 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatBytes(file.metadata)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {file.created_at ? new Date(file.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(file.name)}
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
    </div>
  );
};

export default MediaPage;