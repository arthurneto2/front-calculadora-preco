
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { getAllProducts } from '@/services/productService';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Schema for selecting product
export const selecionarProdutoSchema = z.object({
  produtoId: z.string().min(1, 'Selecione um produto'),
});

export type SelecionarProdutoFormValues = z.infer<typeof selecionarProdutoSchema>;

interface ProdutoSelectorProps {
  onSelectProduto: (produtoId: number) => void;
}

export const ProdutoSelector = ({ onSelectProduto }: ProdutoSelectorProps) => {
  // Form for selecting product
  const produtoForm = useForm<SelecionarProdutoFormValues>({
    resolver: zodResolver(selecionarProdutoSchema),
    defaultValues: {
      produtoId: '',
    },
  });

  // Query for products
  const { data: produtos } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts,
  });

  // Handler for selecting product
  const handleProdutoSubmit = (values: SelecionarProdutoFormValues) => {
    const produtoId = parseInt(values.produtoId);
    onSelectProduto(produtoId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selecionar Produto</CardTitle>
        <CardDescription>
          Escolha um produto para adicionar ingredientes e calcular o preço
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...produtoForm}>
          <form onSubmit={produtoForm.handleSubmit(handleProdutoSubmit)} className="space-y-4">
            <FormField
              control={produtoForm.control}
              name="produtoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produto</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {produtos?.map((produto) => (
                        <SelectItem key={produto.id} value={String(produto.id)}>
                          {produto.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Selecionar Produto</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
