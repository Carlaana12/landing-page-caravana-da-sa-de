import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Edit2, Save, X, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { Outlet } from 'react-router-dom';
import { HexColorPicker } from 'react-colorful';
import ImageUploader from '../../components/admin/ImageUploader';

interface AdminAd {
  id: string;
  titulo: string;
  cor_titulo: string;
  imagens: {
    url: string;
    titulo: string;
    cor_titulo: string;
    subtitulo: string;
    cor_subtitulo: string;
    frase_menor: string;
    cor_frase_menor: string;
    texto_extra: string;
  }[];
  criado_em: string;
  atualizado_em: string;
  divulgado: boolean;
}

const defaultForm = {
  titulo: '',
  cor_titulo: '#00FF00',
  imagens: [
    {
      url: '',
      titulo: '',
      cor_titulo: '#00FF00',
      subtitulo: '',
      cor_subtitulo: '#00FF00',
      frase_menor: '',
      cor_frase_menor: '#00FF00',
      texto_extra: ''
    }
  ]
};

const AdsManager = () => {
  const [ads, setAds] = useState<AdminAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({ ...defaultForm });
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('admin_ads')
      .select('*')
      .order('criado_em', { ascending: false });
    if (!error && data) setAds(data);
    setLoading(false);
  };

  const salvarAnunciosExistentes = async () => {
    const anunciosExistentes = [
      {
        titulo: "ANUNCIE SEU CONSULTÓRIO!",
        cor_titulo: "#00ff00",
        imagens: ["https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=2000"],
        subtitulo: "Alcance mais pacientes",
        cor_subtitulo: "#00ff00",
        frase_menor: "ANUNCIE AQUI!",
        cor_frase_menor: "#00ff00",
        texto_extra: "Destaque-se no mercado e alcance mais pacientes com sua presença digital."
      },
      {
        titulo: "PROMOVA SEUS SERVIÇOS!",
        cor_titulo: "#00ff00",
        imagens: ["https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=2000"],
        subtitulo: "Destaque-se no mercado",
        cor_subtitulo: "#00ff00",
        frase_menor: "SE CONECTE!",
        cor_frase_menor: "#00ff00",
        texto_extra: "Conecte-se com pacientes e expanda sua rede profissional."
      },
      {
        titulo: "AUMENTE SUA VISIBILIDADE!",
        cor_titulo: "#00ff00",
        imagens: ["https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=2000"],
        subtitulo: "Cresça seu negócio",
        cor_subtitulo: "#00ff00",
        frase_menor: "DESTAQUE-SE!",
        cor_frase_menor: "#00ff00",
        texto_extra: "Aumente sua visibilidade e atraia mais pacientes para seu consultório."
      }
    ];

    setLoading(true);
    try {
      for (const anuncio of anunciosExistentes) {
        await supabase
          .from('admin_ads')
          .insert([{
            ...anuncio,
            criado_em: new Date().toISOString(),
            atualizado_em: new Date().toISOString(),
            divulgado: false
          }]);
      }
      toast.success('Anúncios existentes salvos com sucesso!');
      fetchAds();
    } catch (error) {
      toast.error('Erro ao salvar anúncios existentes');
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (editing) {
      await supabase
        .from('admin_ads')
        .update({ ...formData, atualizado_em: new Date().toISOString() })
        .eq('id', editing);
      toast.success('Anúncio atualizado!');
    } else {
      await supabase
        .from('admin_ads')
        .insert([{ ...formData, criado_em: new Date().toISOString(), atualizado_em: new Date().toISOString(), divulgado: false }]);
      toast.success('Anúncio criado!');
    }
    setEditing(null);
    setFormData({ ...defaultForm });
    fetchAds();
    setLoading(false);
  };

  const handleEdit = (ad: AdminAd) => {
    setEditing(ad.id);
    setFormData({
      titulo: ad.titulo,
      cor_titulo: ad.cor_titulo,
      imagens: ad.imagens || [],
      subtitulo: ad.subtitulo,
      cor_subtitulo: ad.cor_subtitulo,
      frase_menor: ad.frase_menor,
      cor_frase_menor: ad.cor_frase_menor,
      texto_extra: ad.texto_extra,
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Excluir este anúncio?')) return;
    setLoading(true);
    await supabase.from('admin_ads').delete().eq('id', id);
    toast.success('Anúncio excluído!');
    fetchAds();
    setLoading(false);
  };

  const handleDivulgar = async (id: string) => {
    setLoading(true);
    // Desativa todos
    await supabase.from('admin_ads').update({ divulgado: false }).neq('id', id);
    // Ativa o escolhido
    await supabase.from('admin_ads').update({ divulgado: true }).eq('id', id);
    toast.success('Anúncio divulgado!');
    fetchAds();
    setLoading(false);
  };

  const handleAddImage = () => {
    if (formData.imagens.length < 4) {
      setFormData(f => ({
        ...f,
        imagens: [
          ...f.imagens,
          {
            url: '',
            titulo: '',
            cor_titulo: '#00FF00',
            subtitulo: '',
            cor_subtitulo: '#00FF00',
            frase_menor: '',
            cor_frase_menor: '#00FF00',
            texto_extra: ''
          }
        ]
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(f => ({
      ...f,
      imagens: f.imagens.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (index: number, field: string, value: string) => {
    setFormData(f => ({
      ...f,
      imagens: f.imagens.map((img, i) => 
        i === index ? { ...img, [field]: value } : img
      )
    }));
  };

  if (loading) {
    return <div className="text-center py-4">Carregando...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-extrabold mb-8 text-[#3a7bd5] drop-shadow-lg">Painel de Anúncios</h2>
      <div className="mb-6">
        <button
          onClick={salvarAnunciosExistentes}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Salvar Anúncios Existentes
        </button>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-8 space-y-4">
        <div>
          <label className="block font-bold mb-1">Título do anúncio</label>
          <div className="flex items-center gap-2">
            <input type="text" className="border rounded px-3 py-2 flex-1" value={formData.titulo} onChange={e => setFormData(f => ({ ...f, titulo: e.target.value }))} required />
            <button type="button" className="w-8 h-8 rounded border" style={{ background: formData.cor_titulo }} onClick={() => setShowColorPicker(showColorPicker === 'titulo' ? null : 'titulo')}></button>
            {showColorPicker === 'titulo' && (
              <div className="absolute z-50 mt-2"><HexColorPicker color={formData.cor_titulo} onChange={color => setFormData(f => ({ ...f, cor_titulo: color }))} /></div>
            )}
          </div>
        </div>
        <div>
          <label className="block font-bold mb-1">Imagens do anúncio (até 4)</label>
          {formData.imagens.map((imagem, idx) => (
            <div key={idx} className="border rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Imagem {idx + 1}</h3>
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  {imagem.url ? (
                    <img src={imagem.url} alt="Preview" className="w-full h-48 object-cover rounded-lg mb-2" />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 mb-2">
                      Sem imagem
                    </div>
                  )}
                  <ImageUploader onUpload={url => handleImageChange(idx, 'url', url)} />
                  <input
                    type="url"
                    placeholder="Ou cole o link da imagem"
                    className="border rounded px-3 py-2 w-full mt-2"
                    value={imagem.url}
                    onChange={e => handleImageChange(idx, 'url', e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Título</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        className="border rounded px-3 py-2 flex-1"
                        value={imagem.titulo}
                        onChange={e => handleImageChange(idx, 'titulo', e.target.value)}
                      />
                      <button
                        type="button"
                        className="w-8 h-8 rounded border"
                        style={{ background: imagem.cor_titulo }}
                        onClick={() => setShowColorPicker(`titulo_${idx}`)}
                      ></button>
                      {showColorPicker === `titulo_${idx}` && (
                        <div className="absolute z-50 mt-2">
                          <HexColorPicker
                            color={imagem.cor_titulo}
                            onChange={color => handleImageChange(idx, 'cor_titulo', color)}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Subtítulo</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        className="border rounded px-3 py-2 flex-1"
                        value={imagem.subtitulo}
                        onChange={e => handleImageChange(idx, 'subtitulo', e.target.value)}
                      />
                      <button
                        type="button"
                        className="w-8 h-8 rounded border"
                        style={{ background: imagem.cor_subtitulo }}
                        onClick={() => setShowColorPicker(`subtitulo_${idx}`)}
                      ></button>
                      {showColorPicker === `subtitulo_${idx}` && (
                        <div className="absolute z-50 mt-2">
                          <HexColorPicker
                            color={imagem.cor_subtitulo}
                            onChange={color => handleImageChange(idx, 'cor_subtitulo', color)}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Frase menor</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        className="border rounded px-3 py-2 flex-1"
                        value={imagem.frase_menor}
                        onChange={e => handleImageChange(idx, 'frase_menor', e.target.value)}
                      />
                      <button
                        type="button"
                        className="w-8 h-8 rounded border"
                        style={{ background: imagem.cor_frase_menor }}
                        onClick={() => setShowColorPicker(`frase_menor_${idx}`)}
                      ></button>
                      {showColorPicker === `frase_menor_${idx}` && (
                        <div className="absolute z-50 mt-2">
                          <HexColorPicker
                            color={imagem.cor_frase_menor}
                            onChange={color => handleImageChange(idx, 'cor_frase_menor', color)}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Texto extra</label>
                    <textarea
                      className="border rounded px-3 py-2 w-full"
                      value={imagem.texto_extra}
                      onChange={e => handleImageChange(idx, 'texto_extra', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {formData.imagens.length < 4 && (
            <button
              type="button"
              onClick={handleAddImage}
              className="mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar mais imagem
            </button>
          )}
        </div>
        <div className="flex gap-2 mt-4">
          <button type="submit" className="bg-verde-cia text-white px-6 py-2 rounded font-bold flex items-center gap-2">
            <Save className="w-4 h-4" />
            {editing ? 'Salvar alterações' : 'Criar anúncio'}
          </button>
          {editing && (
            <button
              type="button"
              className="bg-gray-200 px-4 py-2 rounded"
              onClick={() => {
                setEditing(null);
                setFormData({ ...defaultForm });
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
      <h3 className="text-xl font-bold mb-4">Versões salvas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ads.map(ad => (
          <div key={ad.id} className={`rounded-xl shadow p-4 border ${ad.divulgado ? 'border-verde-cia' : 'border-gray-200'} bg-white flex flex-col gap-2`}>
            <div className="flex gap-2 items-center mb-2">
              <span className="font-bold text-lg" style={{ color: ad.cor_titulo }}>{ad.titulo}</span>
              {ad.divulgado && <span className="ml-2 px-2 py-1 bg-verde-cia text-white text-xs rounded">Divulgado</span>}
            </div>
            <div className="grid grid-cols-2 gap-1 mb-2">
              {ad.imagens.map((img, idx) => (
                <div key={idx} className="relative">
                  <img src={img.url} alt={img.titulo} className="w-full h-20 object-cover rounded border" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-white text-xs p-2 text-center">
                      <div style={{ color: img.cor_titulo }}>{img.titulo}</div>
                      <div style={{ color: img.cor_subtitulo }}>{img.subtitulo}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded flex items-center gap-1" onClick={() => handleEdit(ad)}>
                <Edit2 className="w-4 h-4" />Editar
              </button>
              <button className="bg-red-100 text-red-700 px-3 py-1 rounded flex items-center gap-1" onClick={() => handleDelete(ad.id)}>
                <Trash2 className="w-4 h-4" />Apagar
              </button>
              {!ad.divulgado && (
                <button className="bg-verde-cia text-white px-3 py-1 rounded flex items-center gap-1" onClick={() => handleDivulgar(ad.id)}>
                  Divulgar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdsManager;