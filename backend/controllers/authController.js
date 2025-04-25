const supabase = require('../supabaseClient');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// Função para login
module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Autenticação de usuário no Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gerar um JWT
    const token = jwt.sign({ user_id: data.user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: data.user });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao tentar fazer login', error: err.message });
  }
};

// Função para verificar token
module.exports.verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido' });
  }
}; 