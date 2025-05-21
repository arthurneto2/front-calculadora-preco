
import { ProductDto } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';

interface ProdutoDetailsProps {
  produto: ProductDto;
  onCalcularPreco: () => void;
  isCalculating: boolean;
}

export const ProdutoDetails = ({ produto, onCalcularPreco, isCalculating }: ProdutoDetailsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhes do Produto</CardTitle>
        <CardDescription>
          Informações do produto selecionado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm font-medium">Nome:</div>
            <div className="text-sm">{produto.nome}</div>
            
            <div className="text-sm font-medium">Custo Total:</div>
            <div className="text-sm">
              R$ {produto.custoTotal !== undefined ? produto.custoTotal.toFixed(2) : 'Não calculado'}
            </div>
            
            <div className="text-sm font-medium">Margem de Lucro:</div>
            <div className="text-sm">{produto.margemDeLucro?.toFixed(2)}%</div>
            
            <div className="text-xl font-bold text-primary mt-4">Preço de Venda:</div>
            <div className="text-xl font-bold text-primary mt-4">
              R$ {produto.precoVenda !== undefined ? produto.precoVenda.toFixed(2) : 'Não calculado'}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onCalcularPreco} 
          disabled={isCalculating} 
          className="w-full"
        >
          <Calculator className="mr-2 h-4 w-4" />
          {isCalculating ? 'Calculando...' : 'Calcular Preço'}
        </Button>
      </CardFooter>
    </Card>
  );
};
