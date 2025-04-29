import React from 'react';
import { PageComponent, ComponentSettings, COMPONENT_TYPES } from '../../lib/types';
import { Settings, Move, Trash2, Eye, EyeOff } from 'lucide-react';

interface ComponentEditorProps {
  component: PageComponent;
  onUpdate: (component: PageComponent) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
}

const ComponentEditor: React.FC<ComponentEditorProps> = ({
  component,
  onUpdate,
  onDelete,
  onMove,
  isFirst,
  isLast
}) => {
  const handleSettingChange = (key: string, value: any) => {
    onUpdate({
      ...component,
      settings: {
        ...component.settings,
        [key]: value
      }
    });
  };

  const renderSettings = () => {
    switch (component.type) {
      case COMPONENT_TYPES.CAROUSEL:
        return (
          <>
            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">Intervalo (ms)</span>
              <input
                type="number"
                value={component.settings.interval}
                onChange={(e) => handleSettingChange('interval', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                min="1000"
                step="500"
              />
            </label>
            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={component.settings.autoplay}
                onChange={(e) => handleSettingChange('autoplay', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Reprodução automática</span>
            </label>
            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={component.settings.showArrows}
                onChange={(e) => handleSettingChange('showArrows', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Mostrar setas</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={component.settings.showDots}
                onChange={(e) => handleSettingChange('showDots', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Mostrar pontos</span>
            </label>
          </>
        );

      case COMPONENT_TYPES.DOCTOR_SEARCH:
        return (
          <>
            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">Placeholder</span>
              <input
                type="text"
                value={component.settings.placeholder}
                onChange={(e) => handleSettingChange('placeholder', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </label>
            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={component.settings.showLocation}
                onChange={(e) => handleSettingChange('showLocation', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Mostrar localização</span>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Raio de busca (km)</span>
              <input
                type="number"
                value={component.settings.radius}
                onChange={(e) => handleSettingChange('radius', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                min="1"
              />
            </label>
          </>
        );

      case COMPONENT_TYPES.SPECIALTIES_GRID:
        return (
          <>
            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">Número de colunas</span>
              <input
                type="number"
                value={component.settings.columns}
                onChange={(e) => handleSettingChange('columns', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                min="1"
                max="6"
              />
            </label>
            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={component.settings.showIcons}
                onChange={(e) => handleSettingChange('showIcons', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Mostrar ícones</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={component.settings.showDescriptions}
                onChange={(e) => handleSettingChange('showDescriptions', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Mostrar descrições</span>
            </label>
          </>
        );

      case COMPONENT_TYPES.HIGHLIGHTS:
        return (
          <>
            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">Estilo</span>
              <select
                value={component.settings.style}
                onChange={(e) => handleSettingChange('style', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="cards">Cards</option>
                <option value="list">Lista</option>
              </select>
            </label>
            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={component.settings.showIcons}
                onChange={(e) => handleSettingChange('showIcons', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Mostrar ícones</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={component.settings.animate}
                onChange={(e) => handleSettingChange('animate', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Animar</span>
            </label>
          </>
        );

      case COMPONENT_TYPES.EVENTS_PREVIEW:
        return (
          <>
            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">Limite de eventos</span>
              <input
                type="number"
                value={component.settings.limit}
                onChange={(e) => handleSettingChange('limit', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                min="1"
                max="10"
              />
            </label>
            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={component.settings.showImages}
                onChange={(e) => handleSettingChange('showImages', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Mostrar imagens</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={component.settings.autoSlide}
                onChange={(e) => handleSettingChange('autoSlide', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Slide automático</span>
            </label>
          </>
        );

      case COMPONENT_TYPES.NEWS_SECTION:
        return (
          <>
            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">Limite de notícias</span>
              <input
                type="number"
                value={component.settings.limit}
                onChange={(e) => handleSettingChange('limit', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                min="1"
                max="10"
              />
            </label>
            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">Layout</span>
              <select
                value={component.settings.layout}
                onChange={(e) => handleSettingChange('layout', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="grid">Grid</option>
                <option value="list">Lista</option>
              </select>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={component.settings.showImages}
                onChange={(e) => handleSettingChange('showImages', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Mostrar imagens</span>
            </label>
          </>
        );

      case COMPONENT_TYPES.PARTNERS_SECTION:
        return (
          <>
            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">Estilo</span>
              <select
                value={component.settings.style}
                onChange={(e) => handleSettingChange('style', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="grid">Grid</option>
                <option value="carousel">Carrossel</option>
              </select>
            </label>
            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={component.settings.showLogos}
                onChange={(e) => handleSettingChange('showLogos', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Mostrar logos</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={component.settings.animate}
                onChange={(e) => handleSettingChange('animate', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Animar</span>
            </label>
          </>
        );

      case COMPONENT_TYPES.CONTACT_SECTION:
        return (
          <>
            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={component.settings.showMap}
                onChange={(e) => handleSettingChange('showMap', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Mostrar mapa</span>
            </label>
            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={component.settings.showForm}
                onChange={(e) => handleSettingChange('showForm', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Mostrar formulário</span>
            </label>
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Campos do formulário</span>
              {['name', 'email', 'phone', 'message'].map(field => (
                <label key={field} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={component.settings.formFields?.includes(field)}
                    onChange={(e) => {
                      const fields = component.settings.formFields || [];
                      if (e.target.checked) {
                        handleSettingChange('formFields', [...fields, field]);
                      } else {
                        handleSettingChange('formFields', fields.filter(f => f !== field));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{field}</span>
                </label>
              ))}
            </div>
          </>
        );

      default:
        return (
          <div className="text-sm text-gray-500">
            Este componente não possui configurações disponíveis.
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{component.name}</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onMove(component.id, 'up')}
            disabled={isFirst}
            className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
            title="Mover para cima"
          >
            <Move className="w-4 h-4 transform rotate-180" />
          </button>
          <button
            onClick={() => onMove(component.id, 'down')}
            disabled={isLast}
            className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
            title="Mover para baixo"
          >
            <Move className="w-4 h-4" />
          </button>
          <button
            onClick={() => onUpdate({ ...component, active: !component.active })}
            className="p-1 hover:bg-gray-100 rounded"
            title={component.active ? 'Desativar' : 'Ativar'}
          >
            {component.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onDelete(component.id)}
            className="p-1 hover:bg-gray-100 rounded text-red-600"
            title="Excluir"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center mb-4">
          <Settings className="w-5 h-5 mr-2 text-gray-500" />
          <h4 className="text-sm font-medium text-gray-700">Configurações</h4>
        </div>
        {renderSettings()}
      </div>
    </div>
  );
};

export default ComponentEditor;