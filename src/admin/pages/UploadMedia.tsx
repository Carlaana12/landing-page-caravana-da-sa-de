import { useState } from 'react';

export default function UploadMedia() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      // Aqui será implementada a lógica de upload
      console.log('Uploading file:', file.name);
      // Simulando upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Arquivo enviado com sucesso!');
      setFile(null);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload do arquivo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Upload de Mídia</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecione o arquivo
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-md"
              accept="image/*,video/*,audio/*"
            />
          </div>
          {file && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Arquivo selecionado: {file.name}
              </p>
              <p className="text-xs text-gray-500">
                Tamanho: {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
          <div className="flex justify-end">
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="bg-verde-cia text-white px-4 py-2 rounded-lg hover:bg-verde-cia-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Enviando...' : 'Enviar Arquivo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 