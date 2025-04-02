import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { PageComponent, COMPONENT_TYPES } from '../../lib/types';
import ComponentEditor from './ComponentEditor';
import { Plus, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

interface PageComponentManagerProps {
  pageId: string;
}

const PageComponentManager: React.FC<PageComponentManagerProps> = ({ pageId }) => {
  const [components, setComponents] = useState<PageComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchComponents();
  }, [pageId]);

  const fetchComponents = async () => {
    try {
      const { data, error } = await supabase
        .from('page_components')
        .select('*')
        .eq('page_id', pageId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setComponents(data || []);
    } catch (error) {
      console.error('Error fetching components:', error);
      toast.error('Erro ao carregar componentes');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComponent = async (type: string, name: string) => {
    try {
      const { data, error } = await supabase
        .from('page_components')
        .insert([{
          page_id: pageId,
          type,
          name,
          display_order: components.length,
          settings: getDefaultSettings(type)
        }])
        .select()
        .single();

      if (error) throw error;
      setComponents([...components, data]);
      setShowAddModal(false);
      toast.success('Componente adicionado com sucesso');
    } catch (error) {
      console.error('Error adding component:', error);
      toast.error('Erro ao adicionar componente');
    }
  };

  const handleUpdateComponent = async (updatedComponent: PageComponent) => {
    try {
      const { error } = await supabase
        .from('page_components')
        .update(updatedComponent)
        .eq('id', updatedComponent.id);

      if (error) throw error;
      setComponents(components.map(c => 
        c.id === updatedComponent.id ? updatedComponent : c
      ));
      toast.success('Componente atualizado com sucesso');
    } catch (error) {
      console.error('Error updating component:', error);
      toast.error('Erro ao atualizar componente');
    }
  };

  const handleDeleteComponent = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este componente?')) return;

    try {
      const { error } = await supabase
        .from('page_components')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setComponents(components.filter(c => c.id !== id));
      toast.success('Componente excluído com sucesso');
    } catch (error) {
      console.error('Error deleting component:', error);
      toast.error('Erro ao excluir componente');
    }
  };

  const handleMoveComponent = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = components.findIndex(c => c.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === components.length - 1)
    ) {
      return;
    }

    const newComponents = [...components];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const [movedComponent] = newComponents.splice(currentIndex, 1);
    newComponents.splice(targetIndex, 0, movedComponent);

    try {
      // Update display_order for all affected components
      const updates = newComponents.map((component, index) => ({
        id: component.id,
        display_order: index
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('page_components')
          .update({ display_order: update.display_order })
          .eq('id', update.id);

        if (error) throw error;
      }

      setComponents(newComponents);
      toast.success('Ordem atualizada com sucesso');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Erro ao atualizar ordem');
      fetchComponents(); // Refresh to ensure consistent state
    }
  };

  const getDefaultSettings = (type: string) => {
    switch (type) {
      case COMPONENT_TYPES.CAROUSEL:
        return {
          autoplay: true,
          interval: 5000,
          showArrows: true,
          showDots: true
        };
      case COMPONENT_TYPES.DOCTOR_SEARCH:
        return {
          placeholder: "Busque por especialidade ou nome do médico",
          showLocation: true,
          radius: 10
        };
      case COMPONENT_TYPES.SPECIALTIES_GRID:
        return {
          columns: 6,
          showIcons: true,
          showDescriptions: true
        };
      case COMPONENT_TYPES.HIGHLIGHTS:
        return {
          style: "cards",
          showIcons: true,
          animate: true
        };
      case COMPONENT_TYPES.EVENTS_PREVIEW:
        return {
          limit: 3,
          showImages: true,
          autoSlide: true
        };
      case COMPONENT_TYPES.NEWS_SECTION:
        return {
          limit: 3,
          layout: "grid",
          showImages: true
        };
      case COMPONENT_TYPES.PARTNERS_SECTION:
        return {
          style: "grid",
          showLogos: true,
          animate: true
        };
      case COMPONENT_TYPES.CONTACT_SECTION:
        return {
          showMap: true,
          showForm: true,
          formFields: ["name", "email", "message"]
        };
      default:
        return {};
    }
  };

  if (loading) {
    return <div>Carregando componentes...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Componentes da Página</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-verde-cia text-white rounded-lg hover:bg-verde-cia-escuro transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Componente
        </button>
      </div>

      {components.map((component, index) => (
        <ComponentEditor
          key={component.id}
          component={component}
          onUpdate={handleUpdateComponent}
          onDelete={handleDeleteComponent}
          onMove={handleMoveComponent}
          isFirst={index === 0}
          isLast={index === components.length - 1}
        />
      ))}

      {components.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhum componente adicionado
        </div>
      )}

      {/* Add Component Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Adicionar Componente</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {Object.entries(COMPONENT_TYPES).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => handleAddComponent(value, key.charAt(0) + key.slice(1).toLowerCase())}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {key.charAt(0) + key.slice(1).toLowerCase().replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageComponentManager;