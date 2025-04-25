const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');
const { requestLogger, errorLogger } = require('./utils/logger');
const notificationService = require('./services/notificationService');
const { loginLimiter, apiLimiter } = require('./middleware/rateLimiter');
const { csrfProtection, generateCsrfToken, cookieParser } = require('./middleware/csrf');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Inicializar serviço de notificações
notificationService.initialize(server);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
app.use(requestLogger);

// Rate limiting
app.use('/api/auth/login', loginLimiter);
app.use('/api', apiLimiter);

// CSRF Protection
app.use(csrfProtection);
app.use(generateCsrfToken);

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api', contentRoutes);

// Tratamento de erros
app.use(errorLogger);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`WebSocket server iniciado`);
}); 