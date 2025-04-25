import { useState } from 'react';

export default function Appearance() {
  const [theme, setTheme] = useState('light');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Aparência</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Configurações de Tema</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tema do Site
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="light">Claro</option>
              <option value="dark">Escuro</option>
              <option value="system">Sistema</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
} 