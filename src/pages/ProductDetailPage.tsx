import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import HeroBackground from "@/components/HeroBackground";
import { usePageBackground } from "@/hooks/usePageBackground";

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedImage, setSelectedImage] = useState<string>("");

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:product_categories(*)')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">Loading product...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">Product not found</div>
        </main>
        <Footer />
      </div>
    );
  }

  const mainImage = selectedImage || product.cover_image_url;
  const allImages = [product.cover_image_url, ...(product.detail_images_urls || [])];
  const background = usePageBackground(product);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroBackground
        desktopUrl={background.desktopUrl}
        mobileUrl={background.mobileUrl}
        overlay={background.overlay}
        title={product.name}
      >
        <Link 
          to={`/c/${product.category.slug}`} 
          className="text-primary hover:underline inline-block"
        >
          ← Back to {product.category.name}
        </Link>
      </HeroBackground>
      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div>
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(image)}
                      className={`aspect-square overflow-hidden rounded-lg border-2 ${
                        (selectedImage || product.cover_image_url) === image
                          ? 'border-primary'
                          : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
