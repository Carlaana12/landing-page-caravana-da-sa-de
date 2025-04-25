const express = require('express');
const router = express.Router();
const { verifyToken } = require('../controllers/authController');
const { createOrUpdateNews, getAllNews, getNewsById, deleteNews, uploadMedia } = require('../controllers/contentController');

// Rotas protegidas por autenticação
router.use(verifyToken);

// Rotas de notícias
router.post('/news', uploadMedia, createOrUpdateNews);
router.put('/news/:id', uploadMedia, createOrUpdateNews);
router.get('/news', getAllNews);
router.get('/news/:id', getNewsById);
router.delete('/news/:id', deleteNews);

module.exports = router; 