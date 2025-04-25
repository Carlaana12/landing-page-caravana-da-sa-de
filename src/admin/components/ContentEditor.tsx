import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { 
  Save, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Calendar, 
  Tag, 
  Upload, 
  Trash2, 
  User, 
  Loader,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Content } from './ContentViewer';
import { Editor } from '@tinymce/tinymce-react';

interface ContentEditorProps {
  contentType: string;
  title: string;
  backPath: string;
  isNew?: boolean;
  allowCategories?: boolean;
  categories?: string[];
}

// Expandir a interface Content para permitir acesso indexado
interface IndexableContent extends Partial<Content> {
  [key: string]: any;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  contentType,
  title,
  backPath,
  isNew = false,
  allowCategories = false,
  categories = []
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Estado para múltiplas imagens
  const [additionalImages, setAdditionalImages] = useState<{ file: File | null, preview: string }[]>([]);
  const [showImageGallery, setShowImageGallery] = useState(false);
  
  const [content, setContent] = useState<IndexableContent>({
    titulo: '',
    resumo: '',
    conteudo: '',
    imagem_url: '',
    categoria: allowCategories ? categories[0] || '' : undefined,
    tags: [],
    autor: '',
    data_publicacao: new Date().toISOString().split('T')[0],
    status: 'rascunho',
    tipo: contentType
  });

