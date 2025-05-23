
import api from './api';
import { AuthorizationDTO, LoginRequestDto, UserRegisterRequestDto } from '@/types/auth';

export const login = async (credentials: LoginRequestDto): Promise<AuthorizationDTO> => {
  try {
    const response = await api.post<AuthorizationDTO>('/auth/login', credentials);
    
    // Verificar se o token foi retornado corretamente
    if (!response.data || !response.data.tokenJwt) {
      throw new Error('Token não recebido do servidor');
    }
    
    return response.data;
  } catch (error) {
    console.error('Erro durante o login:', error);
    throw error;
  }
};

export const register = async (userData: UserRegisterRequestDto): Promise<any> => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// Função para verificar se o token atual é válido
export const checkToken = async (): Promise<boolean> => {
  try {
    // Fazer uma requisição simples que requer autenticação
    await api.get('/auth/check');
    return true;
  } catch (error) {
    return false;
  }
};
