
import { ComponenteProdutoDto } from '@/types/product';
import { InsumoDto } from '@/types/insumo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface IngredientesListProps {
  ingredientes: ComponenteProdutoDto[];
  insumos?: InsumoDto[];
}

export const IngredientesList = ({ ingredientes, insumos }: IngredientesListProps) => {
  // Debug: log para verificar os dados
  console.log('Ingredientes recebidos:', ingredientes);
  console.log('Insumos para busca:', insumos);

  // Function to find insumo name
  const getInsumoNome = (insumoId: number) => {
    const insumo = insumos?.find(i => i.id === insumoId);
    console.log(`Buscando insumo ID ${insumoId}:`, insumo);
    return insumo?.nome || `Insumo ID: ${insumoId}`;
  };

  // Function to find insumo cost
  const getInsumoCustoUn = (insumoId: number) => {
    const insumo = insumos?.find(i => i.id === insumoId);
    return insumo?.custoUn || 0;
  };

  return (
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
                // Prioriza dados que vêm do componente, senão busca do insumo
                const insumoNome = ingrediente.insumoNome || getInsumoNome(ingrediente.insumoId);
                const custoUn = ingrediente.insumoCustoUn ?? getInsumoCustoUn(ingrediente.insumoId);
                const custoTotal = custoUn * ingrediente.quantidade;
                
                console.log(`Ingrediente ${ingrediente.insumoId}:`, {
                  nome: insumoNome,
                  custoUn,
                  quantidade: ingrediente.quantidade,
                  custoTotal
                });
                
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
  );
};
