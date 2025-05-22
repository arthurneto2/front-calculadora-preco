
import { ProductFormValues } from '@/types/product';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';

interface ProductFormFieldsProps {
  form: UseFormReturn<ProductFormValues>;
}

export const ProductFormFields = ({ form }: ProductFormFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="nome"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormControl>
              <Input placeholder="Nome do produto" {...field} />
            </FormControl>
            <FormDescription>
              Digite o nome do seu produto.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="margemDeLucro"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Margem de Lucro (%)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01" 
                placeholder="0.00" 
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
            </FormControl>
            <FormDescription>
              Defina a margem de lucro desejada para este produto.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
