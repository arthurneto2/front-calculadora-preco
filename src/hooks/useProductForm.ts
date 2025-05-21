
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createProduct, getProductById, updateProduct } from '@/services/productService';
import { ProductDto, ProductFormValues } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

export const productSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  precoVenda: z.coerce.number().positive('Preço de venda deve ser maior que zero'),
  custoTotal: z.coerce.number().positive('Custo total deve ser maior que zero'),
  margemDeLucro: z.coerce.number().positive('Margem de lucro deve ser maior que zero'),
});

export const useProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nome: '',
      precoVenda: 0,
      custoTotal: 0,
      margemDeLucro: 0,
    },
  });

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(Number(id)),
    enabled: isEditing,
  });

  // Update form values when product data is loaded
  useState(() => {
    if (product) {
      form.reset({
        nome: product.nome,
        precoVenda: product.precoVenda,
        custoTotal: product.custoTotal,
        margemDeLucro: product.margemDeLucro,
      });
    }
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast({
        title: 'Produto criado',
        description: 'O produto foi criado com sucesso.',
      });
      navigate('/products');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o produto.',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      toast({
        title: 'Produto atualizado',
        description: 'O produto foi atualizado com sucesso.',
      });
      navigate('/products');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o produto.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    if (isEditing && product) {
      updateMutation.mutate({
        id: product.id,
        nome: data.nome,
        precoVenda: data.precoVenda,
        custoTotal: data.custoTotal,
        margemDeLucro: data.margemDeLucro,
      });
    } else {
      createMutation.mutate({
        nome: data.nome,
        precoVenda: data.precoVenda,
        custoTotal: data.custoTotal,
        margemDeLucro: data.margemDeLucro,
      });
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return {
    form,
    isEditing,
    product,
    isLoadingProduct,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
    handleCancel,
  };
};
