# Guida Migrazione Progetto Sicopack

## 1. Schema Database Completo

### Tabelle

```sql
-- Tabella categorie prodotti
CREATE TABLE public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  cover_image_url TEXT,
  bg_desktop_url TEXT,
  bg_mobile_url TEXT,
  overlay_opacity NUMERIC DEFAULT 0.35,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabella prodotti
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  cover_image_url TEXT NOT NULL,
  detail_images_urls TEXT[] DEFAULT '{}',
  category_id UUID NOT NULL REFERENCES public.product_categories(id) ON DELETE CASCADE,
  bg_desktop_url TEXT,
  bg_mobile_url TEXT,
  overlay_opacity NUMERIC DEFAULT 0.35,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabella admin
CREATE TABLE public.admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabella impostazioni sito
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bg_desktop_url TEXT,
  bg_mobile_url TEXT,
  overlay_opacity NUMERIC DEFAULT 0.35,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabella sfondi pagine
CREATE TABLE public.page_backgrounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path_pattern TEXT NOT NULL,
  bg_desktop_url TEXT,
  bg_mobile_url TEXT,
  overlay_opacity NUMERIC DEFAULT 0.35,
  priority INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Funzioni Database

```sql
-- Funzione per aggiornare updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger per products
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Funzione per verificare se un utente è admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admins
    WHERE admins.user_id = $1
  )
$$;

-- Funzione per aggiungere admin tramite email
CREATE OR REPLACE FUNCTION public.add_admin_by_email(admin_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'auth'
AS $$
DECLARE
  uid UUID;
BEGIN
  SELECT id INTO uid FROM auth.users WHERE email = admin_email;
  IF uid IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  INSERT INTO public.admins(user_id)
  SELECT uid
  WHERE NOT EXISTS (
    SELECT 1 FROM public.admins WHERE user_id = uid
  );
END;
$$;

-- Funzione per elencare gli admin
CREATE OR REPLACE FUNCTION public.list_admins()
RETURNS TABLE(user_id UUID, email TEXT)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public', 'auth'
AS $$
  SELECT a.user_id, u.email
  FROM public.admins a
  JOIN auth.users u ON u.id = a.user_id
  ORDER BY u.email;
$$;
```

### Row Level Security (RLS) Policies

```sql
-- RLS per product_categories
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
ON public.product_categories FOR SELECT
USING (true);

CREATE POLICY "Only admins can insert categories"
ON public.product_categories FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

CREATE POLICY "Only admins can update categories"
ON public.product_categories FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

CREATE POLICY "Only admins can delete categories"
ON public.product_categories FOR DELETE
USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- RLS per products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
ON public.products FOR SELECT
USING (true);

CREATE POLICY "Only admins can insert products"
ON public.products FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

CREATE POLICY "Only admins can update products"
ON public.products FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

CREATE POLICY "Only admins can delete products"
ON public.products FOR DELETE
USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- RLS per admins
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all admin records"
ON public.admins FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert admin records"
ON public.admins FOR INSERT
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can delete admin records"
ON public.admins FOR DELETE
USING (is_admin(auth.uid()));

-- RLS per site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site settings"
ON public.site_settings FOR SELECT
USING (true);

CREATE POLICY "Only admins can insert site settings"
ON public.site_settings FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

CREATE POLICY "Only admins can update site settings"
ON public.site_settings FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

CREATE POLICY "Only admins can delete site settings"
ON public.site_settings FOR DELETE
USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- RLS per page_backgrounds
ALTER TABLE public.page_backgrounds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view page backgrounds"
ON public.page_backgrounds FOR SELECT
USING (true);

CREATE POLICY "Only admins can insert page backgrounds"
ON public.page_backgrounds FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

CREATE POLICY "Only admins can update page backgrounds"
ON public.page_backgrounds FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

CREATE POLICY "Only admins can delete page backgrounds"
ON public.page_backgrounds FOR DELETE
USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));
```

### Storage

```sql
-- Crea bucket pubblico per media
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true);

