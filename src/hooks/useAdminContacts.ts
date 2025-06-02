import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useAdminContacts() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContacts() {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_contacts')
        .select('*')
        .order('ordem', { ascending: true });
      if (!error && data) setContacts(data);
      setLoading(false);
    }
    fetchContacts();
  }, []);

  return { contacts, loading };
} 