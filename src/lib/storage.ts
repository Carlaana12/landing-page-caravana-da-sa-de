import { supabase } from './supabase';
import toast from 'react-hot-toast';

export async function uploadImage(file: File) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `pages/${fileName}`;

    // Tenta sobrescrever se o arquivo já existir
    const { error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      toast.error('Erro ao enviar imagem: ' + uploadError.message);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath);

    if (!data || !data.publicUrl) {
      toast.error('Erro ao obter URL pública da imagem');
      throw new Error('Erro ao obter URL pública da imagem');
    }

    return data.publicUrl;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    toast.error('Erro ao enviar imagem: ' + (error?.message || 'Erro desconhecido'));
    throw error;
  }
}

export async function uploadVideo(file: File) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `videos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      toast.error('Erro ao enviar vídeo: ' + uploadError.message);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath);

    if (!data || !data.publicUrl) {
      toast.error('Erro ao obter URL pública do vídeo');
      throw new Error('Erro ao obter URL pública do vídeo');
    }

    return data.publicUrl;
  } catch (error: any) {
    console.error('Error uploading video:', error);
    toast.error('Erro ao enviar vídeo: ' + (error?.message || 'Erro desconhecido'));
    throw error;
  }
}