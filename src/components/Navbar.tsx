import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import ContactDialog from "@/components/ContactDialog";
import logo from "@/assets/logo-sicopack.gif";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const { data: categories } = useQuery({
    queryKey: ["product-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("product_categories").select("id, name, slug").order("name");
      if (error) throw error;
      return data;
    },
  });
  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Sicopack Logo" className="h-12 w-full" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium">
              Home
            </Link>
            <Link to="/company" className="text-foreground hover:text-primary transition-colors font-medium">
              Company
            </Link>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">Catalog</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-64 p-4">
                      <Link
                        to="/"
                        className="block px-4 py-3 text-sm text-foreground hover:bg-secondary rounded-md transition-colors font-semibold"
                      >
                        All Products
                      </Link>
                      {categories?.map((category) => (
                        <Link
                          key={category.id}
                          to={`/c/${category.slug}`}
                          className="block px-4 py-3 text-sm text-foreground hover:bg-secondary rounded-md transition-colors"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Button onClick={() => setContactDialogOpen(true)}>Contact Us</Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-foreground hover:bg-secondary"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/"
              className="block px-4 py-2 text-foreground hover:bg-secondary rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/company"
              className="block px-4 py-2 text-foreground hover:bg-secondary rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Company
            </Link>
            <div className="px-4 py-2 text-foreground font-medium">Catalog</div>
            <Link
              to="/"
              className="block pl-8 py-2 text-sm font-semibold text-foreground hover:bg-secondary rounded-md"
              onClick={() => setIsOpen(false)}
            >
              All Products
            </Link>
            {categories?.map((category) => (
              <Link
                key={category.id}
                to={`/c/${category.slug}`}
                className="block pl-8 py-2 text-sm text-muted-foreground hover:bg-secondary rounded-md"
                onClick={() => setIsOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            <div className="px-4 pt-2">
              <Button
                className="w-full"
                onClick={() => {
                  setIsOpen(false);
                  setContactDialogOpen(true);
                }}
              >
                Contact Us
              </Button>
            </div>
          </div>
        )}
      </div>

      <ContactDialog open={contactDialogOpen} onOpenChange={setContactDialogOpen} />
    </nav>
  );
};
export default Navbar;
