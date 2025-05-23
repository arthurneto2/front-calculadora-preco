
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include auth token in requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Verificar se é um erro de token expirado
    if (error.response && error.response.status === 401) {
      console.log('Token expirado ou inválido. Redirecionando para login...');
      
      // Limpar token e dados do usuário
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Para evitar loops de redirecionamento, verificamos se já estamos na página de login
      if (!window.location.pathname.includes('/login')) {
        // Usar setTimeout para dar tempo de finalizar a requisição atual
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
