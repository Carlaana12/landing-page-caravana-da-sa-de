import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ContentType, PageContent, ContentError, ContentState } from '../types/content';
import { toast } from 'react-hot-toast';

export function useContent(tipo: ContentType) {
  const [state, setState] = useState<ContentState>({
    content: null,
    isLoading: true,
    error: null,
    isDirty: false
  });

  useEffect(() => {
    loadContent();
  }, [tipo]);

  const loadContent = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data, error } = await supabase
        .from('pagina')
        .select('*')
        .eq('tipo', tipo)
        .single();

      if (error) throw error;

      setState(prev => ({
        ...prev,
        content: data,
        isLoading: false,
        error: null
      }));
    } catch (error: any) {
      console.error('Erro ao carregar conteúdo:', error);
      setState(prev => ({
        ...prev,
        error: { message: error.message },
        isLoading: false
      }));
    }
  };

  const updateContent = async (updates: Partial<PageContent>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const { data, error } = await supabase
        .from('pagina')
        .upsert({
          tipo,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setState(prev => ({
        ...prev,
        content: data,
        isLoading: false,
        error: null,
        isDirty: false
      }));

      toast.success('Conteúdo atualizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao atualizar conteúdo:', error);
      setState(prev => ({
        ...prev,
        error: { message: error.message },
        isLoading: false
      }));
      toast.error('Erro ao atualizar conteúdo');
    }
  };

  const setContent = (updates: Partial<PageContent>) => {
    setState(prev => ({
      ...prev,
      content: prev.content ? { ...prev.content, ...updates } : null,
      isDirty: true
    }));
  };

  return {
    ...state,
    updateContent,
    setContent,
    reloadContent: loadContent
  };
} 