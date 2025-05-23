
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

// Interceptor para tratar respostas e erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se o erro for 401 (Não autorizado) e não estivermos na página de login
    if (error.response && error.response.status === 401) {
      console.log('Token expirado ou inválido:', error);
      
      // Não redirecionar se já estivermos tentando fazer login
      if (!window.location.pathname.includes('/login')) {
        console.log('Redirecionando para login...');
        
        // Damos tempo para finalizar qualquer requisição atual antes de redirecionar
        setTimeout(() => {
          // Limpar dados de autenticação
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Redirecionar para login
          window.location.href = '/login';
        }, 100);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
