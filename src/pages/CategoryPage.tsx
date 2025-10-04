import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import HeroBackground from "@/components/HeroBackground";
import { usePageBackground } from "@/hooks/usePageBackground";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroBackground
        desktopUrl={background.desktopUrl}
        mobileUrl={background.mobileUrl}
        overlay={background.overlay}
        title={category?.name}
      >
        <Link to="/" className="text-primary hover:underline inline-block">
          ← Back to Categories
        </Link>
      </HeroBackground>
      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {isLoading ? (
            <div className="text-center py-12">Loading products...</div>
          ) : products?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No products in this category yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products?.map((product) => (
                <Link key={product.id} to={`/p/${product.slug}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={product.cover_image_url}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold font-playfair mb-2">
                        {product.name}
                      </h3>
                      <p className="text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
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
