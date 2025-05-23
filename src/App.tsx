
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
                path="/produto/novo" 
                element={
                  <ProtectedRoute>
                    <ProductForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/produto/editar/:id" 
                element={
                  <ProtectedRoute>
                    <ProductForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/produto/:id" 
                element={
                  <ProtectedRoute>
                    <ProductDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/insumo" 
                element={
                  <ProtectedRoute>
                    <InsumoList />
                  </ProtectedRoute>
                } 
              />
              {/* Redirect from the old route to the new one */}
              <Route 
                path="/insumos" 
                element={<Navigate to="/insumo" replace />} 
              />
              <Route 
                path="/insumo/novo" 
                element={
                  <ProtectedRoute>
                    <InsumoForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/insumo/editar/:id" 
                element={
                  <ProtectedRoute>
                    <InsumoForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/insumo/:id" 
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
