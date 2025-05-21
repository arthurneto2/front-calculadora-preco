
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Navbar from "./Navbar";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col w-full">
          <Navbar />
          <SidebarInset>
            <div className="p-4">
              {children}
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ProtectedRoute;
