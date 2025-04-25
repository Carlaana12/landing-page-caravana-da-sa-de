import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, User, Mail, Calendar, CheckCircle, XCircle, Edit2, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Usuario {
  id: string;
  email: string;
  nome: string;
  criado_em: string;
  ultimo_login: string;
  tipo: 'admin' | 'especialista' | 'usuario';
  ativo: boolean;
}

export default function Usuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('');

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) throw error;

      setUsuarios(data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar usuários');
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setUsuarios(usuarios.filter(usuario => usuario.id !== id));
      toast.success('Usuário excluído com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao excluir usuário');
      console.error('Erro ao excluir usuário:', error);
    }
  };

  const handleToggleStatus = async (id: string, ativo: boolean) => {
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ ativo: !ativo })
        .eq('id', id);

      if (error) throw error;

      setUsuarios(
        usuarios.map(usuario =>
          usuario.id === id ? { ...usuario, ativo: !ativo } : usuario
        )
      );

      toast.success(`Usuário ${!ativo ? 'ativado' : 'desativado'} com sucesso!`);
    } catch (error: any) {
      toast.error('Erro ao atualizar status do usuário');
      console.error('Erro ao atualizar status do usuário:', error);
    }
  };

  const formatarData = (dataString: string) => {
    try {
      if (!dataString) return 'N/A';
      
      return formatDistanceToNow(new Date(dataString), {
        addSuffix: true,
        locale: ptBR
      });
    } catch (error) {
      return 'Data inválida';
    }
  };

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = 
      usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTipo = !filtroTipo || usuario.tipo === filtroTipo;
    
    return matchesSearch && matchesTipo;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-verde-cia animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
        <button
          onClick={() => navigate('/arearestrita/usuarios/criar')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-verde-cia hover:bg-verde-cia-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde-cia"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Usuário
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-verde-cia focus:border-transparent"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
            <div className="sm:w-64">
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-verde-cia focus:border-transparent"
              >
                <option value="">Todos os tipos</option>
                <option value="admin">Administradores</option>
                <option value="especialista">Especialistas</option>
                <option value="usuario">Pacientes</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cadastrado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsuarios.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {usuario.nome}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {usuario.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${usuario.tipo === 'admin' ? 'bg-purple-100 text-purple-800' : 
                       usuario.tipo === 'especialista' ? 'bg-blue-100 text-blue-800' : 
                       'bg-green-100 text-green-800'}`}
                    >
                      {usuario.tipo === 'admin' ? 'Administrador' : 
                       usuario.tipo === 'especialista' ? 'Especialista' : 
                       'Paciente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatarData(usuario.criado_em)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {usuario.ultimo_login ? formatarData(usuario.ultimo_login) : 'Nunca'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(usuario.id, usuario.ativo)}
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                        ${usuario.ativo 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                    >
                      {usuario.ativo ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Ativo
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 mr-1" />
                          Inativo
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => navigate(`/arearestrita/usuarios/${usuario.id}`)}
                      className="text-verde-cia hover:text-verde-cia-dark mr-3"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(usuario.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsuarios.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 