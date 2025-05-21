
import api from './api';
import { ProductDto } from '@/types/product';

// Função para criar um produto
export const createProduct = async (product: ProductDto): Promise<ProductDto> => {
  const response = await api.post<ProductDto>('/product', product);
  return response.data;
};

// Função para listar todos os produtos
export const getAllProducts = async (): Promise<ProductDto[]> => {
  const response = await api.get<ProductDto[]>('/product/listAll');
  return response.data;
};

// Função para buscar um produto por id
export const getProductById = async (id: number): Promise<ProductDto> => {
  const response = await api.get<ProductDto>(`/product/${id}`);
  return response.data;
};

// Função para atualizar um produto
export const updateProduct = async (product: ProductDto): Promise<ProductDto> => {
  const response = await api.put<ProductDto>('/product', product);
  return response.data;
};

// Função para deletar um produto
export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/product/${id}`);
};

export interface ProductCalculationRequest {
  productName: string;
  costPrice: number;
  markup: number;
  taxRate: number;
}

export interface ProductCalculationResponse {
  productName: string;
  costPrice: number;
  markup: number;
  taxAmount: number;
  finalPrice: number;
  profitMargin: number;
}

export const calculateProductPrice = async (data: ProductCalculationRequest): Promise<ProductCalculationResponse> => {
  const response = await api.post<ProductCalculationResponse>('/product/calculate', data);
  return response.data;
};
