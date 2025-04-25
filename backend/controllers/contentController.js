const supabase = require('../supabaseClient');
const multer = require('multer');
const StorageService = require('../services/storageService');
const { logger } = require('../utils/logger');

// Configuração do Multer para processar arquivos em memória
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido'), false);
    }
  }
});

module.exports = {
  // Criar ou editar uma notícia
  createOrUpdateNews: async (req, res) => {
    const { title, content, summary, category, tags, author, status } = req.body;
    let imageUrl = null;

    try {
      // Se houver arquivo, fazer upload para o Supabase Storage
      if (req.file) {
        const uploadResult = await StorageService.uploadFile(req.file, 'news');
        imageUrl = uploadResult.url;
        logger.info('Arquivo enviado com sucesso', { file: uploadResult });
      }

      const { data, error } = await supabase
        .from('news')
        .upsert([
          {
            title,
            content,
            summary,
            category,
            tags,
            author,
            status,
            image_url: imageUrl,
            updated_at: new Date().toISOString(),
          },
        ]);

      if (error) {
        logger.error('Erro ao salvar notícia', { error });
        return res.status(500).json({ message: 'Erro ao salvar a notícia', error: error.message });
      }

      logger.info('Notícia salva com sucesso', { data });
      res.status(200).json({ message: 'Notícia salva com sucesso', data });
    } catch (err) {
      logger.error('Erro interno', { error: err });
      res.status(500).json({ message: 'Erro interno', error: err.message });
    }
  },

  // Listar todas as notícias
  getAllNews: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        logger.error('Erro ao buscar notícias', { error });
        return res.status(500).json({ message: 'Erro ao buscar notícias', error: error.message });
      }

      logger.info('Notícias listadas com sucesso', { count: data.length });
      res.status(200).json(data);
    } catch (err) {
      logger.error('Erro interno', { error: err });
      res.status(500).json({ message: 'Erro interno', error: err.message });
    }
  },

  // Obter uma notícia específica
  getNewsById: async (req, res) => {
    const { id } = req.params;
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        logger.error('Erro ao buscar notícia', { error, id });
        return res.status(500).json({ message: 'Erro ao buscar notícia', error: error.message });
      }

      logger.info('Notícia encontrada', { id });
      res.status(200).json(data);
    } catch (err) {
      logger.error('Erro interno', { error: err });
      res.status(500).json({ message: 'Erro interno', error: err.message });
    }
  },

  // Excluir uma notícia
  deleteNews: async (req, res) => {
    const { id } = req.params;
    try {
      // Primeiro, obter a notícia para deletar a imagem associada
      const { data: news, error: fetchError } = await supabase
        .from('news')
        .select('image_url')
        .eq('id', id)
        .single();

      if (fetchError) {
        logger.error('Erro ao buscar notícia para exclusão', { error: fetchError, id });
        return res.status(500).json({ message: 'Erro ao buscar notícia', error: fetchError.message });
      }

      // Se houver imagem, deletar do storage
      if (news?.image_url) {
        const filePath = news.image_url.split('/').pop();
        await StorageService.deleteFile(`news/${filePath}`);
      }

      // Deletar a notícia
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);
        
      if (error) {
        logger.error('Erro ao excluir notícia', { error, id });
        return res.status(500).json({ message: 'Erro ao excluir notícia', error: error.message });
      }

      logger.info('Notícia excluída com sucesso', { id });
      res.status(200).json({ message: 'Notícia excluída com sucesso.' });
    } catch (err) {
      logger.error('Erro interno', { error: err });
      res.status(500).json({ message: 'Erro interno', error: err.message });
    }
  },

  // Upload de mídia
  uploadMedia: upload.single('media'),
}; 