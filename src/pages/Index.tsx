import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold font-playfair text-foreground mb-4">
              Our Product Categories
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our comprehensive range of premium packaging solutions
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">Loading categories...</div>
          ) : categories?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No categories available yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories?.map((category) => (
                <Link key={category.id} to={`/c/${category.slug}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    {category.cover_image_url && (
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={category.cover_image_url}
                          alt={category.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-semibold font-playfair text-center">
                        {category.name}
                      </h2>
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

export default Index;
