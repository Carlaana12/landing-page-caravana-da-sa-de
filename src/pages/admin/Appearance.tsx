import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import { Save, Palette, Type, Layout as LayoutIcon, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useThemeStore, availableFonts } from '../../lib/theme';
import FontSelector from '../../components/FontSelector';

interface AppearanceSettings {
  id: string;
  theme_colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    baseFontSize: string;
    lineHeight: string;
  };
  spacing: {
    containerPadding: string;
    sectionSpacing: string;
  };
}

const defaultSettings: Omit<AppearanceSettings, 'id'> = {
  theme_colors: {
    primary: '#408040',
    secondary: '#1a3d1a',
    accent: '#66b366',
    text: '#1a1a1a',
    background: '#ffffff'
  },
  typography: {
    headingFont: 'Montserrat',
    bodyFont: 'Inter',
    baseFontSize: '16px',
    lineHeight: '1.5'
  },
  spacing: {
    containerPadding: '1rem',
    sectionSpacing: '4rem'
  }
};

const Appearance = () => {
  const [settings, setSettings] = useState<AppearanceSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { updateTheme } = useThemeStore();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_appearance')
        .select('*')
        .single();

      if (error) throw error;
      setSettings(data || { id: '', ...defaultSettings });
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      await updateTheme({
        colors: settings.theme_colors,
        typography: settings.typography,
        spacing: settings.spacing
      });
      toast.success('Configurações salvas com sucesso');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      await updateTheme(defaultSettings);
      setSettings({ ...settings, ...defaultSettings });
      toast.success('Configurações restauradas para o padrão');
    } catch (error) {
      console.error('Erro ao restaurar configurações:', error);
      toast.error('Erro ao restaurar configurações');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader className="w-8 h-8 animate-spin text-verde-cia" />
        </div>
      </AdminLayout>
    );
  }

  if (!settings) {
    return (
      <AdminLayout>
        <div className="text-center py-4 text-red-600">
          Erro ao carregar configurações
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Configurações de Aparência</h1>
          <button
            onClick={handleReset}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Restaurar Padrões
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Colors */}
          <section className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center space-x-2 mb-6">
              <Palette className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold">Cores do Tema</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(settings.theme_colors).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          theme_colors: {
                            ...settings.theme_colors,
                            [key]: e.target.value
                          }
                        })
                      }
                      className="h-10 w-20"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          theme_colors: {
                            ...settings.theme_colors,
                            [key]: e.target.value
                          }
                        })
                      }
                      className="flex-1 px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Typography */}
          <section className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center space-x-2 mb-6">
              <Type className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold">Tipografia</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fonte dos Títulos
                </label>
                <FontSelector
                  fonts={availableFonts.heading}
                  selectedFont={settings.typography.headingFont}
                  onChange={(font) =>
                    setSettings({
                      ...settings,
                      typography: {
                        ...settings.typography,
                        headingFont: font
                      }
                    })
                  }
                  category="heading"
                  previewText="Títulos e Cabeçalhos"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fonte do Corpo
                </label>
                <FontSelector
                  fonts={availableFonts.body}
                  selectedFont={settings.typography.bodyFont}
                  onChange={(font) =>
                    setSettings({
                      ...settings,
                      typography: {
                        ...settings.typography,
                        bodyFont: font
                      }
                    })
                  }
                  category="body"
                  previewText="Texto do corpo do site"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tamanho Base da Fonte
                </label>
                <select
                  value={settings.typography.baseFontSize}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      typography: {
                        ...settings.typography,
                        baseFontSize: e.target.value
                      }
                    })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {['14px', '15px', '16px', '17px', '18px'].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Altura da Linha
                </label>
                <select
                  value={settings.typography.lineHeight}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      typography: {
                        ...settings.typography,
                        lineHeight: e.target.value
                      }
                    })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {['1.4', '1.5', '1.6', '1.7', '1.8'].map((height) => (
                    <option key={height} value={height}>
                      {height}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Spacing */}
          <section className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center space-x-2 mb-6">
              <LayoutIcon className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold">Espaçamento</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(settings.spacing).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        spacing: {
                          ...settings.spacing,
                          [key]: e.target.value
                        }
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              ))}
            </div>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-verde-cia text-white rounded-lg hover:bg-verde-cia-escuro transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Salvar Alterações</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default Appearance;