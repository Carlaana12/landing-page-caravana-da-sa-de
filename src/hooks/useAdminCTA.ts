import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useAdminCTA() {
  const [ctas, setCtas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCtas() {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_cta')
        .select('*')
        .order('ordem', { ascending: true });
      if (!error && data) setCtas(data);
      setLoading(false);
    }
    fetchCtas();
  }, []);

  return { ctas, loading };
} 