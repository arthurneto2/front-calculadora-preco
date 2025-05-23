
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createInsumo, getInsumoById, updateInsumo } from '@/services/insumoService';
import { InsumoDto, InsumoFormValues } from '@/types/insumo';
import { useToast } from '@/hooks/use-toast';

export const insumoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  unMedida: z.string().min(1, 'Unidade de medida é obrigatória'),
  custoUn: z.coerce.number().positive('Custo unitário deve ser maior que zero'),
});

export const useInsumoForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const form = useForm<InsumoFormValues>({
    resolver: zodResolver(insumoSchema),
    defaultValues: {
      nome: '',
      unMedida: '',
      custoUn: 0,
    },
  });

  const { data: insumo, isLoading: isLoadingInsumo } = useQuery({
    queryKey: ['insumo', id],
    queryFn: () => getInsumoById(Number(id)),
    enabled: isEditing,
  });

  // Use useState to handle form value updates when insumo data is loaded
  useState(() => {
    if (insumo) {
      form.reset({
        nome: insumo.nome,
        unMedida: insumo.unMedida,
        custoUn: insumo.custoUn,
      });
    }
  });

  const createMutation = useMutation({
    mutationFn: createInsumo,
    onSuccess: () => {
      toast({
        title: 'Insumo criado',
        description: 'O insumo foi criado com sucesso.',
      });
      navigate('/insumo');
      queryClient.invalidateQueries({ queryKey: ['insumos'] });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o insumo.',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateInsumo,
    onSuccess: () => {
      toast({
        title: 'Insumo atualizado',
        description: 'O insumo foi atualizado com sucesso.',
      });
      navigate('/insumo');
      queryClient.invalidateQueries({ queryKey: ['insumos'] });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o insumo.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: InsumoFormValues) => {
    if (isEditing && insumo) {
      updateMutation.mutate({
        id: insumo.id,
        nome: data.nome,
        unMedida: data.unMedida,
        custoUn: data.custoUn,
      });
    } else {
      createMutation.mutate({
        nome: data.nome,
        unMedida: data.unMedida,
        custoUn: data.custoUn,
      });
    }
  };

  const handleCancel = () => {
    navigate('/insumo');
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return {
    form,
    isEditing,
    insumo,
    isLoadingInsumo,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
    handleCancel,
  };
};
