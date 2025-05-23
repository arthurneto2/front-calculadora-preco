
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createProduct, getProductById, updateProduct } from '@/services/productService';
import { ProductDto, ProductFormValues } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

// Ajustando o schema para tratar apenas os campos necessários para criação
export const productSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  margemDeLucro: z.coerce.number().min(0, 'Margem de lucro não pode ser negativa').default(0),
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
      margemDeLucro: 0,
    },
  });

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(Number(id)),
    enabled: isEditing,
  });

  // Update form values when product data is loaded
  useEffect(() => {
    if (product) {
      form.reset({
        nome: product.nome,
        margemDeLucro: product.margemDeLucro,
      });
    }
  }, [product, form]);

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      console.log('Produto criado com sucesso:', data);
      toast({
        title: 'Produto criado',
        description: 'O produto foi criado com sucesso.',
      });
      // Fix redirect - use / instead of /products
      navigate('/');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('Erro ao criar produto:', error);
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
      // Fix redirect - use / instead of /products
      navigate('/');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('Erro ao atualizar produto:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o produto.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    console.log('Formulário submetido com dados:', data);
    if (isEditing && product) {
      updateMutation.mutate({
        id: product.id,
        nome: data.nome,
        margemDeLucro: data.margemDeLucro,
      });
    } else {
      // Enviando apenas os campos necessários
      createMutation.mutate({
        nome: data.nome,
        margemDeLucro: data.margemDeLucro,
      });
    }
  };

  const handleCancel = () => {
    navigate('/');
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
