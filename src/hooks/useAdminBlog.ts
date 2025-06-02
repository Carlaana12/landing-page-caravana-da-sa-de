import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useAdminBlog() {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogPosts() {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_blog')
        .select('*')
        .order('ordem', { ascending: true });
      if (!error && data) setBlogPosts(data);
      setLoading(false);
    }
    fetchBlogPosts();
  }, []);

  return { blogPosts, loading };
} 