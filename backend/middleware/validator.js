const { body, validationResult } = require('express-validator');
const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const purify = DOMPurify(window);

// Validação para login
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('A senha deve ter no mínimo 8 caracteres')
];

// Validação para notícias
const newsValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('O título deve ter entre 3 e 100 caracteres')
    .customSanitizer(value => purify.sanitize(value)),
  body('content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('O conteúdo deve ter no mínimo 10 caracteres')
    .customSanitizer(value => purify.sanitize(value)),
  body('summary')
    .trim()
    .isLength({ max: 200 })
    .withMessage('O resumo deve ter no máximo 200 caracteres')
    .customSanitizer(value => purify.sanitize(value)),
  body('category')
    .isIn(['noticia', 'evento', 'utilidade'])
    .withMessage('Categoria inválida'),
  body('tags')
    .isArray()
    .withMessage('Tags devem ser um array')
    .customSanitizer(value => value.map(tag => purify.sanitize(tag))),
  body('status')
    .isIn(['draft', 'published', 'scheduled'])
    .withMessage('Status inválido')
];

// Middleware para validar resultados
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  loginValidation,
  newsValidation,
  validate
}; 