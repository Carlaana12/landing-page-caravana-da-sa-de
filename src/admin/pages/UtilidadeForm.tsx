import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Loader2 } from 'lucide-react';
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

export default function UtilidadeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [utilidade, setUtilidade] = useState<Partial<UtilidadePublica>>({
    nome: '',
    endereco: '',
    telefone: '',
    email: '',
    tipo: 'ubs'
  });

  useEffect(() => {
    if (id) {
      loadUtilidade();
    }
  }, [id]);

  const loadUtilidade = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('utilidades_publicas')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setUtilidade(data);
    } catch (error: any) {
      toast.error('Erro ao carregar utilidade pública');
      console.error('Erro ao carregar utilidade pública:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (id) {
        const { error } = await supabase
          .from('utilidades_publicas')
          .update(utilidade)
          .eq('id', id);

        if (error) throw error;
        toast.success('Utilidade pública atualizada com sucesso!');
      } else {
        const { error } = await supabase
          .from('utilidades_publicas')
          .insert([utilidade]);

        if (error) throw error;
        toast.success('Utilidade pública criada com sucesso!');
      }

      navigate('/arearestrita/utilidades');
    } catch (error: any) {
      toast.error('Erro ao salvar utilidade pública');
      console.error('Erro ao salvar utilidade pública:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir esta utilidade pública?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('utilidades_publicas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Utilidade pública excluída com sucesso!');
      navigate('/arearestrita/utilidades');
    } catch (error: any) {
      toast.error('Erro ao excluir utilidade pública');
      console.error('Erro ao excluir utilidade pública:', error);
    }
  };

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
        <button
          onClick={() => navigate('/arearestrita/utilidades')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </button>
        {id && (
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Excluir
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                type="text"
                id="nome"
                value={utilidade.nome}
                onChange={(e) => setUtilidade({ ...utilidade, nome: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-verde-cia focus:border-verde-cia sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="endereco" className="block text-sm font-medium text-gray-700">
                Endereço
              </label>
              <input
                type="text"
                id="endereco"
                value={utilidade.endereco}
                onChange={(e) => setUtilidade({ ...utilidade, endereco: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-verde-cia focus:border-verde-cia sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <input
                type="text"
                id="telefone"
                value={utilidade.telefone}
                onChange={(e) => setUtilidade({ ...utilidade, telefone: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-verde-cia focus:border-verde-cia sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={utilidade.email}
                onChange={(e) => setUtilidade({ ...utilidade, email: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-verde-cia focus:border-verde-cia sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
                Tipo
              </label>
              <select
                id="tipo"
                value={utilidade.tipo}
                onChange={(e) => setUtilidade({ ...utilidade, tipo: e.target.value as UtilidadePublica['tipo'] })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-verde-cia focus:border-verde-cia sm:text-sm"
                required
              >
                <option value="ubs">UBS</option>
                <option value="farmacia">Farmácia</option>
                <option value="hospital">Hospital</option>
                <option value="clinica">Clínica</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-verde-cia hover:bg-verde-cia-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde-cia"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Salvar
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 