const supabase = require('../supabaseClient');

class StorageService {
  static async uploadFile(file, folder = 'uploads') {
    try {
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('media')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Obter URL pública do arquivo
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      return {
        path: filePath,
        url: publicUrl,
        name: fileName,
        type: file.mimetype,
        size: file.size
      };
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      throw error;
    }
  }

  static async deleteFile(filePath) {
    try {
      const { error } = await supabase.storage
        .from('media')
        .remove([filePath]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
      throw error;
    }
  }

  static async listFiles(folder = 'uploads') {
    try {
      const { data, error } = await supabase.storage
        .from('media')
        .list(folder);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao listar arquivos:', error);
      throw error;
    }
  }
}

module.exports = StorageService; 