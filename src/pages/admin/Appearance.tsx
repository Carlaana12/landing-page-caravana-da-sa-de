import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { Save, Palette, Image as ImageIcon, Type, Upload } from 'lucide-react';

interface AppearanceSettings {
  id: number; // Geralmente 1
  primary_color: string;
  secondary_color: string;
  logo_url: string;
  favicon_url: string;
  font_family: string;
  // Adicione outros campos de aparência conforme necessário
}

const FONT_OPTIONS = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat'
  // Adicione outras fontes web-safe ou do seu projeto
];

const AppearancePage: React.FC = () => {
  const [settings, setSettings] = useState<Partial<AppearanceSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  const SETTINGS_ID = 1; // ID fixo
  const BUCKET_NAME = 'theme'; // Bucket para logo/favicon

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('appearance_settings') // Nome da sua tabela de aparência
        .select('*')
        .eq('id', SETTINGS_ID)
        .single();

      if (error && error.code !== 'PGRST116') { throw error; }
      setSettings(data || {
        primary_color: '#408040', // Verde CIA Padrão
        secondary_color: '#666666', // Cinza Padrão
        font_family: 'Inter', // Fonte Padrão
      });
    } catch (error) {
      toast.error('Erro ao carregar configurações de aparência.');
      console.error('Error fetching appearance settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (file: File, type: 'logo' | 'favicon') => {
    if (!file) return;

    const isLogo = type === 'logo';
    if (isLogo) setUploadingLogo(true); else setUploadingFavicon(true);

    try {
      // Validação simples de tipo (pode ser mais robusta)
      if (!file.type.startsWith('image/')) {
        throw new Error('Tipo de arquivo inválido. Selecione uma imagem.');
      }

      const fileName = `${type}_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, { upsert: true }); // upsert para sobrescrever se necessário

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

      if (!publicUrlData?.publicUrl) {
         throw new Error('Não foi possível obter a URL pública do arquivo.');
      }

      // Atualizar o estado
      setSettings(prev => ({ ...prev, [isLogo ? 'logo_url' : 'favicon_url']: publicUrlData.publicUrl }));
      toast.success(`${isLogo ? 'Logo' : 'Favicon'} enviado com sucesso!`);

    } catch (error) {
      toast.error(`Erro ao enviar ${isLogo ? 'logo' : 'favicon'}: ${(error as Error).message}`);
      console.error(`Error uploading ${type}:`, error);
    } finally {
      if (isLogo) setUploadingLogo(false); else setUploadingFavicon(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from('appearance_settings')
        .upsert({ ...settings, id: SETTINGS_ID });

      if (error) throw error;
      toast.success('Configurações de aparência salvas com sucesso!');
       // Opcional: Forçar recarregamento da página para aplicar mudanças visuais globais
      // window.location.reload();
    } catch (error) {
      toast.error(`Erro ao salvar configurações: ${(error as Error).message}`);
      console.error('Error saving appearance settings:', error);
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
        <Palette className="w-6 h-6 mr-2" />
        Aparência do Site
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">

        {/* Cores */}
        <section>
          <h2 className="text-lg font-medium text-gray-700 mb-4">Cores Principais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="primary_color" className="block text-sm font-medium text-gray-700 mb-1">Cor Primária</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  id="primary_color"
                  name="primary_color"
                  value={settings.primary_color || '#408040'}
                  onChange={handleInputChange}
                  className="h-10 w-10 rounded border border-gray-300 cursor-pointer"
                />
                 <input
                  type="text"
                  value={settings.primary_color || '#408040'}
                  onChange={handleInputChange}
                  name="primary_color"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Usada em botões principais, links, etc.</p>
            </div>
            <div>
              <label htmlFor="secondary_color" className="block text-sm font-medium text-gray-700 mb-1">Cor Secundária</label>
               <div className="flex items-center space-x-2">
                <input
                  type="color"
                  id="secondary_color"
                  name="secondary_color"
                  value={settings.secondary_color || '#666666'}
                  onChange={handleInputChange}
                  className="h-10 w-10 rounded border border-gray-300 cursor-pointer"
                />
                 <input
                  type="text"
                  value={settings.secondary_color || '#666666'}
                  onChange={handleInputChange}
                  name="secondary_color"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Usada em textos, bordas, elementos de suporte.</p>
            </div>
          </div>
        </section>

         {/* Fontes */}
        <section>
          <h2 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
             <Type className="w-5 h-5 mr-2"/>
             Tipografia
          </h2>
          <div>
             <label htmlFor="font_family" className="block text-sm font-medium text-gray-700 mb-1">Fonte Principal</label>
             <select
               id="font_family"
               name="font_family"
               value={settings.font_family || 'Inter'}
               onChange={handleInputChange}
               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
             >
               {FONT_OPTIONS.map(font => (
                 <option key={font} value={font}>{font}</option>
               ))}
             </select>
             <p className="text-xs text-gray-500 mt-1">Fonte usada no corpo do texto e títulos.</p>
          </div>
        </section>

        {/* Logo e Favicon */}
        <section>
          <h2 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
            <ImageIcon className="w-5 h-5 mr-2" />
            Logo e Favicon
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
              <div className="flex items-center space-x-4">
                {settings.logo_url ? (
                  <img src={settings.logo_url} alt="Logo Preview" className="h-12 max-w-[150px] object-contain border p-1 rounded" />
                ) : (
                  <div className="h-12 w-24 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">Sem logo</div>
                )}
                <label htmlFor="logo-upload" className={`cursor-pointer flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 ${
                    uploadingLogo ? 'opacity-50 cursor-not-allowed' : ''
                }`}>
                   {uploadingLogo ? (
                     <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                   ) : (
                     <Upload className="w-4 h-4 mr-2"/>
                   )}
                  {uploadingLogo ? 'Enviando...' : 'Trocar Logo'}
                </label>
                <input
                    id="logo-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], 'logo')}
                    disabled={uploadingLogo}
                />
              </div>
               <p className="text-xs text-gray-500 mt-1">Envie o arquivo da sua logo (PNG, JPG, SVG).</p>
            </div>

             {/* Favicon Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Favicon</label>
               <div className="flex items-center space-x-4">
                {settings.favicon_url ? (
                  <img src={settings.favicon_url} alt="Favicon Preview" className="h-8 w-8 object-contain border p-1 rounded" />
                ) : (
                  <div className="h-8 w-8 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">...</div>
                )}
                 <label htmlFor="favicon-upload" className={`cursor-pointer flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 ${
                     uploadingFavicon ? 'opacity-50 cursor-not-allowed' : ''
                 }`}>
                    {uploadingFavicon ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                    ) : (
                      <Upload className="w-4 h-4 mr-2"/>
                    )}
                   {uploadingFavicon ? 'Enviando...' : 'Trocar Favicon'}
                 </label>
                 <input
                     id="favicon-upload"
                     type="file"
                     className="hidden"
                     accept="image/png, image/x-icon, image/vnd.microsoft.icon"
                     onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], 'favicon')}
                     disabled={uploadingFavicon}
                 />
               </div>
              <p className="text-xs text-gray-500 mt-1">Ícone para a aba do navegador (ICO, PNG).</p>
            </div>
          </div>
        </section>

        {/* Botão Salvar */}
        <div className="pt-6 flex justify-end border-t border-gray-200 mt-6">
          <button
            type="submit"
            disabled={saving || uploadingLogo || uploadingFavicon}
            className={`flex items-center justify-center px-6 py-2 text-sm font-medium text-white rounded-md transition-colors ${
              saving || uploadingLogo || uploadingFavicon ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Salvar Aparência
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppearancePage;