import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import CompanyInfo from "@/components/CompanyInfo";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ProductGrid />
        <CompanyInfo />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
