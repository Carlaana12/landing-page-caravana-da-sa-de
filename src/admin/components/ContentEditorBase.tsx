import { useState, useEffect } from 'react';
import { Loader2, Save, Trash2, Eye, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

interface FormData {
  [key: string]: any;
  titulo?: string;
  conteudo?: string;
}

interface ContentEditorBaseProps {
  tipo: string;
  title: string;
  table: string;
  initialData?: FormData;
  onSave?: (data: FormData) => void;
  onDelete?: () => void;
  children: React.ReactNode | ((props: { 
    formData: FormData; 
    handleChange: (field: string, value: any) => void;
    isDirty: boolean;
  }) => React.ReactNode);
}

export default function ContentEditorBase({
  tipo,
  title,
  table,
  initialData,
  onSave,
  onDelete,
  children
}: ContentEditorBaseProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialData || {});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!initialData) {
      loadContent();
    }
  }, [tipo]);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('tipo', tipo)
        .single();

      if (error) throw error;

      setFormData(data || {});
    } catch (error: any) {
      console.error('Erro ao carregar conteúdo:', error);
      toast.error('Erro ao carregar conteúdo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const { data, error } = await supabase
        .from(table)
        .upsert({
          ...formData,
          tipo,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setFormData(data);
      setIsDirty(false);
      onSave?.(data);
      toast.success('Conteúdo salvo com sucesso!');
    } catch (error: any) {
      console.error('Erro ao salvar conteúdo:', error);
      toast.error('Erro ao salvar conteúdo');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('tipo', tipo);

      if (error) throw error;

      onDelete?.();
      toast.success('Conteúdo excluído com sucesso!');
      setShowDeleteConfirm(false);
    } catch (error: any) {
      console.error('Erro ao excluir conteúdo:', error);
      toast.error('Erro ao excluir conteúdo');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev: FormData) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-verde-cia animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(true)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde-cia"
          >
            <Eye className="w-4 h-4 mr-2" />
            Pré-visualizar
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </button>
          <button
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-verde-cia hover:bg-verde-cia-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde-cia disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar alterações
              </>
            )}
          </button>
        </div>
      </div>

      <form className="p-6 space-y-6">
        {typeof children === 'function' 
          ? (children as (props: { 
              formData: FormData; 
              handleChange: (field: string, value: any) => void;
              isDirty: boolean;
            }) => React.ReactNode)({ formData, handleChange, isDirty })
          : children}
      </form>

      {/* Modal de confirmação de exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4 text-red-600">
              <AlertTriangle className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-medium">Confirmar exclusão</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir este conteúdo? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                    Excluindo...
                  </>
                ) : (
                  'Confirmar exclusão'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de pré-visualização */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Pré-visualização</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="sr-only">Fechar</span>
                &times;
              </button>
            </div>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: formData.conteudo || '' 
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
} 