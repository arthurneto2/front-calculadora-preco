import api from './api';
import { InsumoDto } from '@/types/insumo';

// Função para criar um insumo
export const createInsumo = async (insumo: InsumoDto): Promise<InsumoDto> => {
  const response = await api.post<InsumoDto>('/insumo', insumo);
  return response.data;
};

// Função para listar todos os insumos
export const getAllInsumos = async (): Promise<InsumoDto[]> => {
  const response = await api.get<InsumoDto[]>('/insumo/listAll');
  return response.data;
};

// Função para buscar um insumo por id
export const getInsumoById = async (id: number): Promise<InsumoDto> => {
  const response = await api.get<InsumoDto>(`/insumo/${id}`);
  return response.data;
};

// Função para atualizar um insumo
export const updateInsumo = async (insumo: InsumoDto): Promise<InsumoDto> => {
  const response = await api.put<InsumoDto>('/insumo', insumo);
  return response.data;
};

// Função para deletar um insumo
export const deleteInsumo = async (id: number): Promise<void> => {
  await api.delete(`/insumo/${id}`);
};
