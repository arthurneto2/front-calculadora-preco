
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllProducts, deleteProduct } from '@/services/productService';
import { ProductDto } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Plus, Layout } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const ProductList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Produto removido',
        description: 'O produto foi removido com sucesso.',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o produto.',
        variant: 'destructive',
      });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      deleteMutation.mutate(id);
    }
  };

  // Helper function to safely format numbers
  const formatCurrency = (value?: number | null) => {
    return value != null ? `R$ ${value.toFixed(2)}` : 'N/A';
  };

  const formatPercentage = (value?: number | null) => {
    return value != null ? `${value.toFixed(2)}%` : 'N/A';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Lista de Produtos</h1>
          <Link to="/products/new">
            <Button>
              <Plus className="mr-2" size={16} />
              Novo Produto
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <h3 className="text-lg font-medium">Erro ao carregar produtos</h3>
          <p>Não foi possível carregar a lista de produtos. Tente novamente mais tarde.</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['products'] })}
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lista de Produtos</h1>
        <Link to="/products/new">
          <Button>
            <Plus className="mr-2" size={16} />
            Novo Produto
          </Button>
        </Link>
      </div>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{product.nome}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Preço de Venda:</span>
                    <span className="font-medium">{formatCurrency(product.precoVenda)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Custo Total:</span>
                    <span className="font-medium">{formatCurrency(product.custoTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Margem de Lucro:</span>
                    <span className="font-medium">{formatPercentage(product.margemDeLucro)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Link to={`/products/${product.id}`}>
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </Link>
                <div className="flex gap-2">
                  <Link to={`/products/edit/${product.id}`}>
                    <Button variant="outline" size="icon">
                      <Edit size={16} />
                    </Button>
                  </Link>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => product.id && handleDelete(product.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <Layout className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Nenhum produto encontrado</h3>
          <p className="mt-1 text-gray-500">
            Você ainda não possui produtos cadastrados. Comece criando seu primeiro produto.
          </p>
          <div className="mt-6">
            <Link to="/products/new">
              <Button>
                <Plus className="mr-2" size={16} />
                Criar meu primeiro produto
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
