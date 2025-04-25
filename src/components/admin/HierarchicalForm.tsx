'use client';

import { useState, useEffect } from 'react';
import { HierarchicalItem, HierarchicalItemWithChildren } from '@/lib/types';
import { getValidParents } from '@/lib/hierarchy';
import { supabase } from '@/lib/supabase';
import { logAction } from '@/lib/logger';
import toast from 'react-hot-toast';

interface HierarchicalFormProps {
  item?: HierarchicalItemWithChildren;
  parentId: string | null;
  type: 'page' | 'category' | 'section';
  onSave: () => void;
  onCancel: () => void;
}

export default function HierarchicalForm({
  item,
  parentId,
  type,
  onSave,
  onCancel
}: HierarchicalFormProps) {
  const [name, setName] = useState(item?.name || '');
  const [selectedParentId, setSelectedParentId] = useState<string | null>(parentId);
  const [availableParents, setAvailableParents] = useState<HierarchicalItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchParents();
  }, []);

  const fetchParents = async () => {
    try {
      const { data, error } = await supabase
        .from('hierarchical_items')
        .select('*')
        .eq('type', type);

      if (error) throw error;

      const validParents = getValidParents(
        data || [],
        item?.id || '',
        type
      );

      setAvailableParents(validParents);
    } catch (error) {
      console.error('Erro ao carregar pais disponíveis:', error);
      toast.error('Erro ao carregar pais disponíveis');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('Usuário não encontrado');
      const user = JSON.parse(userStr);

      const itemData = {
        name,
        parent_id: selectedParentId,
        type,
        order: 0,
        updated_by: user.id
      };

      if (item) {
        // Edição
        const { error } = await supabase
          .from('hierarchical_items')
          .update(itemData)
          .eq('id', item.id);

        if (error) throw error;
        await logAction('edit', type, item.id, name);
        toast.success(`${type === 'page' ? 'Página' : type === 'category' ? 'Categoria' : 'Seção'} atualizada com sucesso`);
      } else {
        // Criação
        const { data, error } = await supabase
          .from('hierarchical_items')
          .insert([{ ...itemData, created_by: user.id }])
          .select()
          .single();

        if (error) throw error;
        if (data) {
          await logAction('create', type, data.id, name);
          toast.success(`${type === 'page' ? 'Página' : type === 'category' ? 'Categoria' : 'Seção'} criada com sucesso`);
        }
      }

      onSave();
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      toast.error('Erro ao salvar item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nome
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Pai
        </label>
        <select
          value={selectedParentId || ''}
          onChange={(e) => setSelectedParentId(e.target.value || null)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Nenhum (Item Raiz)</option>
          {availableParents.map(parent => (
            <option key={parent.id} value={parent.id}>
              {parent.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
} 