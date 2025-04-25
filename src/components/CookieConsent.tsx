import React, { useState, useEffect } from 'react';
import { X, Cookie, Settings } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieConsent: React.FC = () => {
  const [showConsent, setShowConsent] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'true') {
      setShowConsent(false);
    } else {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    setShowConsent(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'true');
    localStorage.setItem('cookiePreferences', JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false
    }));
    setShowConsent(false);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!showConsent) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 z-[99999]"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      style={{ 
        animation: 'slideUp 0.3s ease-out',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
        transform: 'translateY(0)',
        transition: 'transform 0.3s ease-out'
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <Cookie className="h-6 w-6 text-verde-cia mr-2" />
            <h2 id="cookie-consent-title" className="text-lg font-semibold text-gray-800">
              Configurações de Cookies
            </h2>
          </div>
          <button
            onClick={() => setShowConsent(false)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 text-sm">
            Nós utilizamos cookies para melhorar sua experiência no site. Alguns cookies são necessários para o funcionamento do site, enquanto outros nos ajudam a entender como você interage com ele.
          </p>
        </div>

        {showSettings && (
          <div className="mb-4 space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-800">Cookies Necessários</h3>
                <p className="text-sm text-gray-600">Essenciais para o funcionamento do site</p>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Sempre ativo</span>
                <div className="w-10 h-6 bg-verde-cia rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-800">Cookies de Análise</h3>
                <p className="text-sm text-gray-600">Nos ajudam a entender como você usa o site</p>
              </div>
              <button
                onClick={() => togglePreference('analytics')}
                className={`w-10 h-6 rounded-full transition-colors ${
                  preferences.analytics ? 'bg-verde-cia' : 'bg-gray-300'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
                  preferences.analytics ? 'translate-x-4' : 'translate-x-1'
                }`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-800">Cookies de Marketing</h3>
                <p className="text-sm text-gray-600">Personalizam sua experiência com anúncios</p>
              </div>
              <button
                onClick={() => togglePreference('marketing')}
                className={`w-10 h-6 rounded-full transition-colors ${
                  preferences.marketing ? 'bg-verde-cia' : 'bg-gray-300'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
                  preferences.marketing ? 'translate-x-4' : 'translate-x-1'
                }`}></div>
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center text-verde-cia hover:text-verde-cia-dark text-sm"
          >
            <Settings className="h-4 w-4 mr-1" />
            {showSettings ? 'Ocultar configurações' : 'Personalizar cookies'}
          </button>

          <div className="flex space-x-3">
            <button
              onClick={handleReject}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Rejeitar
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 bg-verde-cia hover:bg-verde-cia-dark text-white text-sm font-medium rounded-md transition-colors"
            >
              Aceitar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent; 