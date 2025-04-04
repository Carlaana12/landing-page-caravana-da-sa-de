import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save, Upload, Tag, Calendar, Eye, Clock, AlertCircle, X } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Editor } from '@tinymce/tinymce-react';

// Categorias pré-definidas por especialidade
const categoriesBySpecialty = {
  'Cardiologia': ['Saúde Cardiovascular', 'Prevenção', 'Hipertensão', 'Arritmias'],
  'Dermatologia': ['Cuidados com a Pele', 'Tratamentos Estéticos', 'Doenças de Pele', 'Procedimentos'],
  'Pediatria': ['Saúde Infantil', 'Vacinação', 'Desenvolvimento', 'Nutrição Infantil'],
  'Ortopedia': ['Saúde Óssea', 'Lesões Esportivas', 'Coluna', 'Articulações'],
  'Nutrição': ['Alimentação Saudável', 'Dietas', 'Suplementação', 'Emagrecimento'],
  'Psicologia': ['Saúde Mental', 'Terapias', 'Ansiedade', 'Desenvolvimento Pessoal'],
  'Ginecologia': ['Saúde da Mulher', 'Gravidez', 'Prevenção', 'Hormônios'],
  'Oftalmologia': ['Saúde Ocular', 'Cirurgias', 'Tratamentos', 'Prevenção'],
  // Adicione mais especialidades conforme necessário
};

// Tags comuns por especialidade
const tagsBySpecialty = {
  'Cardiologia': ['Infarto', 'Pressão Alta', 'Colesterol', 'Exercícios', 'Prevenção Cardiovascular'],
  'Dermatologia': ['Acne', 'Proteção Solar', 'Antienvelhecimento', 'Manchas', 'Procedimentos Estéticos'],
  'Pediatria': ['Febre', 'Desenvolvimento Infantil', 'Alergias', 'Vacinação', 'Nutrição Infantil'],
  'Ortopedia': ['Dor nas Costas', 'Artrose', 'Tendinite', 'Fraturas', 'Postura'],
  'Nutrição': ['Receitas Saudáveis', 'Dieta Balanceada', 'Perda de Peso', 'Alimentos Funcionais'],
  'Psicologia': ['Ansiedade', 'Depressão', 'Autoestima', 'Relacionamentos', 'Terapia'],
  'Ginecologia': ['Gravidez', 'Menopausa', 'Prevenção', 'Exames', 'Contraceptivos'],
  'Oftalmologia': ['Miopia', 'Catarata', 'Vista Cansada', 'Lentes', 'Cirurgia'],
  // Adicione mais especialidades conforme necessário
};

// Categorias gerais para todas as especialidades
const generalCategories = ['Saúde', 'Bem-estar', 'Medicina', 'Pesquisa', 'Tecnologia', 'Nutrição', 'Psicologia', 'Pediatria', 'Geriatria'];

// Tags gerais populares
const popularTags = ['Prevenção', 'Tratamento', 'Dicas', 'Qualidade de Vida', 'Novidades', 'Pesquisas', 'COVID-19'];

// Interface para o form data
interface ArticleFormData {
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  slug: string;
  read_time: number;
}

const ArticleEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(id ? true : false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const editorRef = useRef<any>(null);
  const [authorSpecialty, setAuthorSpecialty] = useState<string>('');
  const [suggestedTags, setSuggestedTags] = useState<string[]>(popularTags);
  const [availableCategories, setAvailableCategories] = useState<string[]>(generalCategories);
  
  // Estado para filtrar tags sugeridas conforme usuário digita
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  // Form data para o artigo
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    excerpt: '',
    content: '',
    cover_image: '',
    category: 'Saúde',
    tags: [],
    status: 'draft', // draft ou published
    slug: '',
    read_time: 5
  });

  // Estado para tags (input separado)
  const [tagInput, setTagInput] = useState('');

  // Buscar especialidade do autor
  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data, error } = await supabase
          .from('partner_profiles')
          .select('specialty')
          .eq('user_id', user.id)
          .single();
          
        if (error) {
          console.error('Erro ao buscar dados do autor:', error);
          return;
        }
        
        if (data?.specialty) {
          setAuthorSpecialty(data.specialty);
          
          // Atualizar categorias e tags baseado na especialidade
          if (categoriesBySpecialty[data.specialty]) {
            setAvailableCategories([
              ...generalCategories, 
              ...categoriesBySpecialty[data.specialty]
            ]);
          }
          
          if (tagsBySpecialty[data.specialty]) {
            setSuggestedTags([
              ...popularTags,
              ...tagsBySpecialty[data.specialty]
            ]);
          }
        }
      } catch (error) {
        console.error('Erro:', error);
      }
    };
    
    fetchAuthorData();
  }, []);

  // Função para adicionar tag
  const addTag = (tag: string = tagInput.trim()) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag]
      });
      setTagInput('');
      setShowTagSuggestions(false);
    }
  };

  // Função para remover tag
  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  // Filtrar tags sugeridas baseado no input
  useEffect(() => {
    if (tagInput.trim()) {
      const filtered = suggestedTags.filter(tag => 
        tag.toLowerCase().includes(tagInput.toLowerCase()) && 
        !formData.tags.includes(tag)
      );
      setFilteredTags(filtered);
      setShowTagSuggestions(true);
    } else {
      setFilteredTags([]);
      setShowTagSuggestions(false);
    }
  }, [tagInput, suggestedTags, formData.tags]);

  // Função para calcular tempo de leitura
  const calculateReadTime = (content: string) => {
    // Uma pessoa lê em média 200 palavras por minuto
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);
    return readTime < 1 ? 1 : readTime;
  };

  // Gerar slug a partir do título
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };

  // Handler para mudanças no editor
  const handleEditorChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content,
      read_time: calculateReadTime(content)
    }));
  };

  // Carregar artigo existente se estiver editando
  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/especialista/login');
          return;
        }

        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('id', id)
          .eq('author_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching article:', error);
          toast.error('Erro ao carregar artigo');
          navigate('/especialista/dashboard');
        } else if (data) {
          setFormData({
            title: data.title || '',
            excerpt: data.excerpt || '',
            content: data.content || '',
            cover_image: data.cover_image || '',
            category: data.category || 'Saúde',
            tags: data.tags || [],
            status: data.status || 'draft',
            slug: data.slug || '',
            read_time: data.read_time || 5
          });
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, navigate]);

  // Atualizar slug e tempo de leitura ao mudar título ou conteúdo
  useEffect(() => {
    if (formData.title && !id) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(prev.title)
      }));
    }
  }, [formData.title, id]);

  // Salvar artigo
  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published' = 'draft') => {
    e.preventDefault();
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/especialista/login');
        return;
      }

      // Obter informações do autor
      const { data: authorData, error: authorError } = await supabase
        .from('partner_profiles')
        .select('full_name, specialty, email')
        .eq('user_id', user.id)
        .single();

      if (authorError) {
        console.error('Error fetching author data:', authorError);
        toast.error('Erro ao obter dados do autor');
        return;
      }

      // Dados do artigo
      const articleData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        cover_image: formData.cover_image,
        category: formData.category,
        tags: formData.tags,
        slug: formData.slug,
        read_time: formData.read_time,
        status: status,
        author_id: user.id,
        author_name: authorData.full_name,
        author_specialty: authorData.specialty,
        author_email: authorData.email,
        updated_at: new Date().toISOString()
      };

      if (id) {
        // Atualizar artigo existente
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', id);

        if (error) throw error;
        toast.success(`Artigo ${status === 'published' ? 'publicado' : 'salvo'} com sucesso!`);
      } else {
        // Criar novo artigo
        const { error } = await supabase
          .from('articles')
          .insert([{
            ...articleData,
            created_at: new Date().toISOString(),
            view_count: 0
          }]);

        if (error) throw error;
        toast.success(`Artigo ${status === 'published' ? 'publicado' : 'salvo como rascunho'} com sucesso!`);
      }

      navigate('/especialista/dashboard');
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error('Erro ao salvar artigo');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-verde-cia"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/especialista/dashboard" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
              <ArrowLeft className="w-5 h-5 mr-1" />
              <span>Voltar</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              {id ? 'Editar Artigo' : 'Novo Artigo'}
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className="flex items-center px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
            >
              <Eye className="w-5 h-5 mr-1" />
              <span>{preview ? 'Editar' : 'Visualizar'}</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          {!preview ? (
            <form onSubmit={(e) => handleSubmit(e, formData.status)}>
              <div className="grid grid-cols-1 gap-6">
                {/* Título */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título do Artigo*</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Um título claro e atrativo para seu artigo"
                    required
                  />
                </div>

                {/* Resumo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resumo (máx. 200 caracteres)*</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                    rows={3}
                    placeholder="Um breve resumo do que seu artigo aborda"
                    maxLength={200}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.excerpt.length}/200 caracteres
                  </p>
                </div>

                {/* Imagem de Capa */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Imagem de Capa*</label>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-4">
                      {formData.cover_image && (
                        <div className="w-20 h-20 rounded overflow-hidden bg-gray-100">
                          <img src={formData.cover_image} alt="Capa" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <input
                          type="text"
                          value={formData.cover_image}
                          onChange={(e) => setFormData({...formData, cover_image: e.target.value})}
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="URL da imagem de capa"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button 
                        type="button"
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        <span>Enviar imagem</span>
                      </button>
                      <p className="text-xs text-gray-500 ml-4">
                        Recomendado: 1200x630px, JPG ou PNG
                      </p>
                    </div>
                  </div>
                </div>

                {/* Categoria e Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Categoria*</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    >
                      {availableCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {authorSpecialty && (
                      <p className="text-xs text-gray-500 mt-1">
                        Categorias adaptadas para {authorSpecialty}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                    <div className="relative">
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                          onFocus={() => setShowTagSuggestions(!!tagInput.trim())}
                          className="flex-1 px-3 py-2 border rounded-l-md"
                          placeholder="Adicionar tag"
                        />
                        <button
                          type="button"
                          onClick={() => addTag()}
                          className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r-md hover:bg-gray-200"
                        >
                          <Tag className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {/* Sugestões de Tags */}
                      {showTagSuggestions && filteredTags.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                          {filteredTags.map(tag => (
                            <div 
                              key={tag}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                              onClick={() => addTag(tag)}
                            >
                              <span>{tag}</span>
                              <span className="text-gray-400 text-xs">Adicionar</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Tags Populares */}
                    {formData.tags.length === 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Tags populares:</p>
                        <div className="flex flex-wrap gap-1">
                          {suggestedTags.slice(0, 5).map(tag => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => addTag(tag)}
                              className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full text-xs text-gray-600"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Tags Selecionadas */}
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map((tag) => (
                          <span 
                            key={tag} 
                            className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-sm flex items-center"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1 rounded-full hover:bg-blue-100 p-1 flex items-center justify-center"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* URL amigável */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL Amigável</label>
                  <div className="flex items-center">
                    <span className="bg-gray-100 px-3 py-2 border border-r-0 rounded-l-md text-gray-500">
                      /blog/
                    </span>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      className="flex-1 px-3 py-2 border rounded-r-md"
                      placeholder="url-do-seu-artigo"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    A URL é gerada automaticamente a partir do título, mas você pode personalizá-la
                  </p>
                </div>

                {/* Conteúdo - Editor WYSIWYG */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Conteúdo do Artigo*</label>
                  <Editor
                    onInit={(_, editor) => editorRef.current = editor}
                    initialValue={formData.content}
                    onEditorChange={handleEditorChange}
                    init={{
                      height: 500,
                      menubar: true,
                      plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                      ],
                      toolbar: 'undo redo | formatselect | ' +
                        'bold italic backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Tempo estimado de leitura: {formData.read_time} min
                  </p>
                </div>

                {/* Botões de ação */}
                <div className="flex justify-end space-x-4 mt-4">
                  <Link
                    to="/especialista/dashboard"
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, 'draft')}
                    disabled={saving}
                    className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 disabled:opacity-70 flex items-center"
                  >
                    {saving && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>}
                    <span>Salvar Rascunho</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, 'published')}
                    disabled={saving}
                    className="px-6 py-2 bg-verde-cia text-white rounded-lg hover:bg-verde-cia-escuro disabled:opacity-70 flex items-center"
                  >
                    {saving && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>}
                    <Save className="w-5 h-5 mr-2" />
                    <span>Publicar</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            // Visualização do artigo
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <img 
                  src={formData.cover_image || 'https://via.placeholder.com/1200x630?text=Imagem+de+Capa'} 
                  alt={formData.title} 
                  className="w-full rounded-xl mb-4" 
                />
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{formData.title}</h1>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="mr-4">{new Date().toLocaleDateString('pt-BR')}</span>
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{formData.read_time} min de leitura</span>
                </div>
                <p className="text-gray-600 mb-6">{formData.excerpt}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-verde-cia/10 text-verde-cia px-3 py-1 rounded-full text-sm">
                    {formData.category}
                  </span>
                  {formData.tags.map((tag) => (
                    <span key={tag} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: formData.content }}>
              </div>

              <div className="mt-8 p-4 border-t border-gray-200">
                <div className="flex items-center text-sm text-yellow-500">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span>Esta é apenas uma visualização. O conteúdo pode ter aparência diferente quando publicado.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleEditor; 