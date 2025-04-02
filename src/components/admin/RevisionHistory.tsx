import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { History, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface Revision {
  id: string;
  content: any;
  meta_description: string | null;
  created_at: string;
  revision_number: number;
}

interface RevisionHistoryProps {
  pageId: string;
  onRestore: (content: any, metaDescription: string | null) => void;
}

const RevisionHistory: React.FC<RevisionHistoryProps> = ({ pageId, onRestore }) => {
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevisions();
  }, [pageId]);

  const fetchRevisions = async () => {
    try {
      const { data, error } = await supabase
        .from('page_revisions')
        .select('*')
        .eq('page_id', pageId)
        .order('revision_number', { ascending: false });

      if (error) throw error;
      setRevisions(data || []);
    } catch (error) {
      toast.error('Erro ao carregar histórico de revisões');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Carregando histórico...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center">
        <History className="w-5 h-5 mr-2" />
        Histórico de Revisões
      </h3>
      
      <div className="space-y-2">
        {revisions.map((revision) => (
          <div
            key={revision.id}
            className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Revisão #{revision.revision_number}
                </p>
                <p className="text-sm text-gray-500">
                  {format(new Date(revision.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
              <button
                onClick={() => onRestore(revision.content, revision.meta_description)}
                className="flex items-center text-verde-cia hover:text-verde-cia-escuro transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Restaurar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevisionHistory;