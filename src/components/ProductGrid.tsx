import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

const ProductGrid = () => {
  const products = [
    {
      id: 1,
      image: product1,
      title: "Cosmetic Pump Dispensers",
      description: "Premium quality pumps for lotions and creams"
    },
    {
      id: 2,
      image: product2,
      title: "Cream Jar Closures",
      description: "Secure and elegant jar dispensing systems"
    },
    {
      id: 3,
      image: product3,
      title: "Trigger Sprayers",
      description: "Professional cleaning and home care solutions"
    },
    {
      id: 4,
      image: product4,
      title: "Airless Pumps",
      description: "Advanced dispensing for high-end formulations"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-primary">
              Explore our catalog and find products tailored to your needs
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex items-center gap-2">
            View Catalog
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card 
              key={product.id} 
              className="group overflow-hidden border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-square overflow-hidden bg-secondary/50">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                  {product.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {product.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" className="flex items-center gap-2 mx-auto">
            View Catalog
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
