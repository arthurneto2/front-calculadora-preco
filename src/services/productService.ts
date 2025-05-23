
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
  const response = await api.get<ProductDto[]>('/produto');
  return response.data;
};

// Função para buscar um produto por id
export const getProductById = async (id: number): Promise<ProductDto> => {
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
  // Endpoint correto: DELETE /produto?id={id} (corresponde ao @DeleteMapping com @RequestParam)
  await api.delete(`/produto?id=${id}`);
};

// Função para adicionar ingrediente ao produto
export const adicionarIngrediente = async (idProduto: number, ingrediente: AdicionarIngredienteDto): Promise<void> => {
  // Este endpoint não está definido no controlador fornecido
  // Mantendo como está, assumindo que existe outro controlador/endpoint
  await api.post(`/produto/${idProduto}/ingredientes`, ingrediente);
};

// Função para calcular o preço do produto
export const calcularPrecoProduto = async (idProduto: number): Promise<ProductDto> => {
  // Este endpoint não está definido no controlador fornecido
  // Mantendo como está, assumindo que existe outro controlador/endpoint
  const response = await api.get<ProductDto>(`/produto/${idProduto}/calcular-preco`);
  return response.data;
};

// Função para adicionar insumos ao produto - CORRIGIDO
export const adicionarInsumos = async (idProduto: number, adicionarInsumoDto: AdicionarIngredienteDto): Promise<void> => {
  // Endpoint corrigido: POST /produto/{id} (corresponde ao @PostMapping("/{id}") no controlador)
  await api.post(`/produto/${idProduto}`, adicionarInsumoDto);
};

// Função para atualizar quantidade de um componente - CORRIGIDO
export const updateQuantComponente = async (idProduto: number, componente: ComponenteProdutoDto): Promise<void> => {
  // Endpoint corrigido: PUT /produto/{id} (corresponde ao @PutMapping("/{id}") no controlador)
  await api.put(`/produto/${idProduto}`, componente);
};

// Função para deletar um componente - CORRIGIDO
export const deleteComponente = async (idProduto: number, componente: ComponenteProdutoDto): Promise<void> => {
  // Endpoint corrigido: DELETE /produto/{id} com corpo da requisição
  // (corresponde ao @DeleteMapping("/{id}") com @PathVariable e @RequestBody no controlador)
  await api.delete(`/produto/${idProduto}`, { data: componente });
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
  // Este endpoint não está definido no controlador fornecido
  // Mantendo como está, assumindo que existe outro controlador/endpoint
  const response = await api.post<ProductCalculationResponse>('/produto/calculate', data);
  return response.data;
};
