
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { getAllInsumos } from '@/services/insumoService';
import { InsumoDto } from '@/types/insumo';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

// Schema for adding ingredient
export const adicionarIngredienteSchema = z.object({
  insumoId: z.string().min(1, 'Selecione um insumo'),
  quantidade: z.coerce.number().positive('A quantidade deve ser positiva'),
});

export type AdicionarIngredienteFormValues = z.infer<typeof adicionarIngredienteSchema>;

interface IngredienteFormProps {
  onAddIngrediente: (values: AdicionarIngredienteFormValues) => void;
  isSubmitting: boolean;
}

export const IngredienteForm = ({ onAddIngrediente, isSubmitting }: IngredienteFormProps) => {
  // Form for adding ingredient
  const ingredienteForm = useForm<AdicionarIngredienteFormValues>({
    resolver: zodResolver(adicionarIngredienteSchema),
    defaultValues: {
      insumoId: '',
      quantidade: 0,
    },
  });

  // Query for insumos
  const { data: insumos } = useQuery({
    queryKey: ['insumos'],
    queryFn: getAllInsumos,
  });

  const handleSubmit = (values: AdicionarIngredienteFormValues) => {
    onAddIngrediente(values);
    ingredienteForm.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar Ingrediente</CardTitle>
        <CardDescription>
          Adicione ingredientes ao produto selecionado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...ingredienteForm}>
          <form onSubmit={ingredienteForm.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={ingredienteForm.control}
                name="insumoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insumo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um insumo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {insumos?.map((insumo) => (
                          <SelectItem key={insumo.id} value={String(insumo.id)}>
                            {insumo.nome} - R$ {insumo.custoUn.toFixed(2)}/{insumo.unMedida}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={ingredienteForm.control}
                name="quantidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Adicionando...' : 'Adicionar Ingrediente'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
