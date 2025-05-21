
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { calculateProductPrice, ProductCalculationResponse } from '@/services/productService';
import { Calculator as CalculatorIcon, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const calculatorSchema = z.object({
  productName: z.string().min(1, 'Nome do produto é obrigatório'),
  costPrice: z.coerce.number().positive('O preço de custo deve ser positivo'),
  markup: z.coerce.number().positive('A margem deve ser positiva'),
  taxRate: z.coerce.number().min(0, 'A taxa não pode ser negativa').max(100, 'A taxa não pode ser maior que 100%'),
});

type CalculatorFormValues = z.infer<typeof calculatorSchema>;

const Calculator = () => {
  const [result, setResult] = useState<ProductCalculationResponse | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();
  const { user, logout } = useAuth();
  
  const form = useForm<CalculatorFormValues>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      productName: '',
      costPrice: 0,
      markup: 30,
      taxRate: 0,
    },
  });

  const onSubmit = async (data: CalculatorFormValues) => {
    try {
      setIsCalculating(true);
      const calculationResult = await calculateProductPrice({
        productName: data.productName,
        costPrice: data.costPrice,
        markup: data.markup,
        taxRate: data.taxRate,
      });
      
      setResult(calculationResult);
      toast({
        title: 'Cálculo realizado',
        description: 'O preço do produto foi calculado com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao calcular',
        description: error.response?.data || 'Não foi possível calcular o preço do produto.',
        variant: 'destructive',
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">Calculadora de Preços</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">Olá, {user?.user.name}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut size={16} className="mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto flex-1 p-4">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Calcular preço do produto</CardTitle>
              <CardDescription>
                Preencha os dados para calcular o preço final do produto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="productName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do produto</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Camiseta" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="costPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço de custo (R$)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="markup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Margem (% sobre o custo)</FormLabel>
                        <FormControl>
                          <Input type="number" step="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="taxRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Taxa de imposto (%)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isCalculating}>
                    <CalculatorIcon className="mr-2" size={18} />
                    {isCalculating ? 'Calculando...' : 'Calcular preço'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Resultado</CardTitle>
                <CardDescription>
                  Detalhes do cálculo para {result.productName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Preço de custo:</div>
                    <div className="text-sm">R$ {result.costPrice.toFixed(2)}</div>
                    
                    <div className="text-sm font-medium">Margem:</div>
                    <div className="text-sm">{result.markup}%</div>
                    
                    <div className="text-sm font-medium">Valor do imposto:</div>
                    <div className="text-sm">R$ {result.taxAmount.toFixed(2)}</div>
                    
                    <div className="text-sm font-medium">Margem de lucro:</div>
                    <div className="text-sm">{result.profitMargin.toFixed(2)}%</div>
                    
                    <div className="text-xl font-bold text-primary mt-4">Preço final:</div>
                    <div className="text-xl font-bold text-primary mt-4">
                      R$ {result.finalPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Calculator;
