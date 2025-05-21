
export interface ProductDto {
  id?: number;
  nome: string;
  precoVenda?: number;
  custoTotal?: number;
  margemDeLucro: number;
}

export type ProductFormValues = {
  nome: string;
  precoVenda?: number;
  custoTotal?: number;
  margemDeLucro: number;
};
