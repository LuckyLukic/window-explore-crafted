import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/hero-packaging.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            We Add Value
            <br />
            <span className="text-primary">to Your Product</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            We offer personalized and innovative packaging solutions for cosmetics, pharmaceuticals, food, pet care, perfumery, home, and car cleaning sectors. Our expert team is here to provide tailored solutions, combining innovation, functionality, and design to enhance your products.
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-lg p-2 flex gap-2 mb-6 max-w-xl">
            <Input
              type="text"
              placeholder="Search our catalog for the perfect product..."
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button size="icon" className="shrink-0">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <Button size="lg" className="text-lg px-8">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
