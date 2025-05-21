
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <nav className="bg-primary text-primary-foreground shadow-sm">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold">
            Calculadora de Preços
          </Link>
          <div className="ml-6 hidden md:flex space-x-4">
            <Link to="/calculator" className="px-3 py-2 rounded-md hover:bg-primary-foreground/10">
              Calculadora
            </Link>
            <Link to="/products" className="px-3 py-2 rounded-md hover:bg-primary-foreground/10">
              Produtos
            </Link>
            <Link to="/insumos" className="px-3 py-2 rounded-md hover:bg-primary-foreground/10">
              Insumos
            </Link>
          </div>
        </div>
        <div>
          <Button variant="outline" onClick={logout}>
            Sair
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
