import { useState } from 'react';
import { AuthService } from '../services/authService';
import { Loader2 } from 'lucide-react';

export default function CreateAdmin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCreateAdmin = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await AuthService.createAdminUser();
      setSuccess(true);
    } catch (err: any) {
      console.error('Erro ao criar admin:', err);
      setError(err.message || 'Erro ao criar usuário administrador');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-verde-cia to-verde-cia-dark">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-verde-cia p-6 text-center">
            <h2 className="text-2xl font-bold text-white">Criar Usuário Admin</h2>
            <p className="text-white/80 mt-2">
              Este processo criará o usuário administrador inicial
            </p>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <p className="text-gray-600">
                Email: carla.accp64@gmail.com<br />
                Senha: Ciacomunica@12
              </p>

              {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-lg">
                  Usuário administrador criado com sucesso! Você já pode fazer login.
                </div>
              )}

              <button
                onClick={handleCreateAdmin}
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-verde-cia hover:bg-verde-cia-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde-cia disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Criando usuário...
                  </>
                ) : (
                  'Criar Usuário Admin'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 