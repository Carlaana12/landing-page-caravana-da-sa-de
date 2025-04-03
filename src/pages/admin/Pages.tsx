import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Search, Calendar, Eye, EyeOff, Trash2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import slugify from 'slugify';
import PageEditor from '../../components/admin/PageEditor';
import PagePreview from '../../components/admin/PagePreview';
import CategoryTagManager from '../../components/admin/CategoryTagManager';
import PageComponentManager from '../../components/admin/PageComponentManager';

const Pages = () => {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: {
      sections: [{
        type: 'content',
        content: ''
      }]
    },
    meta_description: '',
    is_published: false,
    publish_date: ''
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('site_pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast.error('Erro ao carregar páginas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const pageData = {
        ...formData,
        slug: slugify(formData.slug || formData.title, { lower: true, strict: true })
      };

      if (editing) {
        const { error } = await supabase
          .from('site_pages')
          .update(pageData)
          .eq('id', editing);

        if (error) throw error;
        toast.success('Página atualizada com sucesso');
      } else {
        const { error } = await supabase
          .from('site_pages')
          .insert([pageData]);

        if (error) throw error;
        toast.success('Página criada com sucesso');
      }

      setEditing(null);
      setFormData({
        title: '',
        slug: '',
        content: {
          sections: [{
            type: 'content',
            content: ''
          }]
        },
        meta_description: '',
        is_published: false,
        publish_date: ''
      });
      fetchPages();
    } catch (error) {
      console.error('Error saving page:', error);
      toast.error('Erro ao salvar página');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta página?')) return;

    try {
      const { error } = await supabase
        .from('site_pages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Página excluída com sucesso');
      fetchPages();
    } catch (error) {
      console.error('Error deleting page:', error);
      toast.error('Erro ao excluir página');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-4">Carregando...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Gerenciar Páginas</h1>
          <button
            onClick={() => {
              setEditing(null);
              setFormData({
                title: '',
                slug: '',
                content: {
                  sections: [{
                    type: 'content',
                    content: ''
                  }]
                },
                meta_description: '',
                is_published: false,
                publish_date: ''
              });
              setSelectedCategories([]);
              setSelectedTags([]);
              setShowPreview(false);
            }}
            className="px-4 py-2 bg-verde-cia text-white rounded-lg hover:bg-verde-cia-escuro transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nova Página
          </button>
        </div>

        {/* Form */}
        {(editing !== null || formData.title !== '') && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Gerado automaticamente se vazio"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Descrição
                </label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Conteúdo
                </label>
                <PageEditor
                  content={formData.content.sections[0].content}
                  onChange={(content) => setFormData({
                    ...formData,
                    content: {
                      sections: [{
                        type: 'content',
                        content
                      }]
                    }
                  })}
                  onPreviewToggle={() => setShowPreview(!showPreview)}
                  isPreviewVisible={showPreview}
                />
              </div>

              <div className="space-y-4">
                <CategoryTagManager
                  selectedCategories={selectedCategories}
                  selectedTags={selectedTags}
                  onCategoryChange={setSelectedCategories}
                  onTagChange={setSelectedTags}
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">Publicada</span>
                </label>

                {formData.is_published && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <input
                      type="datetime-local"
                      value={formData.publish_date}
                      onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
                      className="px-3 py-2 border rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>

            {editing && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <PageComponentManager pageId={editing} />
              </div>
            )}

            <div className="flex justify-between">
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center"
                >
                  <Eye className="h-5 w-5 mr-2" />
                  Prévia
                </button>
              </div>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setFormData({
                      title: '',
                      slug: '',
                      content: {
                        sections: [{
                          type: 'content',
                          content: ''
                        }]
                      },
                      meta_description: '',
                      is_published: false,
                      publish_date: ''
                    });
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center"
                >
                  <X className="h-5 w-5 mr-2" />
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-verde-cia text-white rounded-md hover:bg-verde-cia-escuro transition-colors flex items-center"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {editing ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Pages List */}
        <div className="grid grid-cols-1 gap-4">
          {pages.map((page) => (
            <div
              key={page.id}
              className="bg-white p-4 rounded-lg shadow border hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{page.title}</h3>
                  <p className="text-sm text-gray-500">/{page.slug}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditing(page.id);
                      setFormData(page);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(page.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <PagePreview
            title={formData.title}
            content={formData.content.sections[0].content}
            onClose={() => setShowPreview(false)}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default Pages;