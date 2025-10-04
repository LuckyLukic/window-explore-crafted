-- Add background fields to existing tables
ALTER TABLE product_categories
  ADD COLUMN IF NOT EXISTS bg_desktop_url text,
  ADD COLUMN IF NOT EXISTS bg_mobile_url text,
  ADD COLUMN IF NOT EXISTS overlay_opacity numeric DEFAULT 0.35;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS bg_desktop_url text,
  ADD COLUMN IF NOT EXISTS bg_mobile_url text,
  ADD COLUMN IF NOT EXISTS overlay_opacity numeric DEFAULT 0.35;

-- Site settings table (single row for global defaults)
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bg_desktop_url text,
  bg_mobile_url text,
  overlay_opacity numeric DEFAULT 0.35,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default row
INSERT INTO site_settings (id) VALUES (gen_random_uuid())
ON CONFLICT DO NOTHING;

-- Page backgrounds (route-level overrides)
CREATE TABLE IF NOT EXISTS page_backgrounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path_pattern text UNIQUE NOT NULL,
  bg_desktop_url text,
  bg_mobile_url text,
  overlay_opacity numeric DEFAULT 0.35,
  priority int DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_backgrounds ENABLE ROW LEVEL SECURITY;

-- RLS policies for site_settings
CREATE POLICY "Anyone can view site settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Only admins can update site settings"
  ON site_settings FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));

CREATE POLICY "Only admins can insert site settings"
  ON site_settings FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));

CREATE POLICY "Only admins can delete site settings"
  ON site_settings FOR DELETE
  USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));

-- RLS policies for page_backgrounds
CREATE POLICY "Anyone can view page backgrounds"
  ON page_backgrounds FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert page backgrounds"
  ON page_backgrounds FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));

CREATE POLICY "Only admins can update page backgrounds"
  ON page_backgrounds FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));

CREATE POLICY "Only admins can delete page backgrounds"
  ON page_backgrounds FOR DELETE
  USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_backgrounds_updated_at
  BEFORE UPDATE ON page_backgrounds
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();