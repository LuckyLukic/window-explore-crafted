-- Create product_categories table
CREATE TABLE public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  cover_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_image_url TEXT NOT NULL,
  detail_images_urls TEXT[] DEFAULT '{}',
  category_id UUID REFERENCES public.product_categories(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create admins table
CREATE TABLE public.admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS on all tables
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- RLS Policies for product_categories
-- Public can view all categories
CREATE POLICY "Anyone can view categories"
  ON public.product_categories
  FOR SELECT
  USING (true);

-- Only admins can insert categories
CREATE POLICY "Only admins can insert categories"
  ON public.product_categories
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    )
  );

-- Only admins can update categories
CREATE POLICY "Only admins can update categories"
  ON public.product_categories
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    )
  );

-- Only admins can delete categories
CREATE POLICY "Only admins can delete categories"
  ON public.product_categories
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for products
-- Public can view all products
CREATE POLICY "Anyone can view products"
  ON public.products
  FOR SELECT
  USING (true);

-- Only admins can insert products
CREATE POLICY "Only admins can insert products"
  ON public.products
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    )
  );

-- Only admins can update products
CREATE POLICY "Only admins can update products"
  ON public.products
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    )
  );

-- Only admins can delete products
CREATE POLICY "Only admins can delete products"
  ON public.products
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for admins table
-- Only admins can view the admins table
CREATE POLICY "Only admins can view admins"
  ON public.admins
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    )
  );

-- Create trigger to update updated_at on products
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for media
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true);

-- Storage policies: public read, admin write
CREATE POLICY "Public can view media files"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'media');

CREATE POLICY "Admins can upload media files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'media' AND
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update media files"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'media' AND
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete media files"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'media' AND
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    )
  );