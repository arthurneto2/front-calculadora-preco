
import { useQuery } from '@tanstack/react-query';
import { getAllInsumos } from '@/services/insumoService';
import { AppSidebar } from '@/components/AppSidebar';
import { ProdutoSelector } from '@/components/produto-calculadora/ProdutoSelector';
import { ProdutoDetails } from '@/components/produto-calculadora/ProdutoDetails';
import { IngredienteForm } from '@/components/produto-calculadora/IngredienteForm';
import { IngredientesList } from '@/components/produto-calculadora/IngredientesList';
import { useProdutoCalculadora } from '@/hooks/useProdutoCalculadora';

const ProdutoCalculadora = () => {
  const {
    selectedProductId,
    selectedProduct,
    ingredientes,
    isAddingIngrediente,
    isCalculatingPrice,
    handleSelectProduct,
    handleAddIngrediente,
    handleCalcularPreco,
  } = useProdutoCalculadora();

  // Query for insumos (needed for ingredients list)
  const { data: insumos } = useQuery({
    queryKey: ['insumos'],
    queryFn: getAllInsumos,
  });

  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Calculadora de Produtos</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <ProdutoSelector onSelectProduto={handleSelectProduct} />

          {selectedProduct && (
            <ProdutoDetails 
              produto={selectedProduct} 
              onCalcularPreco={handleCalcularPreco} 
              isCalculating={isCalculatingPrice}
            />
          )}
        </div>

        {selectedProductId && (
          <div className="mt-6 grid gap-6">
            <IngredienteForm 
              onAddIngrediente={handleAddIngrediente}
              isSubmitting={isAddingIngrediente}
            />

            <IngredientesList 
              ingredientes={ingredientes} 
              insumos={insumos}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProdutoCalculadora;
