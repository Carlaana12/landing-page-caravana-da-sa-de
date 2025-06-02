import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useAdminNews() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_news')
        .select('*')
        .order('ordem', { ascending: true });
      if (!error && data) setNews(data);
      setLoading(false);
    }
    fetchNews();
  }, []);

  return { news, loading };
} 