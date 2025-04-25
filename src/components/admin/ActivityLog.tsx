'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Log } from '@/lib/supabase';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ActivityLog() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('logs')
        .select(`
          *,
          user:users(full_name)
        `)
        .order('timestamp', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionText = (log: Log) => {
    const actionMap = {
      create: 'criou',
      edit: 'editou',
      delete: 'excluiu'
    };

    const targetMap = {
      post: 'o post',
      page: 'a página',
      hospital: 'o hospital',
      pharmacy: 'a farmácia',
      first_aid: 'o pronto-socorro'
    };

    return `${actionMap[log.action]} ${targetMap[log.target_type]} "${log.target_name}"`;
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Histórico de Atividades</h2>
      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start space-x-4 p-4 border-b border-gray-100 last:border-0">
            <div className="flex-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">{log.user.full_name}</span>{' '}
                {getActionText(log)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {format(new Date(log.timestamp), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 