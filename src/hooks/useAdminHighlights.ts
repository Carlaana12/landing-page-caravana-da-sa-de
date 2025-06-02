import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useAdminHighlights() {
  const [highlights, setHighlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHighlights() {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_highlights')
        .select('*')
        .order('ordem', { ascending: true });
      if (!error && data) setHighlights(data);
      setLoading(false);
    }
    fetchHighlights();
  }, []);

  return { highlights, loading };
} 