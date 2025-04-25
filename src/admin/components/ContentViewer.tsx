import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  Search, 
  Filter, 
  Calendar, 
  Tag, 
  Edit, 
  Trash2, 
  Eye, 
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader,
  Calendar as CalendarIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface Content {
  id: string;
  titulo: string;
  resumo?: string;
  conteudo: string;
  imagem_url?: string;
  categoria?: string;
  tags?: string[];
  autor?: string;
  data_publicacao: string;
  status: 'publicado' | 'rascunho' | 'agendado';
  created_at: string;
  updated_at: string;
  tipo: string;
}

interface ContentViewerProps {
  contentType: string;
  title: string;
  allowCategories?: boolean;
  categories?: string[];
  addPath: string;
  editPathPrefix: string;
}

const ContentViewer: React.FC<ContentViewerProps> = ({
  contentType,
  title,
  allowCategories = false,
  categories = [],
  addPath,
  editPathPrefix
}) => {
  const navigate = useNavigate();
  const [contents, setContents] = useState<Content[]>([]);
  const [filteredContents, setFilteredContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<string | null>(null);

  // Buscar conteúdos
  useEffect(() => {
    fetchContents();
  }, [contentType]);

  // Filtrar conteúdos com base nos critérios de pesquisa
  useEffect(() => {
    let filtered = [...contents];

    // Filtrar por termo de pesquisa
    if (searchTerm) {
      filtered = filtered.filter(
        content =>
          content.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (content.resumo && content.resumo.toLowerCase().includes(searchTerm.toLowerCase())) ||
          content.conteudo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoria
    if (selectedCategory) {
      filtered = filtered.filter(content => content.categoria === selectedCategory);
    }

    // Filtrar por status
    if (selectedStatus) {
      filtered = filtered.filter(content => content.status === selectedStatus);
    }

    // Filtrar por período
    if (selectedDateRange) {
      const today = new Date();
      const filteredDate = new Date();
      
      switch(selectedDateRange) {
        case 'hoje':
          filtered = filtered.filter(content => {
            const date = new Date(content.data_publicacao);
            return date.toDateString() === today.toDateString();
          });
          break;
        case 'semana':
          filteredDate.setDate(today.getDate() - 7);
          filtered = filtered.filter(content => {
            const date = new Date(content.data_publicacao);
            return date >= filteredDate;
          });
          break;
        case 'mes':
          filteredDate.setMonth(today.getMonth() - 1);
          filtered = filtered.filter(content => {
            const date = new Date(content.data_publicacao);
            return date >= filteredDate;
          });
          break;
        case 'ano':
          filteredDate.setFullYear(today.getFullYear() - 1);
          filtered = filtered.filter(content => {
            const date = new Date(content.data_publicacao);
            return date >= filteredDate;
          });
          break;
      }
    }

    setFilteredContents(filtered);
  }, [contents, searchTerm, selectedCategory, selectedStatus, selectedDateRange]);

  const fetchContents = async () => {
    try {
      setIsLoading(true);
      
      let query = supabase.from('conteudos')
        .select('*')
        .eq('tipo', contentType)
        .order('data_publicacao', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      setContents(data || []);
      setFilteredContents(data || []);
    } catch (error) {
      console.error('Erro ao buscar conteúdos:', error);
      toast.error('Não foi possível carregar os conteúdos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setContentToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!contentToDelete) return;

    try {
      const { error } = await supabase
        .from('conteudos')
        .delete()
        .eq('id', contentToDelete);

      if (error) throw error;

      // Atualizar a lista de conteúdos
      setContents(contents.filter(content => content.id !== contentToDelete));
      toast.success('Conteúdo excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir conteúdo:', error);
      toast.error('Não foi possível excluir o conteúdo');
    } finally {
      setShowDeleteModal(false);
      setContentToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: ptBR });
    } catch (error) {
      return 'Data inválida';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'publicado':
        return (
          <span className="flex items-center px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Publicado
          </span>
        );
      case 'rascunho':
        return (
          <span className="flex items-center px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
            <Edit className="w-3 h-3 mr-1" />
            Rascunho
          </span>
        );
      case 'agendado':
        return (
          <span className="flex items-center px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Agendado
          </span>
        );
      default:
        return (
          <span className="flex items-center px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Desconhecido
          </span>
        );
    }
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
      {/* Cabeçalho e botões de ação */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <button
          onClick={() => navigate(addPath)}
          className="inline-flex items-center px-4 py-2 bg-verde-cia text-white rounded-md hover:bg-verde-cia-dark transition-colors focus:outline-none focus:ring-2 focus:ring-verde-cia focus:ring-offset-2"
        >
          <Plus className="w-5 h-5 mr-2" />
          Adicionar novo
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          {/* Pesquisa */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-verde-cia focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Filtro de status */}
          <div className="w-full md:w-48">
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-verde-cia focus:border-transparent appearance-none"
              >
                <option value="">Todos os status</option>
                <option value="publicado">Publicado</option>
                <option value="rascunho">Rascunho</option>
                <option value="agendado">Agendado</option>
              </select>
              <Filter className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Filtro de data */}
          <div className="w-full md:w-48">
            <div className="relative">
              <select
                value={selectedDateRange}
                onChange={e => setSelectedDateRange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-verde-cia focus:border-transparent appearance-none"
              >
                <option value="">Qualquer data</option>
                <option value="hoje">Hoje</option>
                <option value="semana">Última semana</option>
                <option value="mes">Último mês</option>
                <option value="ano">Último ano</option>
              </select>
              <Calendar className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Filtro de categoria (se permitido) */}
          {allowCategories && (
            <div className="w-full md:w-48">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-verde-cia focus:border-transparent appearance-none"
                >
                  <option value="">Todas as categorias</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <Tag className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              </div>
            </div>
          )}
        </div>

        {/* Contador de resultados */}
        <div className="text-sm text-gray-500">
          {filteredContents.length} {filteredContents.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
        </div>
      </div>

      {/* Grade de conteúdos */}
      {filteredContents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContents.map(content => (
            <div key={content.id} className="bg-white rounded-lg shadow overflow-hidden group hover:shadow-md transition-shadow">
              {/* Imagem do conteúdo (se existir) */}
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                {content.imagem_url ? (
                  <img
                    src={content.imagem_url}
                    alt={content.titulo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <CalendarIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex space-x-1">
                  {getStatusBadge(content.status)}
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-4 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">{content.titulo}</h2>
                {content.resumo && (
                  <p className="text-gray-600 text-sm line-clamp-2">{content.resumo}</p>
                )}

                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{formatDate(content.data_publicacao)}</span>
                </div>

                {allowCategories && content.categoria && (
                  <div className="flex items-center text-xs text-gray-500">
                    <Tag className="w-4 h-4 mr-1" />
                    <span>{content.categoria}</span>
                  </div>
                )}
              </div>

              {/* Botões de ação */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between">
                <div className="flex space-x-2">
                  <button 
                    className="p-2 text-gray-600 hover:text-verde-cia rounded-full hover:bg-gray-100 transition-colors"
                    title="Visualizar"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => navigate(`${editPathPrefix}/${content.id}`)}
                    className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(content.id)}
                    className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="max-w-md mx-auto">
            <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhum conteúdo encontrado</h3>
            <p className="mt-2 text-gray-500">
              Não encontramos nenhum conteúdo com os filtros selecionados. Tente ajustar seus filtros ou crie um novo conteúdo.
            </p>
            <button
              onClick={() => navigate(addPath)}
              className="mt-6 inline-flex items-center px-4 py-2 bg-verde-cia text-white rounded-md hover:bg-verde-cia-dark transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Adicionar novo
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmar exclusão</h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir este conteúdo? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentViewer; 