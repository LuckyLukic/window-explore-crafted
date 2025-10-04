import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, uploadImage } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X } from "lucide-react";

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  cover_image_url: string;
  detail_images_urls: string[];
  category_id: string;
}

const ProductsManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    slug: '',
    name: '',
    description: '',
    cover_image_url: '',
    detail_images_urls: [] as string[],
    category_id: ''
  });
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [detailImageFiles, setDetailImageFiles] = useState<File[]>([]);
  const [detailImagePreviews, setDetailImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', filterCategory],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*, category:product_categories(name)')
        .order('created_at', { ascending: false });

      if (filterCategory !== 'all') {
        query = query.eq('category_id', filterCategory);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as (Product & { category: { name: string } })[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      setUploading(true);
      
      let coverUrl = data.cover_image_url;
      if (coverImageFile) {
        coverUrl = await uploadImage(coverImageFile, 'products');
      }

      const detailUrls = [...data.detail_images_urls];
      for (const file of detailImageFiles) {
        const url = await uploadImage(file, 'products/details');
        detailUrls.push(url);
      }

      const { error } = await supabase
        .from('products')
        .insert({
          ...data,
          cover_image_url: coverUrl,
          detail_images_urls: detailUrls
        });
      
      setUploading(false);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created');
      resetForm();
    },
    onError: (error: Error) => {
      setUploading(false);
      toast.error(error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      setUploading(true);
      
      let coverUrl = data.cover_image_url;
      if (coverImageFile) {
        coverUrl = await uploadImage(coverImageFile, 'products');
      }

      const detailUrls = [...data.detail_images_urls];
      for (const file of detailImageFiles) {
        const url = await uploadImage(file, 'products/details');
        detailUrls.push(url);
      }

      const { error } = await supabase
        .from('products')
        .update({
          ...data,
          cover_image_url: coverUrl,
          detail_images_urls: detailUrls
        })
        .eq('id', id);
      
      setUploading(false);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated');
      resetForm();
    },
    onError: (error: Error) => {
      setUploading(false);
      toast.error(error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted');
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const resetForm = () => {
    setFormData({
      slug: '',
      name: '',
      description: '',
      cover_image_url: '',
      detail_images_urls: [],
      category_id: ''
    });
    setEditingProduct(null);
    setCoverImageFile(null);
    setDetailImageFiles([]);
    setDetailImagePreviews([]);
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      slug: product.slug,
      name: product.name,
      description: product.description,
      cover_image_url: product.cover_image_url,
      detail_images_urls: product.detail_images_urls || [],
      category_id: product.category_id
    });
    setIsDialogOpen(true);
  };

  const removeDetailImage = (index: number) => {
    setFormData({
      ...formData,
      detail_images_urls: formData.detail_images_urls.filter((_, i) => i !== index)
    });
  };

  const removeDetailImageFile = (index: number) => {
    setDetailImageFiles(detailImageFiles.filter((_, i) => i !== index));
    setDetailImagePreviews(detailImagePreviews.filter((_, i) => i !== index));
  };

  const handleDetailImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setDetailImageFiles([...detailImageFiles, ...files]);
    
    // Create preview URLs for new files
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setDetailImagePreviews([...detailImagePreviews, ...newPreviews]);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Products</CardTitle>
        <div className="flex gap-4">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Edit Product' : 'Add Product'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="slug">Slug (URL friendly)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g., premium-face-cream"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Premium Face Cream"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Product description..."
                    rows={5}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cover-image">Cover Image</Label>
                  <Input
                    id="cover-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverImageFile(e.target.files?.[0] || null)}
                  />
                  {formData.cover_image_url && !coverImageFile && (
                    <img src={formData.cover_image_url} alt="Current cover" className="mt-2 w-32 h-32 object-cover rounded" />
                  )}
                </div>
                <div>
                  <Label htmlFor="detail-images">Detail Images (Gallery)</Label>
                  <Input
                    id="detail-images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleDetailImagesChange}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    You can select multiple images at once, or add more images by selecting files again
                  </p>
                  
                  {/* Existing saved images */}
                  {formData.detail_images_urls.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Saved Gallery Images</p>
                      <div className="grid grid-cols-4 gap-2">
                        {formData.detail_images_urls.map((url, idx) => (
                          <div key={`saved-${idx}`} className="relative">
                            <img src={url} alt={`Detail ${idx + 1}`} className="w-full h-20 object-cover rounded" />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-0 right-0 h-6 w-6 p-0"
                              onClick={() => removeDetailImage(idx)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* New images to be uploaded */}
                  {detailImageFiles.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">New Images to Upload ({detailImageFiles.length})</p>
                      <div className="grid grid-cols-4 gap-2">
                        {detailImagePreviews.map((preview, idx) => (
                          <div key={`new-${idx}`} className="relative">
                            <img src={preview} alt={`New ${idx + 1}`} className="w-full h-20 object-cover rounded" />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-0 right-0 h-6 w-6 p-0"
                              onClick={() => removeDetailImageFile(idx)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Button type="submit" disabled={uploading || createMutation.isPending || updateMutation.isPending}>
                  {uploading ? 'Uploading...' : editingProduct ? 'Update' : 'Create'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img 
                      src={product.cover_image_url} 
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell>{product.slug}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductsManager;
