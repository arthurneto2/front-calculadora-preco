
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InsumoDto } from '@/types/insumo';
import { AdicionarIngredienteDto } from '@/types/product';

interface AdicionarComponenteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  insumos: InsumoDto[];
  onSubmit: (data: AdicionarIngredienteDto) => void;
  isSubmitting: boolean;
}

export function AdicionarComponenteDialog({ 
  open, 
  onOpenChange, 
  insumos, 
  onSubmit,
  isSubmitting 
}: AdicionarComponenteDialogProps) {
  const [insumoId, setInsumoId] = useState<string>('');
  const [quantidade, setQuantidade] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!insumoId) {
      setError('Selecione um insumo');
      return;
    }
    
    if (quantidade <= 0) {
      setError('A quantidade deve ser maior que zero');
      return;
    }
    
    onSubmit({
      insumoId: Number(insumoId),
      quantidade
    });
    
    // Reset form
    setInsumoId('');
    setQuantidade(0);
    setError(null);
  };
  
  // Reset form when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setInsumoId('');
      setQuantidade(0);
      setError(null);
    }
    onOpenChange(open);
  };
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Componente</DialogTitle>
          <DialogDescription>
            Adicione um insumo como componente deste produto
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="text-sm font-medium text-destructive">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="insumo" className="text-right">
                Insumo
              </Label>
              <div className="col-span-3">
                <Select
                  value={insumoId}
                  onValueChange={setInsumoId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um insumo" />
                  </SelectTrigger>
                  <SelectContent>
                    {insumos.map((insumo) => (
                      <SelectItem key={insumo.id} value={String(insumo.id)}>
                        {insumo.nome} - R$ {insumo.custoUn.toFixed(2)}/{insumo.unMedida}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantidade" className="text-right">
                Quantidade
              </Label>
              <div className="col-span-3">
                <Input
                  id="quantidade"
                  type="number"
                  step="0.01"
                  min="0"
                  value={quantidade || ''}
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adicionando...' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
