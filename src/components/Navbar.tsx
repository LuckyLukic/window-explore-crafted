import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const productCategories = [
    { name: "All Products", href: "/catalog" },
    { name: "Cosmetics & Perfumery", href: "/catalog/cosmetics" },
    { name: "Cleaning", href: "/catalog/cleaning" },
    { name: "Pharma", href: "/catalog/pharma" },
    { name: "Food Pack", href: "/catalog/food" },
    { name: "Pet Care", href: "/catalog/pet" },
    { name: "Professional", href: "/catalog/professional" },
  ];

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary font-playfair tracking-tight">
              PACKAGING
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/company"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Company
            </Link>
            
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">
                    Catalog
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-64 p-4">
                      {productCategories.map((category) => (
                        <Link
                          key={category.name}
                          to={category.href}
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

            <Link
              to="/sustainability"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Sustainability
            </Link>
            <Link
              to="/news"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              News
            </Link>
            
            <Button asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
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
            {productCategories.map((category) => (
              <Link
                key={category.name}
                to={category.href}
                className="block pl-8 py-2 text-sm text-muted-foreground hover:bg-secondary rounded-md"
                onClick={() => setIsOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            <Link
              to="/sustainability"
              className="block px-4 py-2 text-foreground hover:bg-secondary rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Sustainability
            </Link>
            <Link
              to="/news"
              className="block px-4 py-2 text-foreground hover:bg-secondary rounded-md"
              onClick={() => setIsOpen(false)}
            >
              News
            </Link>
            <div className="px-4 pt-2">
              <Button asChild className="w-full">
                <Link to="/contact" onClick={() => setIsOpen(false)}>
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
