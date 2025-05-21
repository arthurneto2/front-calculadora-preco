
import api from './api';
import { AuthorizationDTO, LoginRequestDto, UserRegisterRequestDto } from '@/types/auth';

export const login = async (credentials: LoginRequestDto): Promise<AuthorizationDTO> => {
  const response = await api.post<AuthorizationDTO>('/login', credentials);
  return response.data;
};

export const register = async (userData: UserRegisterRequestDto): Promise<any> => {
  const response = await api.post('/register', userData);
  return response.data;
};
