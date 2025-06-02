import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useAdminPodcast() {
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPodcasts() {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_podcast')
        .select('*')
        .order('ordem', { ascending: true });
      if (!error && data) setPodcasts(data);
      setLoading(false);
    }
    fetchPodcasts();
  }, []);

  return { podcasts, loading };
} 