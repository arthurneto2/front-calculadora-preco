
import { Control } from 'react-hook-form';
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProductFormValues } from '@/types/product';

interface ProductFormFieldsProps {
  form: {
    control: Control<ProductFormValues>;
  };
}

export const ProductFormFields = ({ form }: ProductFormFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="nome"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Produto</FormLabel>
            <FormControl>
              <Input placeholder="Digite o nome do produto" {...field} />
            </FormControl>
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
                placeholder="Ex: 30" 
                {...field} 
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
