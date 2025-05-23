
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getInsumoById } from '@/services/insumoService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Edit } from 'lucide-react';
import Navbar from '@/components/Navbar';

const InsumoDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: insumo, isLoading, error } = useQuery({
    queryKey: ['insumo', id],
    queryFn: () => getInsumoById(Number(id)),
  });

  if (isLoading) return (
    <>
      <Navbar />
      <div className="flex justify-center p-8">Carregando detalhes do insumo...</div>
    </>
  );
  
  if (error) return (
    <>
      <Navbar />
      <div className="text-red-500 p-4">Erro ao carregar detalhes do insumo</div>
    </>
  );
  
  if (!insumo) return (
    <>
      <Navbar />
      <div className="text-red-500 p-4">Insumo não encontrado</div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Detalhes do Insumo</CardTitle>
              <Link to={`/insumo/editar/${id}`}>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2" size={16} />
                  Editar
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">ID</h3>
                <p className="mt-1">{insumo.id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Nome</h3>
                <p className="mt-1">{insumo.nome}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Unidade de Medida</h3>
                <p className="mt-1">{insumo.unMedida}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Custo Unitário</h3>
                <p className="mt-1">R$ {insumo.custoUn.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Link to="/insumo">
              <Button variant="outline">
                Voltar para lista
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default InsumoDetail;
