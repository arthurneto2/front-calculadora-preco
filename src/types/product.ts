
export interface ComponenteProdutoDto {
  id?: number;
  insumoId: number;
  quantidade: number;
  insumoNome?: string;
  insumoCustoUn?: number;
}

export interface ProductDto {
  id?: number;
  nome: string;
  precoVenda?: number;
  custoTotal?: number;
  margemDeLucro: number;
  componenteProdutoDtoSet?: ComponenteProdutoDto[];
}

// Atualizando para incluir apenas os campos que são realmente usados no formulário
export type ProductFormValues = {
  nome: string;
  margemDeLucro: number;
};

export interface AdicionarIngredienteDto {
  insumoId: number;
  quantidade: number;
}
