const rateLimit = require('express-rate-limit');
const Redis = require('ioredis');
const redis = new Redis();

// Limite de tentativas de login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas
  message: 'Muitas tentativas de login. Tente novamente mais tarde.',
  handler: async (req, res) => {
    const ip = req.ip;
    const key = `login_attempts:${ip}`;
    
    // Incrementar contador no Redis
    await redis.incr(key);
    await redis.expire(key, 15 * 60); // Expira em 15 minutos
    
    res.status(429).json({
      message: 'Muitas tentativas de login. Tente novamente mais tarde.',
      retryAfter: 15 * 60
    });
  }
});

// Limite geral para outras rotas
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requisições
  message: 'Muitas requisições. Tente novamente mais tarde.'
});

module.exports = {
  loginLimiter,
  apiLimiter
}; 