import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useAdminPartners() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPartners() {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_partners')
        .select('*')
        .order('ordem', { ascending: true });
      if (!error && data) setPartners(data);
      setLoading(false);
    }
    fetchPartners();
  }, []);

  return { partners, loading };
} 