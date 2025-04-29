import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Filter, Save, X, Edit2, Trash2, GripVertical, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import * as LucideIcons from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import HighlightsPreview from '../../components/admin/HighlightsPreview';

interface Highlight {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  display_order: number;
  active: boolean;
  category: string;
  type: string;
  value?: string;
}

const CATEGORIES = {
  home: 'Página Inicial',
  about: 'Sobre',
  specialties: 'Especialidades',
  diseases: 'Doenças',
  utilities: 'Utilidades'
};

const TYPES = {
  feature: 'Destaque',
  stat: 'Estatística',
  specialty: 'Especialidade',
  disease: 'Doença',
  emergency: 'Emergência'
};

const ICONS = [
  'Star', 'Heart', 'Brain', 'Eye', 'Stethoscope', 'Baby', 'Bone',
  'Lungs', 'Activity', 'Shield', 'Users', 'Clock', 'Bell',
  'Ambulance', 'Flame', 'Building2', 'Pill'
];

interface SortableHighlightProps {
  highlight: Highlight;
  onEdit: () => void;
  onDelete: () => void;
}

const SortableHighlight = ({ highlight, onEdit, onDelete }: SortableHighlightProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: highlight.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Star;
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white p-4 rounded-lg shadow border hover:shadow-md transition-shadow ${
        isDragging ? 'shadow-xl' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-5 h-5 text-gray-400" />
          </button>
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${highlight.color}20` }}
          >
            <div style={{ color: highlight.color }}>
              {renderIcon(highlight.icon)}
            </div>
          </div>
          <div>
            <h3 className="font-semibold">{highlight.title}</h3>
            <p className="text-sm text-gray-600">{highlight.description}</p>
            {highlight.value && (
              <span className="text-sm text-verde-cia">Valor: {highlight.value}</span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Editar"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Excluir"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const HighlightsManager = () => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('home');
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Star',
    color: '#408040',
    active: true,
    category: 'home',
    type: 'feature',
    value: ''
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchHighlights();
  }, [selectedCategory]);

  const fetchHighlights = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('highlights')
        .select('*')
        .eq('category', selectedCategory)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setHighlights(data || []);
    } catch (error) {
      console.error('Error fetching highlights:', error);
      toast.error('Erro ao carregar destaques');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = highlights.findIndex((item) => item.id === active.id);
      const newIndex = highlights.findIndex((item) => item.id === over.id);

      const newHighlights = arrayMove(highlights, oldIndex, newIndex);
      setHighlights(newHighlights);

      try {
        // Atualizar a ordem no banco de dados
        for (let i = 0; i < newHighlights.length; i++) {
          const { error } = await supabase
            .from('highlights')
            .update({ display_order: i })
            .eq('id', newHighlights[i].id);

          if (error) throw error;
        }

        toast.success('Ordem atualizada com sucesso');
      } catch (error) {
        console.error('Error updating order:', error);
        toast.error('Erro ao atualizar ordem');
        fetchHighlights(); // Recarregar ordem original em caso de erro
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editing) {
        const { error } = await supabase
          .from('highlights')
          .update(formData)
          .eq('id', editing);

        if (error) throw error;
        toast.success('Destaque atualizado com sucesso');
      } else {
        const { error } = await supabase
          .from('highlights')
          .insert([{
            ...formData,
            category: selectedCategory,
            display_order: highlights.length
          }]);

        if (error) throw error;
        toast.success('Destaque criado com sucesso');
      }

      setEditing(null);
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        icon: 'Star',
        color: '#408040',
        active: true,
        category: 'home',
        type: 'feature',
        value: ''
      });
      fetchHighlights();
    } catch (error) {
      console.error('Error saving highlight:', error);
      toast.error('Erro ao salvar destaque');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este destaque?')) {
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('highlights')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Reordenar os itens restantes
      const remainingHighlights = highlights.filter(h => h.id !== id);
      for (let i = 0; i < remainingHighlights.length; i++) {
        const { error: updateError } = await supabase
          .from('highlights')
          .update({ display_order: i })
          .eq('id', remainingHighlights[i].id);

        if (updateError) throw updateError;
      }

      toast.success('Destaque excluído com sucesso');
      fetchHighlights();
    } catch (error) {
      console.error('Error deleting highlight:', error);
      toast.error('Erro ao excluir destaque');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gerenciamento de Destaques</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowPreview(true)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
            >
              <Eye className="w-5 h-5 mr-2" />
              Preview
            </button>
            <button
              onClick={() => {
                setEditing(null);
                setFormData({
                  title: '',
                  description: '',
                  icon: 'Star',
                  color: '#408040',
                  active: true,
                  category: selectedCategory,
                  type: 'feature',
                  value: ''
                });
                setShowForm(true);
              }}
              className="px-4 py-2 bg-verde-cia text-white rounded-lg hover:bg-verde-cia-escuro transition-colors flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Novo Destaque
            </button>
          </div>
        </div>

        {/* Filtro de Categorias */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtrar por categoria:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(CATEGORIES).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === key
                    ? 'bg-verde-cia text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Formulário */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm mb-6">
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
                  Tipo
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {Object.entries(TYPES).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ícone
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {ICONS.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cor
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="h-10 w-20"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="flex-1 px-3 py-2 border rounded-md"
                    pattern="^#[0-9A-Fa-f]{6}$"
                    required
                  />
                </div>
              </div>

              {(formData.type === 'stat' || formData.type === 'emergency') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor
                  </label>
                  <input
                    type="text"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  required
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">Ativo</span>
                </label>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-verde-cia text-white rounded-md hover:bg-verde-cia-escuro transition-colors flex items-center"
                disabled={loading}
              >
                <Save className="h-4 w-4 mr-2" />
                {editing ? 'Atualizar' : 'Adicionar'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setShowForm(false);
                  setFormData({
                    title: '',
                    description: '',
                    icon: 'Star',
                    color: '#408040',
                    active: true,
                    category: selectedCategory,
                    type: 'feature',
                    value: ''
                  });
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* Lista de Destaques */}
        {loading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : highlights.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum destaque encontrado para esta categoria
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={highlights.map(h => h.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid gap-4">
                {highlights.map((highlight) => (
                  <SortableHighlight
                    key={highlight.id}
                    highlight={highlight}
                    onEdit={() => {
                      setEditing(highlight.id);
                      setFormData({
                        title: highlight.title,
                        description: highlight.description,
                        icon: highlight.icon,
                        color: highlight.color,
                        active: highlight.active,
                        category: highlight.category,
                        type: highlight.type,
                        value: highlight.value || ''
                      });
                      setShowForm(true);
                    }}
                    onDelete={() => handleDelete(highlight.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* Preview Modal */}
        {showPreview && (
          <HighlightsPreview
            highlights={highlights.filter(h => h.active)}
            onClose={() => setShowPreview(false)}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default HighlightsManager;