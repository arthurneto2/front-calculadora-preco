
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
    if (error.response && error.response.status === 401) {
      // Se receber um 401, significa que o token está inválido ou expirou
      console.log('Token expirado ou inválido. Redirecionando para login...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirecionar para a página de login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
