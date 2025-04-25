import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  Loader2, Search, PlusCircle, Edit2, Trash2, Eye, 
  Filter, CalendarIcon, TagIcon, CheckCircle, AlertTriangle, Clock, 
  ChevronDown, X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import AdminLayout from '../components/AdminLayout';

interface Content {
  id: string;
  titulo: string;
  resumo: string;
  tipo: string;
  status: 'rascunho' | 'publicado' | 'agendado';
  autor?: string;
  created_at: string;
  updated_at: string;
  data_publicacao?: string;
  categoria?: string;
  tags?: string[];
}

const ContentManager: React.FC = () => {
  // Estados básicos
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Estados para filtros
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [tipoFilter, setTipoFilter] = useState<string>('todos');
  const [dateFilter, setDateFilter] = useState<string>('');
  
  // Lista de tipos disponíveis
  const [tiposDisponiveis, setTiposDisponiveis] = useState<string[]>([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('conteudos')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      setContents(data || []);
      
      // Extrair tipos únicos para o filtro
      if (data) {
        const tipos = [...new Set(data.map(item => item.tipo))];
        setTiposDisponiveis(tipos);
      }
    } catch (error) {
      console.error('Erro ao carregar conteúdos:', error);
      toast.error('Não foi possível carregar os conteúdos.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('conteudos')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;
      
      setContents(contents.filter(content => content.id !== deleteId));
      toast.success('Conteúdo excluído com sucesso!');
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Erro ao excluir conteúdo:', error);
      toast.error('Não foi possível excluir o conteúdo.');
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const resetFilters = () => {
    setStatusFilter('todos');
    setTipoFilter('todos');
    setDateFilter('');
  };

  // Função para filtrar conteúdos com todos os critérios
  const getFilteredContents = () => {
    return contents.filter(content => {
      // Filtro de pesquisa
      const matchesSearch = 
        content.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.resumo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.autor?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro de status
      const matchesStatus = 
        statusFilter === 'todos' || 
        content.status === statusFilter;
      
      // Filtro de tipo
      const matchesTipo = 
        tipoFilter === 'todos' || 
        content.tipo === tipoFilter;
      
      // Filtro de data
      const matchesDate = 
        !dateFilter || 
        (content.data_publicacao && content.data_publicacao.includes(dateFilter));
      
      return matchesSearch && matchesStatus && matchesTipo && matchesDate;
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'publicado':
        return 'bg-green-100 text-green-800';
      case 'agendado':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'publicado':
        return <CheckCircle className="w-4 h-4 mr-1" />;
      case 'agendado':
        return <Clock className="w-4 h-4 mr-1" />;
      default:
        return <AlertTriangle className="w-4 h-4 mr-1" />;
    }
  };

  const getTypeLabel = (tipo: string) => {
    const tipos: Record<string, string> = {
      'sobre': 'Sobre Nós',
      'tratamento': 'Tratamento',
      'servico': 'Serviço',
      'encontre-aqui': 'Encontre Aqui',
      'institucional': 'Institucional',
      'noticia': 'Notícia',
      'evento': 'Evento',
      'utilidade': 'Utilidade Pública'
    };
    return tipos[tipo] || tipo;
  };

  const filteredContents = getFilteredContents();

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Gerenciador de Conteúdo</h1>
          <button
            onClick={() => navigate('/arearestrita/content/novo')}
            className="bg-verde-cia hover:bg-verde-cia-dark text-white py-2 px-4 rounded-lg flex items-center shadow-sm transition-colors"
          >
            <PlusCircle className="mr-2" size={18} />
            Novo Conteúdo
          </button>
        </div>

        {/* Barra de ferramentas: pesquisa e filtros */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Campo de pesquisa */}
            <div className="flex-1 relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-verde-cia focus:border-verde-cia block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-2 pr-4"
                placeholder="Pesquisar conteúdo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Botão de filtros */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-3 py-2 rounded-lg border ${
                showFilters ? 'bg-verde-cia text-white border-verde-cia' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              } transition-colors`}
            >
              <Filter className="h-5 w-5 mr-2" />
              Filtros
              <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${showFilters ? 'transform rotate-180' : ''}`} />
            </button>
          </div>

          {/* Painel de filtros expansível */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Filtro de Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-lg border-gray-300 focus:border-verde-cia focus:ring-verde-cia"
                >
                  <option value="todos">Todos</option>
                  <option value="publicado">Publicado</option>
                  <option value="rascunho">Rascunho</option>
                  <option value="agendado">Agendado</option>
                </select>
              </div>
              
              {/* Filtro de Tipo/Categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                  value={tipoFilter}
                  onChange={(e) => setTipoFilter(e.target.value)}
                  className="w-full rounded-lg border-gray-300 focus:border-verde-cia focus:ring-verde-cia"
                >
                  <option value="todos">Todas</option>
                  {tiposDisponiveis.map((tipo) => (
                    <option key={tipo} value={tipo}>{getTypeLabel(tipo)}</option>
                  ))}
                </select>
              </div>
              
              {/* Filtro de Data */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Publicação</label>
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="focus:ring-verde-cia focus:border-verde-cia block w-full pl-10 sm:text-sm border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              
              {/* Botão para limpar filtros */}
              <div className="sm:col-span-3 flex justify-end mt-2">
                <button
                  onClick={resetFilters}
                  className="text-sm text-gray-600 flex items-center hover:text-gray-900"
                >
                  <X className="h-4 w-4 mr-1" />
                  Limpar filtros
                </button>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin h-8 w-8 text-verde-cia" />
          </div>
        ) : filteredContents.length === 0 ? (
          <div className="bg-white shadow-sm overflow-hidden rounded-lg p-6 text-center">
            <p className="text-gray-500">Nenhum conteúdo encontrado.</p>
          </div>
        ) : (
          <div className="bg-white shadow-sm overflow-hidden rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Autor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Atualizado em
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContents.map((content) => (
                  <tr key={content.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{content.titulo}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{content.resumo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <TagIcon className="flex-shrink-0 h-4 w-4 text-gray-400 mr-1" />
                        <div className="text-sm text-gray-900">{getTypeLabel(content.tipo)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusClass(content.status)}`}>
                        {getStatusIcon(content.status)}
                        {content.status === 'publicado' ? 'Publicado' : 
                         content.status === 'agendado' ? 'Agendado' : 'Rascunho'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-900">{content.autor || 'Não informado'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(content.updated_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => navigate(`/arearestrita/content/visualizar/${content.id}`)} 
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-colors"
                          title="Visualizar"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => navigate(`/arearestrita/content/editar/${content.id}`)} 
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => confirmDelete(content.id)} 
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal de confirmação de exclusão */}
        {showDeleteModal && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <Trash2 className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Confirmar exclusão</h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Tem certeza que deseja excluir este conteúdo? Esta ação não pode ser desfeita.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button 
                    type="button" 
                    className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                    onClick={handleDelete}
                  >
                    Excluir
                  </button>
                  <button 
                    type="button" 
                    className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ContentManager; 