import api from './api';
import { ProductDto, AdicionarIngredienteDto, ComponenteProdutoDto } from '@/types/product';

// Função para criar um produto
export const createProduct = async (product: ProductDto): Promise<ProductDto> => {
  try {
    const response = await api.post<ProductDto>('/produto', product);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    throw error;
  }
};

// Função para listar todos os produtos
export const getAllProducts = async (): Promise<ProductDto[]> => {
  const response = await api.get<ProductDto[]>('/produto/list-all');
  return response.data;
};

// Função para buscar um produto por id
export const getProductById = async (id: number): Promise<ProductDto> => {
  const response = await api.get<ProductDto>(`/produto/${id}`);
  return response.data;
};

// Função para atualizar um produto
export const updateProduct = async (product: ProductDto): Promise<ProductDto> => {
  const response = await api.put<ProductDto>('/produto/update-produto', product);
  return response.data;
};

// Função para deletar um produto
export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/produto/${id}`);
};

// Função para adicionar ingrediente ao produto
export const adicionarIngrediente = async (idProduto: number, ingrediente: AdicionarIngredienteDto): Promise<void> => {
  await api.post(`/produto/${idProduto}/ingredientes`, ingrediente);
};

// Função para calcular o preço do produto
export const calcularPrecoProduto = async (idProduto: number): Promise<ProductDto> => {
  const response = await api.get<ProductDto>(`/produto/${idProduto}/calcular-preco`);
  return response.data;
};

// Função para adicionar insumos ao produto
export const adicionarInsumos = async (idProduto: number, adicionarInsumoDto: AdicionarIngredienteDto): Promise<void> => {
  await api.post(`/produto/${idProduto}/componente`, adicionarInsumoDto);
};

// Função para atualizar quantidade de um componente
export const updateQuantComponente = async (idProduto: number, componente: ComponenteProdutoDto): Promise<void> => {
  await api.put(`/produto/${idProduto}/update-componente`, componente);
};

// Função para deletar um componente
export const deleteComponente = async (idProduto: number, componente: ComponenteProdutoDto): Promise<void> => {
  await api.delete(`/produto/${idProduto}/componente`, { data: componente });
};

// Nova função para listar componentes do produto
export const getProductComponents = async (idProduto: number): Promise<ComponenteProdutoDto[]> => {
  const response = await api.get<ComponenteProdutoDto[]>(`/produto/${idProduto}/list-all/componente`);
  console.log("AQUI CARAI", response.data)
  return response.data;
};

// Interfaces e função para cálculo de preço
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
  const response = await api.post<ProductCalculationResponse>('/produto/calculate', data);
  return response.data;
};
