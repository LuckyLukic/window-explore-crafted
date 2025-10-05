import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import HeroBackground from "@/components/HeroBackground";
import { usePageBackground } from "@/hooks/usePageBackground";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: category } = useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', category?.id],
    queryFn: async () => {
      if (!category?.id) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', category.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!category?.id
  });

  const background = usePageBackground(category);

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroBackground
        desktopUrl={background.desktopUrl}
        mobileUrl={background.mobileUrl}
        overlay={background.overlay}
        title={category?.name}
      >
        <p className="text-lg opacity-90 mt-2">
          Packaging per prodotti di {category?.name}. Completamente personalizzabili!
        </p>
      </HeroBackground>
      <main className="flex-1 py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="mb-12 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Cerca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">Loading products...</div>
          ) : filteredProducts?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchTerm ? "Nessun prodotto trovato." : "No products in this category yet."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts?.map((product) => (
                <Link key={product.id} to={`/p/${product.slug}`}>
                  <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-muted/30">
                    <div className="aspect-square overflow-hidden bg-background">
                      <img
                        src={product.cover_image_url}
                        alt={product.name}
                        className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-6 text-center">
                      <h3 className="text-lg font-semibold text-primary mb-2">
                        {product.name}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
