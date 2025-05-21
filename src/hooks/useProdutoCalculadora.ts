
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adicionarIngrediente, calcularPrecoProduto, getProductById } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';
import { ComponenteProdutoDto, AdicionarIngredienteDto } from '@/types/product';
import { AdicionarIngredienteFormValues } from '@/components/produto-calculadora/IngredienteForm';

export const useProdutoCalculadora = () => {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [ingredientes, setIngredientes] = useState<ComponenteProdutoDto[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query for selected product
  const { data: selectedProduct, refetch: refetchProduct } = useQuery({
    queryKey: ['product', selectedProductId],
    queryFn: () => getProductById(selectedProductId!),
    enabled: !!selectedProductId,
  });

  // Update ingredients when product is loaded
  useEffect(() => {
    if (selectedProduct?.componenteProdutoDtoSet) {
      setIngredientes(selectedProduct.componenteProdutoDtoSet);
    } else {
      setIngredientes([]);
    }
  }, [selectedProduct]);

  // Mutation for adding ingredient
  const adicionarIngredienteMutation = useMutation({
    mutationFn: (data: { produtoId: number, ingrediente: AdicionarIngredienteDto }) => {
      return adicionarIngrediente(data.produtoId, data.ingrediente);
    },
    onSuccess: () => {
      toast({
        title: 'Ingrediente adicionado',
        description: 'O ingrediente foi adicionado com sucesso ao produto.',
      });
      refetchProduct();
      queryClient.invalidateQueries({ queryKey: ['product', selectedProductId] });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar o ingrediente ao produto.',
        variant: 'destructive',
      });
    },
  });

  // Mutation for calculating price
  const calcularPrecoMutation = useMutation({
    mutationFn: (produtoId: number) => calcularPrecoProduto(produtoId),
    onSuccess: () => {
      toast({
        title: 'Preço calculado',
        description: 'O preço do produto foi calculado com sucesso.',
      });
      queryClient.invalidateQueries({ queryKey: ['product', selectedProductId] });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível calcular o preço do produto.',
        variant: 'destructive',
      });
    },
  });

  // Handler for selecting product
  const handleSelectProduct = (produtoId: number) => {
    setSelectedProductId(produtoId);
  };

  // Handler for adding ingredient
  const handleAddIngrediente = (values: AdicionarIngredienteFormValues) => {
    if (!selectedProductId) {
      toast({
        title: 'Erro',
        description: 'Selecione um produto primeiro.',
        variant: 'destructive',
      });
      return;
    }

    adicionarIngredienteMutation.mutate({
      produtoId: selectedProductId,
      ingrediente: {
        insumoId: parseInt(values.insumoId),
        quantidade: values.quantidade,
      },
    });
  };

  // Handler for calculating price
  const handleCalcularPreco = () => {
    if (!selectedProductId) {
      toast({
        title: 'Erro',
        description: 'Selecione um produto primeiro.',
        variant: 'destructive',
      });
      return;
    }

    calcularPrecoMutation.mutate(selectedProductId);
  };

  return {
    selectedProductId,
    selectedProduct,
    ingredientes,
    isAddingIngrediente: adicionarIngredienteMutation.isPending,
    isCalculatingPrice: calcularPrecoMutation.isPending,
    handleSelectProduct,
    handleAddIngrediente,
    handleCalcularPreco,
  };
};