  useEffect(() => {
    if (id && !isNew) {
      fetchContent();
    }
  }, [id, isNew]);

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('conteudos')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setContent(data);
        if (data.imagem_url) {
          setImagePreview(data.imagem_url);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar conteúdo:', error);
      toast.error('Não foi possível carregar o conteúdo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContent(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (value: string) => {
    setContent(prev => ({ ...prev, conteudo: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsValue = e.target.value;
    const tagsArray = tagsValue.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    setContent(prev => ({
      ...prev,
      tags: tagsArray
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAdditionalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newImages = [...additionalImages];
    
    Array.from(files).forEach(file => {
      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push({
          file,
          preview: reader.result as string
        });
        setAdditionalImages([...newImages]);
      };
      reader.readAsDataURL(file);
    });
  };
  
  const removeAdditionalImage = (index: number) => {
    const updatedImages = [...additionalImages];
    updatedImages.splice(index, 1);
    setAdditionalImages(updatedImages);
  };
  
  const toggleImageGallery = () => {
    setShowImageGallery(!showImageGallery);
  };

  const handleStatusChange = (status: 'publicado' | 'rascunho' | 'agendado') => {
    setContent(prev => ({ ...prev, status }));
  };

  // Validação de formulário
  const validateForm = () => {
    if (!content.titulo) {
      return false;
    }
    if (!content.conteudo) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    
    // Remover campos vazios
    const contentToSave = { ...content };
    Object.keys(contentToSave).forEach(key => {
      const k = key as keyof IndexableContent;
      if (contentToSave[k] === "") {
        delete contentToSave[k];
      }
    });
    
    // Garantir que data_publicacao seja uma string de data válida
    if (!contentToSave.data_publicacao) {
      contentToSave.data_publicacao = new Date().toISOString();
    }
    
    try {
      setIsSaving(true);
      let result;

      if (id) {
        // Atualizar conteúdo existente
        const { data, error } = await supabase
          .from('conteudos')
          .update(contentToSave)
          .eq('id', id);
          
        if (error) throw error;
        result = data;
      } else {
        // Criar novo conteúdo
        const { data, error } = await supabase
          .from('conteudos')
          .insert(contentToSave)
          .select();
          
        if (error) throw error;
        result = data;
      }
      
      toast.success(id ? "Conteúdo atualizado com sucesso!" : "Conteúdo criado com sucesso!");
      
      // Navegar para a página de listagem ou detalhes
      setTimeout(() => {
        navigate(backPath);
      }, 1500);
    } catch (error) {
      console.error("Erro ao salvar conteúdo:", error);
      toast.error("Erro ao salvar o conteúdo. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setContent(prev => ({ ...prev, status: 'publicado' }));
    // Criar um evento de formulário sintético
    const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
    await handleSubmit(syntheticEvent);
  };

  // Função para renderizar preview
  const renderPreview = () => {
    return (
      <div className="preview-container">
        <h2 className="text-xl font-bold mb-4">Pré-visualização</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-2">{content.titulo || ''}</h1>
          
          {content.imagem_url && (
            <img 
              src={content.imagem_url} 
              alt={content.titulo || ''} 
              className="my-4 max-w-full h-auto rounded-lg"
            />
          )}
          
          <div className="text-sm text-gray-500 mb-4">
            Por {content.autor || 'Anônimo'} • {content.data_publicacao 
              ? new Date(content.data_publicacao).toLocaleDateString('pt-BR')
              : new Date().toLocaleDateString('pt-BR')}
          </div>
          
          <div className="content-preview" 
            dangerouslySetInnerHTML={{ 
              __html: content.conteudo || '' 
            }} 
          />
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-8 h-8 text-verde-cia animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(backPath)}
            className="mr-2 p-2 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isNew ? `Novo ${title}` : `Editar ${title}`}
          </h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde-cia"
          >
            {showPreview ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Ocultar pré-visualização
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Pré-visualização
              </>
            )}
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            {isSaving ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar rascunho
              </>
            )}
          </button>
          
          <button
            onClick={handlePublish}
            disabled={isSaving}
            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-verde-cia hover:bg-verde-cia-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde-cia"
          >
            {isSaving ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Publicando...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Publicar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Feedback de sucesso */}
      {saveSuccess && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4 rounded">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
            <p className="text-sm text-green-700">
              Conteúdo salvo com sucesso!
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de edição */}
        <div className={`lg:col-span-${showPreview ? '2' : '3'}`}>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 space-y-6">
              {/* Título */}
              <div>
                <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={content.titulo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-verde-cia focus:border-transparent"
                  placeholder="Digite o título"
                  required
                />
              </div>

              {/* Resumo */}
              <div>
                <label htmlFor="resumo" className="block text-sm font-medium text-gray-700 mb-1">
                  Resumo
                </label>
                <textarea
                  id="resumo"
                  name="resumo"
                  rows={3}
                  value={content.resumo || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-verde-cia focus:border-transparent"
                  placeholder="Digite um breve resumo"
                />
              </div>

              {/* Editor de Conteúdo */}
              <div>
                <label htmlFor="conteudo" className="block text-sm font-medium text-gray-700 mb-1">
                  Conteúdo <span className="text-red-500">*</span>
                </label>
                <Editor
                  apiKey="your-tinymce-api-key" // Obtenha uma chave em https://www.tiny.cloud/
                  value={content.conteudo}
                  init={{
                    height: 400,
                    menubar: true,
                    plugins: [
                      'advlist autolink lists link image charmap print preview anchor',
                      'searchreplace visualblocks code fullscreen',
                      'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar:
                      'undo redo | formatselect | bold italic backcolor | \
                      alignleft aligncenter alignright alignjustify | \
                      bullist numlist outdent indent | removeformat | help'
                  }}
                  onEditorChange={handleEditorChange}
                />
              </div>

              {/* Upload de Imagem */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagem de destaque
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  <div className="flex-shrink-0 h-24 w-24 rounded-md overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Upload className="h-8 w-8 text-gray-300" />
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="relative">
                      <input
                        type="file"
                        id="imagem"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                      <label
                        htmlFor="imagem"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-verde-cia"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {imagePreview ? 'Alterar imagem' : 'Escolher imagem'}
                      </label>
                    </div>
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setSelectedFile(null);
                          setContent(prev => ({ ...prev, imagem_url: '' }));
                        }}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remover imagem
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Galeria de imagens adicionais */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Imagens adicionais
                  </label>
                  <button
                    type="button"
                    onClick={toggleImageGallery}
                    className="text-sm text-verde-cia hover:text-verde-cia-dark"
                  >
                    {showImageGallery ? 'Ocultar galeria' : 'Mostrar galeria'}
                  </button>
                </div>
                
                <div className="relative">
                  <input
                    type="file"
                    id="additional-images"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={handleAdditionalImageUpload}
                  />
                  <label
                    htmlFor="additional-images"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-verde-cia"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Adicionar imagens
                  </label>
                </div>
                
                {/* Prévia das imagens */}
                {showImageGallery && additionalImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {additionalImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden border border-gray-200">
                          <img 
                            src={image.preview} 
                            alt={`Imagem ${index + 1}`}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAdditionalImage(index)}
                          className="absolute top-1 right-1 bg-red-100 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {showImageGallery && additionalImages.length === 0 && (
                  <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-md text-center">
                    <p className="text-sm text-gray-500">Nenhuma imagem adicional carregada</p>
                  </div>
                )}
              </div>

              {/* Metadados */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Data de Publicação */}
                <div>
                  <label htmlFor="data_publicacao" className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Publicação
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="data_publicacao"
                      name="data_publicacao"
                      value={content.data_publicacao}
                      onChange={handleChange}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-verde-cia focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Categoria */}
                {allowCategories && (
                  <div>
                    <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
                      Categoria
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Tag className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="categoria"
                        name="categoria"
                        value={content.categoria || ''}
                        onChange={handleChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-verde-cia focus:border-transparent"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Autor */}
                <div>
                  <label htmlFor="autor" className="block text-sm font-medium text-gray-700 mb-1">
                    Autor
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="autor"
                      name="autor"
                      value={content.autor || ''}
                      onChange={handleChange}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-verde-cia focus:border-transparent"
                      placeholder="Nome do autor"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (separadas por vírgula)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="tags"
                      value={content.tags?.join(', ') || ''}
                      onChange={handleTagsChange}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-verde-cia focus:border-transparent"
                      placeholder="saúde, medicina, tratamento"
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => handleStatusChange('rascunho')}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      content.status === 'rascunho'
                        ? 'bg-gray-200 text-gray-800'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Rascunho
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange('agendado')}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      content.status === 'agendado'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Agendado
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange('publicado')}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      content.status === 'publicado'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Publicado
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pré-visualização */}
        {showPreview && (
          <div className="lg:col-span-1">
            {renderPreview()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentEditor; 