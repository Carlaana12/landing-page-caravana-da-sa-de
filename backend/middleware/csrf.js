const csrf = require('csurf');
const cookieParser = require('cookie-parser');

// Configuração do CSRF
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
});

// Middleware para gerar token CSRF
const generateCsrfToken = (req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken(), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  next();
};

module.exports = {
  csrfProtection,
  generateCsrfToken,
  cookieParser
}; 