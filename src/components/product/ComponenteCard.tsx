
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
  
  // Debug otimizado para o novo endpoint
  console.log('=== ComponenteCard - Dados do Novo Endpoint ===');
  console.log('Componente ID:', componente.id);
  console.log("Quantidade: ", componente.quantidade)
  console.log('Dados do insumo no componente:', {
    id: componente.insumoDto.id,
    nome: componente.insumoDto.nome,
    custoUn: componente.insumoDto.custoUn,
    unMedida: componente.insumoDto.unMedida,

  });
  
  // Lógica otimizada: priorizar dados que vêm diretamente do endpoint
  const insumoNome = componente.insumoDto.nome || 
                     `Insumo não encontrado (ID: ${componente.insumoDto.id})`;
                     
  const insumoCustoUn = componente.insumoDto.custoUn ?? 
                        insumos?.find(i => i.id === componente.insumoDto.id) ?? 
                        0;
                        
  const unidadeMedida = componente.insumoDto?.unMedida || 
                        'un';
  
  console.log('Dados finais processados:', {
    nome: insumoNome,
    custoUn: insumoCustoUn,
    unidade: unidadeMedida,
    quantidade: componente.quantidade,
    temDadosCompletos: !!(componente.insumoNome && componente.insumoCustoUn)
  });
  
  // Calcula o custo total
  const custoTotal = insumoCustoUn * componente.quantidade;
  
  const handleSave = () => {
    onUpdateQuantidade(componente, quantidade);
    setIsEditing(false);
  };
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          {insumoNome}
          {componente.insumoNome && componente.insumoCustoUn && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              Dados Completos
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex flex-col">
            <span className="font-medium text-gray-600">Custo Unitário:</span>
            <span className="font-semibold text-lg">R$ {insumoCustoUn.toFixed(2)}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="font-medium text-gray-600">Unidade:</span>
            <span>{unidadeMedida}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="font-medium text-gray-600">Quantidade:</span>
            {isEditing ? (
              <Input 
                type="number" 
                value={quantidade} 
                onChange={(e) => setQuantidade(Number(e.target.value))} 
                step="0.01"
                min="0"
                className="mt-1"
              />
            ) : (
              <span className="font-semibold">{componente.quantidade}</span>
            )}
          </div>
          
          <div className="flex flex-col">
            <span className="font-medium text-gray-600">Custo Total:</span>
            <span className="font-bold text-lg text-primary">R$ {custoTotal.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-4">
        {isEditing ? (
          <Button 
            onClick={handleSave} 
            disabled={isUpdating}
            size="sm"
            className="flex-1 mr-2"
          >
            <Save className="mr-2" size={16} />
            Salvar
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(true)} 
            size="sm"
            className="flex-1 mr-2"
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
