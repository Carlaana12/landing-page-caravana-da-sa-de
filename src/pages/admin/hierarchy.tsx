'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { HierarchicalItem, HierarchicalItemWithChildren } from '@/lib/types';
import { buildHierarchy } from '@/lib/hierarchy';
import HierarchicalList from '@/components/admin/HierarchicalList';
import HierarchicalForm from '@/components/admin/HierarchicalForm';
import { logAction } from '@/lib/logger';
import toast from 'react-hot-toast';

export default function HierarchyPage() {
  const [items, setItems] = useState<HierarchicalItemWithChildren[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'page' | 'category' | 'section'>('page');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<HierarchicalItemWithChildren | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, [selectedType]);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('hierarchical_items')
        .select('*')
        .eq('type', selectedType)
        .order('order', { ascending: true });

      if (error) throw error;

      const hierarchicalItems = buildHierarchy(data || []);
      setItems(hierarchicalItems);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
      toast.error('Erro ao carregar itens');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (parentId: string | null) => {
    setParentId(parentId);
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: HierarchicalItemWithChildren) => {
    setEditingItem(item);
    setParentId(item.parent_id);
    setShowForm(true);
  };

  const handleDelete = async (item: HierarchicalItemWithChildren) => {
    if (!confirm(`Tem certeza que deseja excluir "${item.name}" e todos os seus filhos?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('hierarchical_items')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      await logAction('delete', selectedType, item.id, item.name);
      toast.success('Item excluído com sucesso');
      fetchItems();
    } catch (error) {
      console.error('Erro ao excluir item:', error);
      toast.error('Erro ao excluir item');
    }
  };

  const handleSave = () => {
    setShowForm(false);
    fetchItems();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
    setParentId(null);
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciamento Hierárquico</h1>
        <div className="flex space-x-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="page">Páginas</option>
            <option value="category">Categorias</option>
            <option value="section">Seções</option>
          </select>
        </div>
      </div>

      {showForm ? (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editingItem ? 'Editar Item' : 'Novo Item'}
          </h2>
          <HierarchicalForm
            item={editingItem || undefined}
            parentId={parentId}
            type={selectedType}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <HierarchicalList
          items={items}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          type={selectedType}
        />
      )}
    </div>
  );
} 