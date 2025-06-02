import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useAdminCarousel() {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSlides() {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_carousel')
        .select('*')
        .order('ordem', { ascending: true });
      if (!error && data) setSlides(data);
      setLoading(false);
    }
    fetchSlides();
  }, []);

  return { slides, loading };
} 