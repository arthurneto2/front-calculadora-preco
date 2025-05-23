
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Save, Trash2 } from 'lucide-react';
import { ComponenteProdutoDto } from '@/types/product';
import { InsumoDto } from '@/types/insumo';

interface ComponenteCardProps {
  componente: ComponenteProdutoDto;
  insumos: InsumoDto[];
  onUpdateQuantidade: (componente: ComponenteProdutoDto, novaQuantidade: number) => void;
  onDelete: (componente: ComponenteProdutoDto) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function ComponenteCard({ 
  componente, 
  insumos, 
  onUpdateQuantidade, 
  onDelete,
  isUpdating,
  isDeleting 
}: ComponenteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [quantidade, setQuantidade] = useState(componente.quantidade);
  
  // Encontra o insumo correspondente
  const insumo = insumos.find(i => i.id === componente.insumoId);
  const insumoNome = componente.insumoNome || insumo?.nome || 'Insumo não encontrado';
  const insumoCustoUn = componente.insumoCustoUn || insumo?.custoUn || 0;
  const unidadeMedida = insumo?.unMedida || '';
  
  // Calcula o custo total
  const custoTotal = insumoCustoUn * componente.quantidade;
  
  const handleSave = () => {
    onUpdateQuantidade(componente, quantidade);
    setIsEditing(false);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{insumoNome}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-sm font-medium text-gray-500">Custo Unitário:</div>
          <div className="text-sm">R$ {insumoCustoUn.toFixed(2)}</div>
          
          <div className="text-sm font-medium text-gray-500">Unidade:</div>
          <div className="text-sm">{unidadeMedida}</div>
          
          <div className="text-sm font-medium text-gray-500">Quantidade:</div>
          <div className="text-sm">
            {isEditing ? (
              <Input 
                type="number" 
                value={quantidade} 
                onChange={(e) => setQuantidade(Number(e.target.value))} 
                step="0.01"
                min="0"
              />
            ) : (
              <span>{componente.quantidade}</span>
            )}
          </div>
          
          <div className="text-sm font-medium text-gray-500">Custo Total:</div>
          <div className="text-sm">R$ {custoTotal.toFixed(2)}</div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {isEditing ? (
          <Button 
            onClick={handleSave} 
            disabled={isUpdating}
            size="sm"
          >
            <Save className="mr-2" size={16} />
            Salvar
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(true)} 
            size="sm"
          >
            <Edit className="mr-2" size={16} />
            Editar
          </Button>
        )}
        
        <Button 
          variant="destructive" 
          onClick={() => onDelete(componente)} 
          disabled={isDeleting}
          size="sm"
        >
          <Trash2 className="mr-2" size={16} />
          Remover
        </Button>
      </CardFooter>
    </Card>
  );
}
