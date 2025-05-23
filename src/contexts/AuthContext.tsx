
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthorizationDTO, LoginRequestDto, UserRegisterRequestDto } from '@/types/auth';
import { login, register } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: AuthorizationDTO | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequestDto) => Promise<void>;
  register: (userData: UserRegisterRequestDto) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthorizationDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Erro ao carregar dados do usuário:', e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    setIsLoading(false);
  }, []);

  const handleLogin = async (credentials: LoginRequestDto) => {
    try {
      setIsLoading(true);
      const data = await login(credentials);
      
      // Garantindo que o token está sendo armazenado corretamente
      if (data && data.tokenJwt) {
        localStorage.setItem('token', data.tokenJwt);
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        
        toast({
          title: 'Login bem-sucedido',
          description: `Bem-vindo, ${data.user.name}!`,
        });
        
        // Redirecionando para a página inicial
        navigate('/');
      } else {
        throw new Error('Token não recebido do servidor');
      }
    } catch (error: any) {
      toast({
        title: 'Erro ao fazer login',
        description: error.response?.data || 'Verifique suas credenciais e tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (userData: UserRegisterRequestDto) => {
    try {
      setIsLoading(true);
      await register(userData);
      
      // Automatically login after successful registration
      await handleLogin({
        email: userData.email,
        password: userData.password,
      });
      
      toast({
        title: 'Registro bem-sucedido',
        description: 'Sua conta foi criada e você foi autenticado automaticamente.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao registrar',
        description: error.response?.data || 'Não foi possível criar sua conta.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
    toast({
      title: 'Logout',
      description: 'Você saiu do sistema.',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
