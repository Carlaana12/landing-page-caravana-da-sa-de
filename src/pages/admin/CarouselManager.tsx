import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import {
  Plus, Edit2, Trash2, Image, Link as LinkIcon,
  Eye, EyeOff, Save, X, GripVertical
} from 'lucide-react';
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CarouselSlide {
  id: string;
  title: string;
  subtitle?: string;
  image_url: string;
  link_url?: string;
  is_active: boolean;
  order: number;
  created_at: string;
}

// Componente Sortable para cada slide
interface SortableItemProps {
  slide: CarouselSlide;
  onEdit: (slide: CarouselSlide) => void;
  onDelete: (id: string) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ slide, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white rounded-lg shadow-sm border mb-4 flex items-center p-4">
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-2 text-gray-400 hover:text-gray-600 mr-3"
        aria-label="Mover slide"
      >
        <GripVertical className="w-5 h-5" />
      </button>
      <img src={slide.image_url} alt={slide.title} className="h-12 w-20 object-cover rounded mr-4" />
      <div className="flex-grow">
        <h3 className="text-sm font-medium text-gray-900">{slide.title}</h3>
        {slide.subtitle && <p className="text-xs text-gray-500">{slide.subtitle}</p>}
        {slide.link_url && <a href={slide.link_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline truncate block" style={{maxWidth: '200px'}}>{slide.link_url}</a>}
      </div>
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mx-4 ${
        slide.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {slide.is_active ? 'Ativo' : 'Inativo'}
      </span>
      <div className="flex space-x-2">
        <button onClick={() => onEdit(slide)} className="text-blue-600 hover:text-blue-900" title="Editar">
          <Edit2 className="w-5 h-5" />
        </button>
        <button onClick={() => onDelete(slide.id)} className="text-red-600 hover:text-red-900" title="Excluir">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Componente Principal
const CarouselManager: React.FC = () => {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);
  const [formData, setFormData] = useState<Partial<CarouselSlide>>({});

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchSlides = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('carousel_slides')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      toast.error('Erro ao carregar slides do carrossel.');
      console.error('Error fetching slides:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  const openModalForCreate = () => {
    setEditingSlide(null);
    setFormData({
      title: '',
      subtitle: '',
      image_url: '',
      link_url: '',
      is_active: true,
      order: (slides.length + 1) * 10, // Default order
    });
    setShowModal(true);
  };

  const openModalForEdit = (slide: CarouselSlide) => {
    setEditingSlide(slide);
    setFormData({ ...slide });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSlide(null);
    setFormData({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const inputValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;
    const finalValue = name === 'order' ? parseInt(inputValue as string, 10) || 0 : inputValue;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.image_url) {
      toast.error('Título e URL da Imagem são obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      if (editingSlide) {
        // Update
        const { error } = await supabase
          .from('carousel_slides')
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq('id', editingSlide.id);
        if (error) throw error;
        toast.success('Slide atualizado com sucesso!');
      } else {
        // Create
        const { error } = await supabase
          .from('carousel_slides')
          .insert([{ ...formData }]);
        if (error) throw error;
        toast.success('Slide criado com sucesso!');
      }
      closeModal();
      await updateSlideOrder(slides.map(s => s.id)); // Garante a ordem após salvar
      fetchSlides();
    } catch (error) {
      toast.error(`Erro ao salvar slide: ${(error as Error).message}`);
      console.error('Error saving slide:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este slide?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('carousel_slides')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Slide excluído com sucesso!');
      // Reordenar após deletar
      const remainingSlides = slides.filter(s => s.id !== id);
      await updateSlideOrder(remainingSlides.map(s => s.id));
      fetchSlides();
    } catch (error) {
      toast.error('Erro ao excluir slide.');
      console.error('Error deleting slide:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar a ordem no banco
  const updateSlideOrder = async (orderedIds: string[]) => {
    try {
      const updates = orderedIds.map((id, index) =>
        supabase
          .from('carousel_slides')
          .update({ order: index * 10 })
          .eq('id', id)
      );
      await Promise.all(updates);
    } catch (error) {
      toast.error('Erro ao atualizar a ordem dos slides.');
      console.error('Error updating slide order:', error);
      // Opcional: reverter para a ordem anterior visualmente ou buscar novamente
      fetchSlides();
    }
  };

  // Handler para o fim do drag-and-drop
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = slides.findIndex((s) => s.id === active.id);
      const newIndex = slides.findIndex((s) => s.id === over.id);

      const newSlides = arrayMove(slides, oldIndex, newIndex);
      setSlides(newSlides);

      // Atualizar a ordem no banco de dados
      updateSlideOrder(newSlides.map(s => s.id));
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Gerenciamento do Carrossel</h1>
        <button
          onClick={openModalForCreate}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Slide
        </button>
      </div>

      {/* Lista de Slides com Drag and Drop */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        {loading && slides.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : slides.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Nenhum slide encontrado.</p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={slides.map(s => s.id)} strategy={verticalListSortingStrategy}>
              <div>
                {slides.map(slide => (
                  <SortableItem
                    key={slide.id}
                    slide={slide}
                    onEdit={openModalForEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Modal para Criar/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              {editingSlide ? 'Editar Slide' : 'Novo Slide'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
               <div>
                <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1">Subtítulo (Opcional)</label>
                <input
                  type="text"
                  id="subtitle"
                  name="subtitle"
                  value={formData.subtitle || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem *</label>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url || ''}
                  onChange={handleInputChange}
                  required
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                 {formData.image_url && <img src={formData.image_url} alt="Preview" className="mt-2 h-20 rounded" />}
              </div>
              <div>
                <label htmlFor="link_url" className="block text-sm font-medium text-gray-700 mb-1">URL do Link (Opcional)</label>
                <input
                  type="url"
                  id="link_url"
                  name="link_url"
                  value={formData.link_url || ''}
                  onChange={handleInputChange}
                  placeholder="https://exemplo.com/pagina-destino"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
               <div className="flex items-center pt-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active ?? true}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                    Ativo
                  </label>
              </div>
              {/* Campo de ordem não é editável diretamente aqui, pois a ordem é gerenciada pelo Drag and Drop */}
              <div className="pt-6 flex justify-end space-x-3 border-t border-gray-200 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
                    loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="w-4 h-4 mr-1" />
                  )}
                  Salvar Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarouselManager;