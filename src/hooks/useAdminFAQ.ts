import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useAdminFAQ() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFaqs() {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_faq')
        .select('*')
        .order('ordem', { ascending: true });
      if (!error && data) setFaqs(data);
      setLoading(false);
    }
    fetchFaqs();
  }, []);

  return { faqs, loading };
} 