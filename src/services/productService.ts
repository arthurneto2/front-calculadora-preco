
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
  // Corrigindo o endpoint para /produto conforme o controlador
  const response = await api.get<ProductDto[]>('/produto');
  return response.data;
};

// Função para buscar um produto por id
export const getProductById = async (id: number): Promise<ProductDto> => {
  // O método findById no controlador está com problema (duplicado com o findAll)
  // Vamos manter a convenção RESTful de GET /recurso/:id
  const response = await api.get<ProductDto>(`/produto/${id}`);
  return response.data;
};

// Função para atualizar um produto
export const updateProduct = async (product: ProductDto): Promise<ProductDto> => {
  const response = await api.put<ProductDto>('/produto', product);
  return response.data;
};

// Função para deletar um produto
export const deleteProduct = async (id: number): Promise<void> => {
  // Corrigindo o endpoint para incluir o parâmetro id conforme padrões REST
  // O controlador atual não especifica onde está o id (path param ou query param)
  await api.delete(`/produto/${id}`);
};

// Função para adicionar ingrediente ao produto
export const adicionarIngrediente = async (idProduto: number, ingrediente: AdicionarIngredienteDto): Promise<void> => {
  // Este endpoint não está definido no controlador, então vamos manter como está
  // assumindo que existe outro controlador ou método que o implementa
  await api.post(`/produto/${idProduto}/ingredientes`, ingrediente);
};

// Função para calcular o preço do produto
export const calcularPrecoProduto = async (idProduto: number): Promise<ProductDto> => {
  // Este endpoint não está definido no controlador, mantendo como está
  const response = await api.get<ProductDto>(`/produto/${idProduto}/calcular-preco`);
  return response.data;
};

// Função para adicionar insumos ao produto
export const adicionarInsumos = async (idProduto: number, adicionarInsumoDto: AdicionarIngredienteDto): Promise<void> => {
  // Não há um endpoint específico para isso no controlador fornecido
  // Assumindo que deve usar o método POST /produto/:id para adicionar insumos
  await api.post(`/produto/${idProduto}`, adicionarInsumoDto);
};

// Função para atualizar quantidade de um componente
export const updateQuantComponente = async (idProduto: number, componente: ComponenteProdutoDto): Promise<void> => {
  // Este endpoint não está definido no controlador, mantendo como está
  await api.put(`/produto/${idProduto}/componente`, componente);
};

// Função para deletar um componente
export const deleteComponente = async (idProduto: number, componente: ComponenteProdutoDto): Promise<void> => {
  // Este endpoint não está definido no controlador, mantendo como está
  await api.delete(`/produto/${idProduto}/componente`, { data: componente });
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
  // Este endpoint não está definido no controlador, mantendo como está
  const response = await api.post<ProductCalculationResponse>('/produto/calculate', data);
  return response.data;
};
