
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllProducts, deleteProduct } from '@/services/productService';
import { ProductDto } from '@/types/product';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

  if (isLoading) return <div className="flex justify-center p-8">Carregando produtos...</div>;
  
  if (error) return <div className="text-red-500 p-4">Erro ao carregar produtos</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lista de Produtos</h1>
        <Link to="/products/new">
          <Button>
            <Plus />
            Novo Produto
          </Button>
        </Link>
      </div>

      {products && products.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Preço de Venda</TableHead>
              <TableHead>Custo Total</TableHead>
              <TableHead>Margem de Lucro</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.nome}</TableCell>
                <TableCell>R$ {product.precoVenda.toFixed(2)}</TableCell>
                <TableCell>R$ {product.custoTotal.toFixed(2)}</TableCell>
                <TableCell>{product.margemDeLucro.toFixed(2)}%</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Nenhum produto encontrado</p>
          <Link to="/products/new" className="mt-4 inline-block">
            <Button>
              <Plus />
              Adicionar primeiro produto
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductList;
