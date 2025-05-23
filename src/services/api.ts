
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para incluir o token de autenticação nas requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Simplificando o interceptor de resposta para apenas rejeitar os erros sem redirecionamento automático
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Apenas loga o erro e o rejeita
    if (error.response && error.response.status === 401) {
      console.log('Token expirado ou inválido:', error);
      // Não redirecionamos mais automaticamente
    }
    
    return Promise.reject(error);
  }
);

export default api;
