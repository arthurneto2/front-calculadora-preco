
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.3.12:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor simplificado para incluir o token de autenticação nas requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de resposta muito simplificado apenas para capturar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
