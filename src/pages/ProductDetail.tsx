
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProductById } from '@/services/productService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Edit } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(Number(id)),
  });

  if (isLoading) return <div className="flex justify-center p-8">Carregando detalhes do produto...</div>;
  
  if (error) return <div className="text-red-500 p-4">Erro ao carregar detalhes do produto</div>;
  
  if (!product) return <div className="text-red-500 p-4">Produto não encontrado</div>;

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Detalhes do Produto</CardTitle>
            <Link to={`/products/edit/${id}`}>
              <Button variant="outline" size="sm">
                <Edit className="mr-2" size={16} />
                Editar
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">ID</h3>
              <p className="mt-1">{product.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Nome</h3>
              <p className="mt-1">{product.nome}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Preço de Venda</h3>
              <p className="mt-1">R$ {product.precoVenda.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Custo Total</h3>
              <p className="mt-1">R$ {product.custoTotal.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Margem de Lucro</h3>
              <p className="mt-1">{product.margemDeLucro.toFixed(2)}%</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Link to="/products">
            <Button variant="outline">
              Voltar para lista
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProductDetail;
