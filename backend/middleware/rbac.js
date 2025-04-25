const supabase = require('../supabaseClient');

// Definição dos papéis e suas permissões
const roles = {
  admin: {
    permissions: ['read', 'write', 'delete', 'manage_users']
  },
  editor: {
    permissions: ['read', 'write']
  },
  viewer: {
    permissions: ['read']
  }
};

// Middleware para verificar permissões
const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const { user } = req;

      // Obter o papel do usuário do Supabase
      const { data: userRole, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', user.user_id)
        .single();

      if (error || !userRole) {
        return res.status(403).json({ message: 'Acesso negado' });
      }

      // Verificar se o papel tem a permissão necessária
      if (!roles[userRole.role]?.permissions.includes(requiredPermission)) {
        return res.status(403).json({ message: 'Permissão negada' });
      }

      next();
    } catch (err) {
      res.status(500).json({ message: 'Erro ao verificar permissões', error: err.message });
    }
  };
};

module.exports = {
  checkPermission,
  roles
}; 