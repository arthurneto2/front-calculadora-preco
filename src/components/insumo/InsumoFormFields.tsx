
import { InsumoFormValues } from '@/types/insumo';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';

interface InsumoFormFieldsProps {
  form: UseFormReturn<InsumoFormValues>;
}

export const InsumoFormFields = ({ form }: InsumoFormFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="nome"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormControl>
              <Input placeholder="Nome do insumo" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="unMedida"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Unidade de Medida</FormLabel>
            <FormControl>
              <Input placeholder="Ex: kg, g, l, ml, unidade" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="custoUn"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Custo Unitário</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01" 
                placeholder="0.00" 
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