-- RLS per storage
CREATE POLICY "Anyone can view media files"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

CREATE POLICY "Only admins can upload media files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'media' AND
  EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
);

CREATE POLICY "Only admins can update media files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'media' AND
  EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
);

CREATE POLICY "Only admins can delete media files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'media' AND
  EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
);
```

## 2. Configurazione Supabase

### Auth Settings
- Abilita Email OTP (Magic Link)
- Disabilita "Confirm Email" per velocizzare il testing
- Site URL: il tuo dominio di produzione
- Redirect URLs: aggiungi i tuoi domini di sviluppo e produzione

### Environment Variables (.env)
```env
VITE_SUPABASE_URL=https://tuo-progetto.supabase.co
VITE_SUPABASE_ANON_KEY=tua-anon-key
```

## 3. Primo Admin

Dopo aver eseguito le migration:

1. Registra un utente tramite l'app (route `/admin`)
2. Vai nella dashboard Supabase → Authentication → Users
3. Copia l'UUID dell'utente
4. Vai in SQL Editor ed esegui:
```sql
INSERT INTO public.admins (user_id) VALUES ('uuid-utente-copiato');
```

## 4. Componenti UI Principali

### Layout
- `src/components/Navbar.tsx` - Navigation bar con catalogo dropdown
- `src/components/Footer.tsx` - Footer del sito
- `src/components/Hero.tsx` - Hero section homepage
- `src/components/HeroBackground.tsx` - Background dinamico con overlay

### Prodotti
- `src/components/ProductGrid.tsx` - Griglia prodotti homepage
- `src/components/CompanyInfo.tsx` - Sezione informazioni azienda

### Admin Dashboard
- `src/components/admin/CategoriesManager.tsx` - Gestione categorie
- `src/components/admin/ProductsManager.tsx` - Gestione prodotti
- `src/components/admin/SiteSettingsManager.tsx` - Impostazioni sito
- `src/components/admin/PageBackgroundsManager.tsx` - Gestione sfondi
- `src/components/admin/AdminsManager.tsx` - Gestione amministratori

### Pages
- `src/pages/Index.tsx` - Homepage
- `src/pages/Company.tsx` - Pagina azienda
- `src/pages/CategoryPage.tsx` - Pagina categoria con ricerca
- `src/pages/ProductDetailPage.tsx` - Dettaglio prodotto
- `src/pages/AdminLogin.tsx` - Login admin (magic link)
- `src/pages/AdminDashboard.tsx` - Dashboard amministrazione

### Hooks
- `src/hooks/useAuth.ts` - Gestione autenticazione
- `src/hooks/usePageBackground.ts` - Gestione sfondi dinamici

### Utilities
- `src/lib/supabase.ts` - Helper per upload/delete immagini storage

## 5. Routing (App.tsx)

```tsx
<Routes>
  <Route path="/" element={<Index />} />
  <Route path="/company" element={<Company />} />
  <Route path="/c/:slug" element={<CategoryPage />} />
  <Route path="/p/:slug" element={<ProductDetailPage />} />
  <Route path="/admin" element={<AdminLogin />} />
  <Route path="/admin/dashboard" element={<AdminDashboard />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

## 6. Design System

Il progetto usa un design system basato su Tailwind CSS con:
- Semantic tokens in `src/index.css`
- Configurazione Tailwind in `tailwind.config.ts`
- Componenti shadcn/ui in `src/components/ui/`
- Font: Playfair Display (titoli) e Poppins (testo)

## 7. Note Importanti

- Tutte le immagini sono gestite tramite Supabase Storage nel bucket `media`
- Gli sfondi sono dinamici e configurabili per pattern di path
- L'autenticazione admin usa magic link (email OTP)
- Il sistema è completamente responsive (mobile/desktop)
