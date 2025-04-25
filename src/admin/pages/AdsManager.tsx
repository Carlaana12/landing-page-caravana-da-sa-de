import { useState } from 'react';

export default function AdsManager() {
  const [ads, setAds] = useState([]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gerenciador de Anúncios</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Anúncios Ativos</h2>
          <button className="bg-verde-cia text-white px-4 py-2 rounded-lg hover:bg-verde-cia-dark">
            Adicionar Anúncio
          </button>
        </div>
        <div className="space-y-4">
          {ads.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Nenhum anúncio cadastrado
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Lista de anúncios será renderizada aqui */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 