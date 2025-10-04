import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import CategoriesManager from "@/components/admin/CategoriesManager";
import ProductsManager from "@/components/admin/ProductsManager";
import SiteSettingsManager from "@/components/admin/SiteSettingsManager";
import PageBackgroundsManager from "@/components/admin/PageBackgroundsManager";
import AdminsManager from "@/components/admin/AdminsManager";

const AdminDashboard = () => {
  const { user, loading, isAdmin, signOut } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Signed out successfully");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold font-playfair">Admin Dashboard</h1>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="categories" className="space-y-8">
          <TabsList className="grid w-full max-w-5xl grid-cols-5">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="settings">Site Settings</TabsTrigger>
            <TabsTrigger value="backgrounds">Page Backgrounds</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
          </TabsList>

          <TabsContent value="categories">
            <CategoriesManager />
          </TabsContent>

          <TabsContent value="products">
            <ProductsManager />
          </TabsContent>

          <TabsContent value="settings">
            <SiteSettingsManager />
          </TabsContent>

          <TabsContent value="backgrounds">
            <PageBackgroundsManager />
          </TabsContent>

          <TabsContent value="admins">
            <AdminsManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
