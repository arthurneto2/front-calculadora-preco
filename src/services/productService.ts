import api from './api';
import { ProductDto, AdicionarIngredienteDto } from '@/types/product';

// Função para criar um produto
export const createProduct = async (product: ProductDto): Promise<ProductDto> => {
  // Verificando os dados enviados ao backend
  console.log('Dados enviados para criação:', product);
  
  const response = await api.post<ProductDto>('/product', product);
  console.log('Resposta do servidor:', response.data);
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

// Função para adicionar ingrediente ao produto
export const adicionarIngrediente = async (idProduto: number, ingrediente: AdicionarIngredienteDto): Promise<void> => {
  await api.post(`/product/${idProduto}/ingredientes`, ingrediente);
};

// Função para calcular o preço do produto
export const calcularPrecoProduto = async (idProduto: number): Promise<ProductDto> => {
  const response = await api.get<ProductDto>(`/product/${idProduto}/calcular-preco`);
  return response.data;
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
