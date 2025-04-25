const WebSocket = require('ws');
const { logger } = require('../utils/logger');

class NotificationService {
  constructor() {
    this.clients = new Set();
    this.wss = null;
  }

  initialize(server) {
    this.wss = new WebSocket.Server({ server });

    this.wss.on('connection', (ws) => {
      this.clients.add(ws);
      logger.info('Novo cliente WebSocket conectado');

      ws.on('close', () => {
        this.clients.delete(ws);
        logger.info('Cliente WebSocket desconectado');
      });
    });
  }

  broadcast(type, data) {
    const message = JSON.stringify({ type, data, timestamp: new Date().toISOString() });
    
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });

    logger.info('Notificação enviada', { type, data });
  }

  // Métodos específicos para diferentes tipos de notificações
  notifyNewsCreated(news) {
    this.broadcast('news_created', news);
  }

  notifyNewsUpdated(news) {
    this.broadcast('news_updated', news);
  }

  notifyNewsDeleted(newsId) {
    this.broadcast('news_deleted', { id: newsId });
  }

  notifyUserLoggedIn(user) {
    this.broadcast('user_logged_in', { userId: user.id, email: user.email });
  }
}

module.exports = new NotificationService(); 