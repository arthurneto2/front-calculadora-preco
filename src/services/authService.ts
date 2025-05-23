
import api from './api';
import { AuthorizationDTO, LoginRequestDto, UserRegisterRequestDto } from '@/types/auth';

export const login = async (credentials: LoginRequestDto): Promise<AuthorizationDTO> => {
  try {
    const response = await api.post<AuthorizationDTO>('/auth/login', credentials);
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

// Função simplificada apenas para verificar se o token existe
export const checkToken = async (): Promise<boolean> => {
  const token = localStorage.getItem('token');
  return !!token;
};
