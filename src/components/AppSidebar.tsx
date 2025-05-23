
import { Link } from "react-router-dom";
import { BarChart2, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const { logout } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/" className="flex items-center px-4 py-2">
          <span className="text-xl font-bold">Calculadora de Preços</span>
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Produtos">
              <Link to="/">
                <BarChart2 className="h-4 w-4" />
                <span>Produtos</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Insumos">
              <Link to="/insumo">
                <Package className="h-4 w-4" />
                <span>Insumos</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <div className="p-4">
          <Button onClick={logout} variant="outline" className="w-full">
            Sair
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
