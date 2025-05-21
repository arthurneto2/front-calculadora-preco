
import { Button } from '@/components/ui/button';

interface ProductFormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

export const ProductFormActions = ({ isSubmitting, onCancel }: ProductFormActionsProps) => {
  return (
    <div className="flex justify-end gap-4 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Salvando...' : 'Salvar'}
      </Button>
    </div>
  );
};
