
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ProductList from "./pages/ProductList";
import ProductForm from "./pages/ProductForm";
import ProductDetail from "./pages/ProductDetail";
import InsumoList from "./pages/InsumoList";
import InsumoForm from "./pages/InsumoForm";
import InsumoDetail from "./pages/InsumoDetail";
import ProdutoCalculadora from "./pages/ProdutoCalculadora";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <ProductList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/produto-calculadora" 
                element={
                  <ProtectedRoute>
                    <ProdutoCalculadora />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/products" 
                element={
                  <ProtectedRoute>
                    <ProductList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/products/new" 
                element={
                  <ProtectedRoute>
                    <ProductForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/products/edit/:id" 
                element={
                  <ProtectedRoute>
                    <ProductForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/products/:id" 
                element={
                  <ProtectedRoute>
                    <ProductDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/insumos" 
                element={
                  <ProtectedRoute>
                    <InsumoList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/insumos/new" 
                element={
                  <ProtectedRoute>
                    <InsumoForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/insumos/edit/:id" 
                element={
                  <ProtectedRoute>
                    <InsumoForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/insumos/:id" 
                element={
                  <ProtectedRoute>
                    <InsumoDetail />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
