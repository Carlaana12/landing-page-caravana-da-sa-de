import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useAdminEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_events')
        .select('*')
        .order('ordem', { ascending: true });
      if (!error && data) setEvents(data);
      setLoading(false);
    }
    fetchEvents();
  }, []);

  return { events, loading };
} 