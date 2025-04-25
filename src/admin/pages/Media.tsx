import { useState } from 'react';

export default function Media() {
  const [media, setMedia] = useState([]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Biblioteca de Mídia</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Arquivos de Mídia</h2>
          <button className="bg-verde-cia text-white px-4 py-2 rounded-lg hover:bg-verde-cia-dark">
            Upload de Mídia
          </button>
        </div>
        <div className="space-y-4">
          {media.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Nenhum arquivo de mídia cadastrado
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Lista de arquivos de mídia será renderizada aqui */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 