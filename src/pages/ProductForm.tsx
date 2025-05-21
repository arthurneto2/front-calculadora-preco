
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { ProductFormFields } from '@/components/product/ProductFormFields';
import { ProductFormActions } from '@/components/product/ProductFormActions';
import { useProductForm } from '@/hooks/useProductForm';

const ProductForm = () => {
  const {
    form,
    isEditing,
    product,
    isLoadingProduct,
    isSubmitting,
    onSubmit,
    handleCancel,
  } = useProductForm();

  // Use useEffect to set form values when product data is loaded
  useEffect(() => {
    if (product) {
      form.reset({
        nome: product.nome,
        precoVenda: product.precoVenda,
        custoTotal: product.custoTotal,
        margemDeLucro: product.margemDeLucro,
      });
    }
  }, [product, form]);

  if (isLoadingProduct) {
    return <div className="container mx-auto p-4">Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{isEditing ? 'Editar Produto' : 'Novo Produto'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <ProductFormFields form={form} />
              <ProductFormActions 
                isSubmitting={isSubmitting} 
                onCancel={handleCancel} 
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductForm;
