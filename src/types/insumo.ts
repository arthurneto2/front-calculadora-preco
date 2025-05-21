
export interface InsumoDto {
  id?: number;
  nome: string;
  unMedida: string;
  custoUn: number;
}

export type InsumoFormValues = {
  nome: string;
  unMedida: string;
  custoUn: number;
};
