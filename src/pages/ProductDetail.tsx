import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductById, adicionarInsumos, updateQuantComponente, deleteComponente, getProductComponents } from '@/services/productService';
import { getAllInsumos } from '@/services/insumoService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ComponenteProdutoDto, AdicionarIngredienteDto } from '@/types/product';
import { ComponenteCard } from '@/components/product/ComponenteCard';
import { AdicionarComponenteDialog } from '@/components/product/AdicionarComponenteDialog';
import { useAuth } from '@/contexts/AuthContext';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Verificar autenticação apenas uma vez ao carregar
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: 'Não autenticado',
        description: 'Você precisa estar logado para acessar esta página.',
        variant: 'destructive',
      });
      navigate('/login');
    }
  }, [isAuthenticated, navigate, toast]);
  
  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(Number(id)),
  });
  
  const { data: insumos, isLoading: isLoadingInsumos } = useQuery({
    queryKey: ['insumos'],
    queryFn: getAllInsumos,
  });

  // Query principal usando o novo endpoint que retorna dados mais completos
  const { data: componentes, isLoading: isLoadingComponentes } = useQuery({
    queryKey: ['product-components', id],
    queryFn: () => getProductComponents(Number(id)),
    enabled: !!id,
  });

  // Debug para verificar os dados mais completos vindos do novo endpoint
  console.log('=== ProductDetail - Novo Endpoint Debug ===');
  console.log('Product ID:', id);
  console.log('Componentes from new endpoint (dados completos):', componentes);
  console.log('Cada componente tem os dados:', componentes?.map(c => ({
    id: c.id,
    insumoId: c.insumoDto.id,
    insumoNome: c.insumoDto.nome,
    insumoCustoUn: c.insumoDto.custoUn,
    quantidade: c.quantidade,
    insumoAninhado: c.insumoDto
  })));

  const adicionarComponenteMutation = useMutation({
    mutationFn: (data: AdicionarIngredienteDto) => {
      console.log("Enviando para adicionar componente:", data);
      return adicionarInsumos(Number(id), data);
    },
    onSuccess: () => {
      toast({
        title: 'Componente adicionado',
        description: 'O componente foi adicionado com sucesso.',
      });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      queryClient.invalidateQueries({ queryKey: ['product-components', id] });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      console.error("Erro ao adicionar componente:", error);
      
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar o componente. Por favor, verifique se está logado.',
        variant: 'destructive',
      });
      
      // Se for erro de autenticação, redireciona para login
      if (error?.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    },
  });

  const updateComponenteMutation = useMutation({
    mutationFn: (componente: ComponenteProdutoDto) => updateQuantComponente(Number(id), componente),
    onSuccess: () => {
      toast({
        title: 'Componente atualizado',
        description: 'A quantidade foi atualizada com sucesso.',
      });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      queryClient.invalidateQueries({ queryKey: ['product-components', id] });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o componente.',
        variant: 'destructive',
      });
    },
  });

  const deleteComponenteMutation = useMutation({
    mutationFn: (componente: ComponenteProdutoDto) => deleteComponente(Number(id), componente),
    onSuccess: () => {
      toast({
        title: 'Componente removido',
        description: 'O componente foi removido com sucesso.',
      });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      queryClient.invalidateQueries({ queryKey: ['product-components', id] });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o componente.',
        variant: 'destructive',
      });
    },
  });

  const handleUpdateQuantidade = (componente: ComponenteProdutoDto, novaQuantidade: number) => {
    updateComponenteMutation.mutate({ ...componente, quantidade: novaQuantidade });
  };

  const handleDeleteComponente = (componente: ComponenteProdutoDto) => {
    deleteComponenteMutation.mutate(componente);
  };

  const handleAdicionarComponente = (data: AdicionarIngredienteDto) => {
    adicionarComponenteMutation.mutate(data);
  };

  if (isLoadingProduct || isLoadingInsumos || isLoadingComponentes) return <div className="flex justify-center p-8">Carregando detalhes do produto...</div>;
  
  if (!product) return <div className="text-red-500 p-4">Produto não encontrado</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Link to="/">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="mr-2" size={16} />
            Voltar
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Detalhes do Produto: {product.nome}</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Informações Gerais</CardTitle>
            <Link to={`/produto/editar/${id}`}>
              <Button variant="outline" size="sm">
                <Edit className="mr-2" size={16} />
                Editar
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">ID</h3>
              <p className="mt-1">{product.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Nome</h3>
              <p className="mt-1">{product.nome}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Margem de Lucro</h3>
              <p className="mt-1">{product.margemDeLucro?.toFixed(2)}%</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Preço de Venda</h3>
              <p className="mt-1">R$ {product.precoVenda?.toFixed(2) || '0.00'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Custo Total</h3>
              <p className="mt-1">R$ {product.custoTotal?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">Componentes do Produto</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2" size={16} />
          Adicionar Componente
        </Button>
      </div>

      {componentes && componentes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {componentes.map((componente) => {
            console.log('=== Renderizando componente com dados completos ===');
            console.log('Componente:', componente);
            console.log('Dados diretos:', {
              insumoNome: componente.insumoDto.nome,
              insumoCustoUn: componente.insumoDto.custoUn
            });
            console.log('Dados aninhados do insumo:', componente.insumoDto);
            
            return (
              <ComponenteCard 
                key={componente.id || `${componente.insumoDto.id}-${Date.now()}`}
                componente={componente}
                insumos={insumos || []}
                onUpdateQuantidade={handleUpdateQuantidade}
                onDelete={handleDeleteComponente}
                isUpdating={updateComponenteMutation.isPending}
                isDeleting={deleteComponenteMutation.isPending}
              />
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <p className="text-gray-500 mb-4">Nenhum componente adicionado a este produto</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2" size={16} />
              Adicionar Primeiro Componente
            </Button>
          </CardContent>
        </Card>
      )}

      <AdicionarComponenteDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        insumos={insumos || []}
        onSubmit={handleAdicionarComponente}
        isSubmitting={adicionarComponenteMutation.isPending}
      />
    </div>
  );
};

export default ProductDetail;
