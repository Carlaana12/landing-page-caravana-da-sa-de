const express = require('express');
const router = express.Router();
const { login, verifyToken } = require('../controllers/authController');

router.post('/login', login);
router.get('/verify', verifyToken, (req, res) => {
  res.json({ message: 'Token válido', user: req.user });
});

module.exports = router; 