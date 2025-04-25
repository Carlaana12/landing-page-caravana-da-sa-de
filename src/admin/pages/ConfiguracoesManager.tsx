import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Save, Settings } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Configuracao {
  id: string;
  chave: string;
  valor: string | number | boolean | object;
  descricao?: string;
}

const ConfiguracoesManager: React.FC = () => {
  const [configuracoes, setConfiguracoes] = useState<Configuracao[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfiguracoes();
  }, []);

  const fetchConfiguracoes = async () => {
    try {
      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .order('chave', { ascending: true });

      if (error) throw error;
      setConfiguracoes(data || []);
    } catch (error) {
      toast.error('Erro ao carregar configurações');
      console.error('Error fetching configuracoes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (config: Configuracao) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('configuracoes')
        .update({ valor: config.valor })
        .eq('id', config.id);

      if (error) throw error;

      toast.success('Configuração salva com sucesso');
    } catch (error) {
      toast.error('Erro ao salvar configuração');
      console.error('Error saving config:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleValueChange = (id: string, newValue: string | number | boolean) => {
    setConfiguracoes(configuracoes.map(config => 
      config.id === id ? { ...config, valor: newValue } : config
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6 text-gray-600" />
        <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="space-y-6">
          {/* Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {configuracoes.map((config) => (
              <div key={config.id} className="bg-white p-6 shadow-lg rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{config.chave}</h3>
                    {config.descricao && (
                      <p className="text-sm text-gray-600">{config.descricao}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleSave(config)}
                    disabled={saving}
                    className="flex items-center gap-2 bg-verde-cia text-white px-4 py-2 rounded-lg hover:bg-verde-cia-dark transition-colors disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>

                {typeof config.valor === 'boolean' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={config.valor as boolean}
                      onChange={(e) => handleValueChange(config.id, e.target.checked)}
                      className="h-4 w-4 text-verde-cia focus:ring-verde-cia border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">
                      {config.valor ? 'Ativado' : 'Desativado'}
                    </span>
                  </div>
                ) : typeof config.valor === 'number' ? (
                  <input
                    type="number"
                    value={config.valor as number}
                    onChange={(e) => handleValueChange(config.id, Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-verde-cia focus:border-verde-cia"
                  />
                ) : (
                  <input
                    type="text"
                    value={config.valor as string}
                    onChange={(e) => handleValueChange(config.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-verde-cia focus:border-verde-cia"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracoesManager;
