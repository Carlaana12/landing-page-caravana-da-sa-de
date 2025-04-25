import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/authService';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        console.log('AuthGuard: Resultado de getCurrentUser:', user);
        if (user) {
          setIsAuthenticated(true);
        } else {
          console.log('AuthGuard: Usuário não encontrado, redirecionando para login...');
          navigate('/admin/login', { replace: true });
        }
      } catch (error) {
        console.error('AuthGuard: Erro ao verificar autenticação:', error);
        navigate('/admin/login', { replace: true });
      } finally {
        console.log('AuthGuard: Finalizando verificação, setIsLoading(false)');
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  console.log(`AuthGuard: Estado atual - isLoading: ${isLoading}, isAuthenticated: ${isAuthenticated}`);

  if (isLoading) {
    console.log('AuthGuard: Renderizando Loader...');
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 text-verde-cia animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('AuthGuard: Não autenticado após carregamento, renderizando null (ou redirecionando)...');
    return null;
  }

  console.log('--- AuthGuard: Autenticado e carregado. Renderizando conteúdo protegido (children) ---');
  return <>{children}</>;
}
