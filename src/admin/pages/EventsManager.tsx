import { useState } from 'react';

export default function EventsManager() {
  const [events, setEvents] = useState([]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gerenciador de Eventos</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Eventos Cadastrados</h2>
          <button className="bg-verde-cia text-white px-4 py-2 rounded-lg hover:bg-verde-cia-dark">
            Adicionar Evento
          </button>
        </div>
        <div className="space-y-4">
          {events.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Nenhum evento cadastrado
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Lista de eventos será renderizada aqui */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 