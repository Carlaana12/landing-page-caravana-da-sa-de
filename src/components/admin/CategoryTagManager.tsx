import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import slugify from 'slugify';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface CategoryTagManagerProps {
  selectedCategories: string[];
  selectedTags: string[];
  onCategoryChange: (categories: string[]) => void;
  onTagChange: (tags: string[]) => void;
}

const CategoryTagManager: React.FC<CategoryTagManagerProps> = ({
  selectedCategories,
  selectedTags,
  onCategoryChange,
  onTagChange
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [newTag, setNewTag] = useState({ name: '' });

  useEffect(() => {
    fetchCategoriesAndTags();
  }, []);

  const fetchCategoriesAndTags = async () => {
    try {
      const [{ data: categoriesData }, { data: tagsData }] = await Promise.all([
        supabase.from('page_categories').select('*').order('name'),
        supabase.from('page_tags').select('*').order('name')
      ]);

      setCategories(categoriesData || []);
      setTags(tagsData || []);
    } catch (error) {
      toast.error('Erro ao carregar categorias e tags');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      const { error } = await supabase.from('page_categories').insert([{
        name: newCategory.name,
        slug: slugify(newCategory.name, { lower: true, strict: true }),
        description: newCategory.description || null
      }]);

      if (error) throw error;
      
      setNewCategory({ name: '', description: '' });
      fetchCategoriesAndTags();
      toast.success('Categoria adicionada com sucesso');
    } catch (error) {
      toast.error('Erro ao adicionar categoria');
    }
  };

  const handleAddTag = async () => {
    try {
      const { error } = await supabase.from('page_tags').insert([{
        name: newTag.name,
        slug: slugify(newTag.name, { lower: true, strict: true })
      }]);

      if (error) throw error;
      
      setNewTag({ name: '' });
      fetchCategoriesAndTags();
      toast.success('Tag adicionada com sucesso');
    } catch (error) {
      toast.error('Erro ao adicionar tag');
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Categorias</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {categories.map(category => (
            <label key={category.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.id)}
                onChange={(e) => {
                  const newCategories = e.target.checked
                    ? [...selectedCategories, category.id]
                    : selectedCategories.filter(id => id !== category.id);
                  onCategoryChange(newCategories);
                }}
                className="rounded border-gray-300"
              />
              <span>{category.name}</span>
            </label>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            placeholder="Nova categoria"
            className="flex-1 px-3 py-2 border rounded-md"
          />
          <input
            type="text"
            value={newCategory.description}
            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
            placeholder="Descrição (opcional)"
            className="flex-1 px-3 py-2 border rounded-md"
          />
          <button
            onClick={handleAddCategory}
            disabled={!newCategory.name}
            className="px-4 py-2 bg-verde-cia text-white rounded-md hover:bg-verde-cia-escuro transition-colors disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map(tag => (
            <label key={tag.id} className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
              <input
                type="checkbox"
                checked={selectedTags.includes(tag.id)}
                onChange={(e) => {
                  const newTags = e.target.checked
                    ? [...selectedTags, tag.id]
                    : selectedTags.filter(id => id !== tag.id);
                  onTagChange(newTags);
                }}
                className="rounded border-gray-300"
              />
              <span>{tag.name}</span>
            </label>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag.name}
            onChange={(e) => setNewTag({ name: e.target.value })}
            placeholder="Nova tag"
            className="flex-1 px-3 py-2 border rounded-md"
          />
          <button
            onClick={handleAddTag}
            disabled={!newTag.name}
            className="px-4 py-2 bg-verde-cia text-white rounded-md hover:bg-verde-cia-escuro transition-colors disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryTagManager;