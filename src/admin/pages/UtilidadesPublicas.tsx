import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Building2, Phone, Mail, Edit2, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

interface UtilidadePublica {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
  email?: string;
  tipo: 'ubs' | 'farmacia' | 'hospital' | 'clinica';
  created_at: string;
}

export default function UtilidadesPublicas() {
  const navigate = useNavigate();
  const [utilidades, setUtilidades] = useState<UtilidadePublica[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('');

  useEffect(() => {
    loadUtilidades();
  }, []);

  const loadUtilidades = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('utilidades_publicas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUtilidades(data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar utilidades públicas');
      console.error('Erro ao carregar utilidades públicas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta utilidade pública?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('utilidades_publicas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setUtilidades(utilidades.filter(utilidade => utilidade.id !== id));
      toast.success('Utilidade pública excluída com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao excluir utilidade pública');
      console.error('Erro ao excluir utilidade pública:', error);
    }
  };

  const filteredUtilidades = utilidades.filter(utilidade => {
    const matchesSearch = utilidade.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      utilidade.endereco.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = !selectedTipo || utilidade.tipo === selectedTipo;
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
        <h1 className="text-2xl font-bold text-gray-900">Utilidades Públicas</h1>
        <button
          onClick={() => navigate('/arearestrita/utilidades/nova')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-verde-cia hover:bg-verde-cia-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde-cia"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nova Utilidade
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar utilidades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-verde-cia focus:border-transparent"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
            <div className="sm:w-64">
              <select
                value={selectedTipo}
                onChange={(e) => setSelectedTipo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-verde-cia focus:border-transparent"
              >
                <option value="">Todos os tipos</option>
                <option value="ubs">UBS</option>
                <option value="farmacia">Farmácia</option>
                <option value="hospital">Hospital</option>
                <option value="clinica">Clínica</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Endereço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUtilidades.map((utilidade) => (
                <tr key={utilidade.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building2 className="w-5 h-5 text-gray-400 mr-2" />
                      <div className="text-sm font-medium text-gray-900">
                        {utilidade.nome}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {utilidade.endereco}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="w-4 h-4 mr-1" />
                        {utilidade.telefone}
                      </div>
                      {utilidade.email && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="w-4 h-4 mr-1" />
                          {utilidade.email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-verde-cia bg-opacity-10 text-verde-cia">
                      {utilidade.tipo.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => navigate(`/arearestrita/utilidades/${utilidade.id}`)}
                      className="text-verde-cia hover:text-verde-cia-dark mr-3"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(utilidade.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUtilidades.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Nenhuma utilidade pública encontrada
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