import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ContentEditor from '../components/ContentEditor';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { ChevronLeft } from 'lucide-react';
import { ContentSchema, Content } from '../types/content';

const noticiaSchema: ContentSchema = {
  fields: [
    {
      name: 'titulo',
      label: 'Título',
      type: 'text',
      required: true
    },
    {
      name: 'subtitulo',
      label: 'Subtítulo',
      type: 'text'
    },
    {
      name: 'imagem_url',
      label: 'Imagem Principal',
      type: 'image'
    },
    {
      name: 'conteudo',
      label: 'Conteúdo',
      type: 'rich-text',
      required: true
    },
    {
      name: 'data_publicacao',
      label: 'Data de Publicação',
      type: 'date',
      required: true
    },
    {
      name: 'categoria',
      label: 'Categoria',
      type: 'category',
      required: true,
      options: ['Saúde', 'Bem-estar', 'Medicina', 'Pesquisa', 'Eventos']
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'tags'
    },
    {
      name: 'autor',
      label: 'Autor',
      type: 'text',
      required: true
    }
  ]
};

export default function NoticiaForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [noticia, setNoticia] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadNoticia();
    }
  }, [id]);

  const loadNoticia = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('noticias')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setNoticia(data);
    } catch (error: any) {
      toast.error('Erro ao carregar notícia');
      console.error('Erro ao carregar notícia:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: Content) => {
    toast.success('Notícia salva com sucesso!');
    navigate('/arearestrita/noticias');
  };

  const handleDelete = async () => {
    navigate('/arearestrita/noticias');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/arearestrita/noticias')}
          className="inline-flex items-center text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="w-5 h-5" />
          Voltar
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {id ? 'Editar Notícia' : 'Nova Notícia'}
        </h1>
      </div>

      <ContentEditor
        id={id}
        tipo="noticia"
        table="noticias"
        initialData={noticia}
        schema={noticiaSchema}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
} 