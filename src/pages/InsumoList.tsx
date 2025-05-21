
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllInsumos, deleteInsumo } from '@/services/insumoService';
import { InsumoDto } from '@/types/insumo';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';

const InsumoList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: insumos, isLoading, error } = useQuery({
    queryKey: ['insumos'],
    queryFn: getAllInsumos
  });

  const deleteMutation = useMutation({
    mutationFn: deleteInsumo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insumos'] });
      toast({
        title: 'Insumo removido',
        description: 'O insumo foi removido com sucesso.',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o insumo.',
        variant: 'destructive',
      });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este insumo?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return (
    <>
      <Navbar />
      <div className="flex justify-center p-8">Carregando insumos...</div>
    </>
  );
  
  if (error) return (
    <>
      <Navbar />
      <div className="text-red-500 p-4">Erro ao carregar insumos</div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Lista de Insumos</h1>
          <Link to="/insumos/new">
            <Button>
              <Plus className="mr-2" size={16} />
              Novo Insumo
            </Button>
          </Link>
        </div>

        {insumos && insumos.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Unidade de Medida</TableHead>
                <TableHead>Custo Unitário</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {insumos.map((insumo) => (
                <TableRow key={insumo.id}>
                  <TableCell>{insumo.id}</TableCell>
                  <TableCell>{insumo.nome}</TableCell>
                  <TableCell>{insumo.unMedida}</TableCell>
                  <TableCell>R$ {insumo.custoUn.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/insumos/edit/${insumo.id}`}>
                        <Button variant="outline" size="icon">
                          <Edit size={16} />
                        </Button>
                      </Link>
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        onClick={() => insumo.id && handleDelete(insumo.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Nenhum insumo encontrado</p>
            <Link to="/insumos/new" className="mt-4 inline-block">
              <Button>
                <Plus className="mr-2" size={16} />
                Adicionar primeiro insumo
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default InsumoList;
