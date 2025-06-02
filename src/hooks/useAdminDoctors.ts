import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useAdminDoctors() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoctors() {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_doctors')
        .select('*')
        .order('ordem', { ascending: true });
      if (!error && data) setDoctors(data);
      setLoading(false);
    }
    fetchDoctors();
  }, []);

  return { doctors, loading };
} 