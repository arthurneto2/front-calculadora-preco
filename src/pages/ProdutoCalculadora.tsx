
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllProducts, getProductById, adicionarIngrediente, calcularPrecoProduto } from '@/services/productService';
import { getAllInsumos } from '@/services/insumoService';
import { ProductDto, AdicionarIngredienteDto } from '@/types/product';
import { InsumoDto } from '@/types/insumo';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calculator, Plus, Trash } from 'lucide-react';

// Schema para adicionar ingrediente
const adicionarIngredienteSchema = z.object({
  insumoId: z.string().min(1, 'Selecione um insumo'),
  quantidade: z.coerce.number().positive('A quantidade deve ser positiva'),
});

// Schema para selecionar produto
const selecionarProdutoSchema = z.object({
  produtoId: z.string().min(1, 'Selecione um produto'),
});

type AdicionarIngredienteFormValues = z.infer<typeof adicionarIngredienteSchema>;
type SelecionarProdutoFormValues = z.infer<typeof selecionarProdutoSchema>;

const ProdutoCalculadora = () => {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [ingredientes, setIngredientes] = useState<ComponenteProdutoDto[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form para selecionar produto
  const produtoForm = useForm<SelecionarProdutoFormValues>({
    resolver: zodResolver(selecionarProdutoSchema),
    defaultValues: {
      produtoId: '',
    },
  });

  // Form para adicionar ingrediente
  const ingredienteForm = useForm<AdicionarIngredienteFormValues>({
    resolver: zodResolver(adicionarIngredienteSchema),
    defaultValues: {
      insumoId: '',
      quantidade: 0,
    },
  });

  // Consulta de produtos
  const { data: produtos } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts,
  });

  // Consulta de insumos
  const { data: insumos } = useQuery({
    queryKey: ['insumos'],
    queryFn: getAllInsumos,
  });

  // Consulta do produto selecionado
  const { data: selectedProduct, refetch: refetchProduct } = useQuery({
    queryKey: ['product', selectedProductId],
    queryFn: () => getProductById(selectedProductId!),
    enabled: !!selectedProductId,
  });

  // Atualiza ingredientes quando o produto é carregado
  useEffect(() => {
    if (selectedProduct?.componenteProdutoDtoSet) {
      setIngredientes(selectedProduct.componenteProdutoDtoSet);
    } else {
      setIngredientes([]);
    }
  }, [selectedProduct]);

  // Mutation para adicionar ingrediente
  const adicionarIngredienteMutation = useMutation({
    mutationFn: (data: { produtoId: number, ingrediente: AdicionarIngredienteDto }) => {
      return adicionarIngrediente(data.produtoId, data.ingrediente);
    },
    onSuccess: () => {
      toast({
        title: 'Ingrediente adicionado',
        description: 'O ingrediente foi adicionado com sucesso ao produto.',
      });
      ingredienteForm.reset();
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

  // Mutation para calcular preço
  const calcularPrecoMutation = useMutation({
    mutationFn: (produtoId: number) => calcularPrecoProduto(produtoId),
    onSuccess: (data) => {
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

  // Handler para selecionar produto
  const handleProdutoSubmit = (values: SelecionarProdutoFormValues) => {
    const produtoId = parseInt(values.produtoId);
    setSelectedProductId(produtoId);
  };

  // Handler para adicionar ingrediente
  const handleIngredienteSubmit = (values: AdicionarIngredienteFormValues) => {
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

  // Handler para calcular preço
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

  // Função para encontrar nome do insumo
  const getInsumoNome = (insumoId: number) => {
    const insumo = insumos?.find(i => i.id === insumoId);
    return insumo?.nome || 'Insumo não encontrado';
  };

  // Função para encontrar custo unitário do insumo
  const getInsumoCustoUn = (insumoId: number) => {
    const insumo = insumos?.find(i => i.id === insumoId);
    return insumo?.custoUn || 0;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Calculadora de Produtos</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
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

        {selectedProduct && (
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Produto</CardTitle>
              <CardDescription>
                Informações do produto selecionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium">Nome:</div>
                  <div className="text-sm">{selectedProduct.nome}</div>
                  
                  <div className="text-sm font-medium">Custo Total:</div>
                  <div className="text-sm">
                    R$ {selectedProduct.custoTotal !== undefined ? selectedProduct.custoTotal.toFixed(2) : 'Não calculado'}
                  </div>
                  
                  <div className="text-sm font-medium">Margem de Lucro:</div>
                  <div className="text-sm">{selectedProduct.margemDeLucro?.toFixed(2)}%</div>
                  
                  <div className="text-xl font-bold text-primary mt-4">Preço de Venda:</div>
                  <div className="text-xl font-bold text-primary mt-4">
                    R$ {selectedProduct.precoVenda !== undefined ? selectedProduct.precoVenda.toFixed(2) : 'Não calculado'}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleCalcularPreco} 
                disabled={calcularPrecoMutation.isPending} 
                className="w-full"
              >
                <Calculator className="mr-2 h-4 w-4" />
                {calcularPrecoMutation.isPending ? 'Calculando...' : 'Calcular Preço'}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>

      {selectedProductId && (
        <div className="mt-6 grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Ingrediente</CardTitle>
              <CardDescription>
                Adicione ingredientes ao produto selecionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...ingredienteForm}>
                <form onSubmit={ingredienteForm.handleSubmit(handleIngredienteSubmit)} className="space-y-4">
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
                    disabled={adicionarIngredienteMutation.isPending}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {adicionarIngredienteMutation.isPending ? 'Adicionando...' : 'Adicionar Ingrediente'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Ingredientes</CardTitle>
              <CardDescription>
                Ingredientes adicionados ao produto
              </CardDescription>
            </CardHeader>
            <CardContent>
              {ingredientes.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ingrediente</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Custo Unitário</TableHead>
                      <TableHead>Custo Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ingredientes.map((ingrediente) => {
                      const insumoNome = ingrediente.insumoNome || getInsumoNome(ingrediente.insumoId);
                      const custoUn = ingrediente.insumoCustoUn || getInsumoCustoUn(ingrediente.insumoId);
                      const custoTotal = custoUn * ingrediente.quantidade;
                      
                      return (
                        <TableRow key={ingrediente.id || `${ingrediente.insumoId}-${ingrediente.quantidade}`}>
                          <TableCell>{insumoNome}</TableCell>
                          <TableCell>{ingrediente.quantidade}</TableCell>
                          <TableCell>R$ {custoUn.toFixed(2)}</TableCell>
                          <TableCell>R$ {custoTotal.toFixed(2)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Nenhum ingrediente adicionado
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProdutoCalculadora;
