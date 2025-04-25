import { useState } from 'react';

export default function Settings() {
  const [settings, setSettings] = useState({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: ''
    }
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Configurações do Site</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Site
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição do Site
            </label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              className="w-full p-2 border rounded-md"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email de Contato
            </label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Redes Sociais</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook
                </label>
                <input
                  type="text"
                  value={settings.socialMedia.facebook}
                  onChange={(e) => setSettings({
                    ...settings,
                    socialMedia: { ...settings.socialMedia, facebook: e.target.value }
                  })}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <input
                  type="text"
                  value={settings.socialMedia.instagram}
                  onChange={(e) => setSettings({
                    ...settings,
                    socialMedia: { ...settings.socialMedia, instagram: e.target.value }
                  })}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter
                </label>
                <input
                  type="text"
                  value={settings.socialMedia.twitter}
                  onChange={(e) => setSettings({
                    ...settings,
                    socialMedia: { ...settings.socialMedia, twitter: e.target.value }
                  })}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button className="bg-verde-cia text-white px-4 py-2 rounded-lg hover:bg-verde-cia-dark">
              Salvar Configurações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 