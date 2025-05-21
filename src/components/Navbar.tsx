
import { Link } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Navbar = () => {
  return (
    <nav className="bg-primary text-primary-foreground shadow-sm">
      <div className="container mx-auto flex items-center h-14 px-4">
        <div className="flex items-center">
          <SidebarTrigger />
          <div className="ml-4 md:hidden">
            <Link to="/" className="text-xl font-bold">
              Calculadora
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
