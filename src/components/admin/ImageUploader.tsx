import React, { useState } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import { uploadImage } from '../../lib/storage';
import toast from 'react-hot-toast';

interface ImageUploaderProps {
  onUpload: (url: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const url = await uploadImage(file);
      onUpload(url);
      toast.success('Imagem enviada com sucesso');
    } catch (error) {
      toast.error('Erro ao enviar imagem');
    } finally {
      setUploading(false);
    }
  };

  return (
    <label className={`
      flex items-center justify-center w-full h-32 
      border-2 border-dashed rounded-lg 
      cursor-pointer hover:bg-gray-50 transition-colors
      ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
    `}>
      <input
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
        disabled={uploading}
      />
      <div className="flex flex-col items-center">
        {uploading ? (
          <>
            <Loader className="w-8 h-8 animate-spin text-verde-cia mb-2" />
            <span className="text-sm text-gray-500">Enviando...</span>
          </>
        ) : (
          <>
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Clique para enviar uma imagem</span>
          </>
        )}
      </div>
    </label>
  );
};

export default ImageUploader;