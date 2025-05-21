
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { InsumoFormFields } from '@/components/insumo/InsumoFormFields';
import { InsumoFormActions } from '@/components/insumo/InsumoFormActions';
import { useInsumoForm } from '@/hooks/useInsumoForm';
import Navbar from '@/components/Navbar';

const InsumoForm = () => {
  const {
    form,
    isEditing,
    insumo,
    isLoadingInsumo,
    isSubmitting,
    onSubmit,
    handleCancel,
  } = useInsumoForm();

  // Use useEffect to set form values when insumo data is loaded
  useEffect(() => {
    if (insumo) {
      form.reset({
        nome: insumo.nome,
        unMedida: insumo.unMedida,
        custoUn: insumo.custoUn,
      });
    }
  }, [insumo, form]);

  if (isLoadingInsumo) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-4">Carregando...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{isEditing ? 'Editar Insumo' : 'Novo Insumo'}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-4">
                <InsumoFormFields form={form} />
                <InsumoFormActions 
                  isSubmitting={isSubmitting} 
                  onCancel={handleCancel} 
                />
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default InsumoForm;
