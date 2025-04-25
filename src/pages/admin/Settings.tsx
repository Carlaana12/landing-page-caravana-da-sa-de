import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { Save, Settings as SettingsIcon, Mail, Phone, Info, Lock } from 'lucide-react';

interface AppSettings {
  id: number; // Geralmente 1 para a única linha de configurações
  site_name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  maintenance_mode: boolean;
  // Adicione outros campos de configuração conforme necessário
}

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Partial<AppSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const SETTINGS_ID = 1; // ID fixo para a linha de configurações

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('app_settings') // Nome da sua tabela de configurações
        .select('*')
        .eq('id', SETTINGS_ID)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116: No rows found
        throw error;
      }
      setSettings(data || {});
    } catch (error) {
      toast.error('Erro ao carregar configurações.');
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const inputValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;
    setSettings(prev => ({ ...prev, [name]: inputValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert({ ...settings, id: SETTINGS_ID }); // Upsert para criar ou atualizar

      if (error) throw error;
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error(`Erro ao salvar configurações: ${(error as Error).message}`);
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 flex items-center">
        <SettingsIcon className="w-6 h-6 mr-2" />
        Configurações Gerais
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">

        {/* Informações Gerais */}
        <section>
          <h2 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2 text-blue-600" />
            Informações do Site
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="site_name" className="block text-sm font-medium text-gray-700 mb-1">Nome do Site</label>
              <input
                type="text"
                id="site_name"
                name="site_name"
                value={settings.site_name || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
             {/* Adicionar mais campos gerais aqui, se necessário */}
          </div>
        </section>

        {/* Contato */}
        <section>
          <h2 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
            <Mail className="w-5 h-5 mr-2 text-green-600" />
            Informações de Contato
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-1">Email de Contato</label>
              <input
                type="email"
                id="contact_email"
                name="contact_email"
                value={settings.contact_email || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-1">Telefone de Contato</label>
              <input
                type="tel"
                id="contact_phone"
                name="contact_phone"
                value={settings.contact_phone || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
              <textarea
                id="address"
                name="address"
                rows={3}
                value={settings.address || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
          </div>
        </section>

        {/* Manutenção */}
        <section>
           <h2 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
            <Lock className="w-5 h-5 mr-2 text-red-600" />
            Modo Manutenção
          </h2>
           <div className="flex items-center">
              <input
                type="checkbox"
                id="maintenance_mode"
                name="maintenance_mode"
                checked={settings.maintenance_mode || false}
                onChange={handleInputChange}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="maintenance_mode" className="ml-2 block text-sm text-gray-900">
                Ativar modo manutenção (o site ficará indisponível para visitantes)
              </label>
            </div>
        </section>

        {/* Botão Salvar */}
        <div className="pt-6 flex justify-end border-t border-gray-200 mt-6">
          <button
            type="submit"
            disabled={saving}
            className={`flex items-center justify-center px-6 py-2 text-sm font-medium text-white rounded-md transition-colors ${
              saving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Salvar Configurações
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;