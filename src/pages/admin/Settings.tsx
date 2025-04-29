import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import { Save, Loader, Shield, Mail, Bell, Database, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface Settings {
  id: string;
  security: {
    max_login_attempts: number;
    password_expiry_days: number;
    session_timeout_minutes: number;
  };
  notifications: {
    email_notifications: boolean;
    admin_notifications: boolean;
    system_notifications: boolean;
  };
  system: {
    maintenance_mode: boolean;
    debug_mode: boolean;
    cache_ttl_minutes: number;
  };
  created_at: string;
  updated_at: string;
}

const defaultSettings: Omit<Settings, 'id' | 'created_at' | 'updated_at'> = {
  security: {
    max_login_attempts: 5,
    password_expiry_days: 90,
    session_timeout_minutes: 60
  },
  notifications: {
    email_notifications: true,
    admin_notifications: true,
    system_notifications: true
  },
  system: {
    maintenance_mode: false,
    debug_mode: false,
    cache_ttl_minutes: 60
  }
};

const Settings = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setSettings(data);
      } else {
        // Criar configurações padrão se não existirem
        const { data: newData, error: insertError } = await supabase
          .from('site_settings')
          .insert([defaultSettings])
          .select()
          .single();

        if (insertError) throw insertError;
        setSettings(newData);
      }
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
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          ...settings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('Configurações salvas com sucesso');
      await fetchSettings();
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (settings) {
      setSettings({
        ...settings,
        ...defaultSettings
      });
      toast.success('Configurações restauradas para o padrão');
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
          <h1 className="text-2xl font-bold text-gray-800">Configurações do Sistema</h1>
          <button
            onClick={handleReset}
            className="text-gray-600 hover:text-gray-800 transition-colors flex items-center"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Restaurar Padrões
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Security Settings */}
          <section className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center space-x-2 mb-6">
              <Shield className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold">Segurança</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Máximo de Tentativas de Login
                </label>
                <input
                  type="number"
                  value={settings.security.max_login_attempts}
                  onChange={(e) => setSettings({
                    ...settings,
                    security: {
                      ...settings.security,
                      max_login_attempts: parseInt(e.target.value)
                    }
                  })}
                  className="w-full px-3 py-2 border rounded-md"
                  min="1"
                  max="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiração de Senha (dias)
                </label>
                <input
                  type="number"
                  value={settings.security.password_expiry_days}
                  onChange={(e) => setSettings({
                    ...settings,
                    security: {
                      ...settings.security,
                      password_expiry_days: parseInt(e.target.value)
                    }
                  })}
                  className="w-full px-3 py-2 border rounded-md"
                  min="30"
                  max="365"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timeout da Sessão (minutos)
                </label>
                <input
                  type="number"
                  value={settings.security.session_timeout_minutes}
                  onChange={(e) => setSettings({
                    ...settings,
                    security: {
                      ...settings.security,
                      session_timeout_minutes: parseInt(e.target.value)
                    }
                  })}
                  className="w-full px-3 py-2 border rounded-md"
                  min="15"
                  max="240"
                />
              </div>
            </div>
          </section>

          {/* Notification Settings */}
          <section className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center space-x-2 mb-6">
              <Bell className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold">Notificações</h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.notifications.email_notifications}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      email_notifications: e.target.checked
                    }
                  })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">
                  Notificações por Email
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.notifications.admin_notifications}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      admin_notifications: e.target.checked
                    }
                  })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">
                  Notificações para Administradores
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.notifications.system_notifications}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      system_notifications: e.target.checked
                    }
                  })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">
                  Notificações do Sistema
                </span>
              </label>
            </div>
          </section>

          {/* System Settings */}
          <section className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center space-x-2 mb-6">
              <Database className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold">Sistema</h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.system.maintenance_mode}
                  onChange={(e) => setSettings({
                    ...settings,
                    system: {
                      ...settings.system,
                      maintenance_mode: e.target.checked
                    }
                  })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">
                  Modo de Manutenção
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.system.debug_mode}
                  onChange={(e) => setSettings({
                    ...settings,
                    system: {
                      ...settings.system,
                      debug_mode: e.target.checked
                    }
                  })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">
                  Modo de Debug
                </span>
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TTL do Cache (minutos)
                </label>
                <input
                  type="number"
                  value={settings.system.cache_ttl_minutes}
                  onChange={(e) => setSettings({
                    ...settings,
                    system: {
                      ...settings.system,
                      cache_ttl_minutes: parseInt(e.target.value)
                    }
                  })}
                  className="w-full px-3 py-2 border rounded-md"
                  min="5"
                  max="1440"
                />
              </div>
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

export default Settings;