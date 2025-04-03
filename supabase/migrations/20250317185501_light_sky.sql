/*
  # Correção da estrutura do banco de dados

  1. Alterações
    - Removida coluna 'position' que causava conflito
    - Adicionada coluna 'display_order' para ordenação
    - Corrigidos tipos de dados e constraints
    - Adicionados índices para melhor performance
    - Atualizadas políticas de segurança

  2. Tabelas Afetadas
    - carousel_items
    - highlights
    - events
    - media_items
    - ads
    - site_appearance
    - site_sections
    - site_pages
    - admin_users

  3. Segurança
    - Habilitado RLS em todas as tabelas
    - Adicionadas políticas de acesso apropriadas
*/

-- Função para atualização automática de timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Recriação das tabelas com estrutura corrigida
DROP TABLE IF EXISTS carousel_items CASCADE;
DROP TABLE IF EXISTS highlights CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS media_items CASCADE;
DROP TABLE IF EXISTS ads CASCADE;
DROP TABLE IF EXISTS site_appearance CASCADE;
DROP TABLE IF EXISTS site_sections CASCADE;
DROP TABLE IF EXISTS site_pages CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Carousel Items
CREATE TABLE IF NOT EXISTS carousel_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_carousel_display_order ON carousel_items(display_order);

CREATE TRIGGER update_carousel_items_updated_at
  BEFORE UPDATE ON carousel_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Highlights
CREATE TABLE IF NOT EXISTS highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  icon text NOT NULL,
  color text NOT NULL DEFAULT '#408040',
  display_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_highlights_display_order ON highlights(display_order);

CREATE TRIGGER update_highlights_updated_at
  BEFORE UPDATE ON highlights
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Events
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  date text NOT NULL,
  location text NOT NULL,
  image_url text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Media Items
CREATE TABLE IF NOT EXISTS media_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL,
  description text,
  url text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER update_media_items_updated_at
  BEFORE UPDATE ON media_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Ads
CREATE TABLE IF NOT EXISTS ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  link text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER update_ads_updated_at
  BEFORE UPDATE ON ads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Site Appearance
CREATE TABLE IF NOT EXISTS site_appearance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_colors jsonb NOT NULL DEFAULT '{
    "primary": "#408040",
    "secondary": "#1a3d1a",
    "accent": "#66b366",
    "text": "#1a1a1a",
    "background": "#ffffff"
  }'::jsonb,
  typography jsonb NOT NULL DEFAULT '{
    "headingFont": "Montserrat",
    "bodyFont": "Inter",
    "baseFontSize": "16px",
    "lineHeight": "1.5"
  }'::jsonb,
  spacing jsonb NOT NULL DEFAULT '{
    "containerPadding": "1rem",
    "sectionSpacing": "4rem"
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER update_site_appearance_updated_at
  BEFORE UPDATE ON site_appearance
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Site Sections
CREATE TABLE IF NOT EXISTS site_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  content jsonb NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER update_site_sections_updated_at
  BEFORE UPDATE ON site_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Site Pages
CREATE TABLE IF NOT EXISTS site_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content jsonb NOT NULL DEFAULT '{"sections": []}'::jsonb,
  meta_description text,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER update_site_pages_updated_at
  BEFORE UPDATE ON site_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousel_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_appearance ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_pages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow authenticated read access" ON admin_users
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow public read access" ON carousel_items
  FOR SELECT TO public USING (active = true);

CREATE POLICY "Allow admin full access" ON carousel_items
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

CREATE POLICY "Allow public read access" ON highlights
  FOR SELECT TO public USING (active = true);

CREATE POLICY "Allow admin full access" ON highlights
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

CREATE POLICY "Allow public read access" ON events
  FOR SELECT TO public USING (active = true);

CREATE POLICY "Allow admin full access" ON events
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

CREATE POLICY "Allow public read access" ON media_items
  FOR SELECT TO public USING (active = true);

CREATE POLICY "Allow admin full access" ON media_items
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

CREATE POLICY "Allow public read access" ON ads
  FOR SELECT TO public USING (active = true);

CREATE POLICY "Allow admin full access" ON ads
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

CREATE POLICY "Allow public read access" ON site_appearance
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow admin full access" ON site_appearance
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

CREATE POLICY "Allow public read access" ON site_sections
  FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Allow admin full access" ON site_sections
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

CREATE POLICY "Allow public read access" ON site_pages
  FOR SELECT TO public USING (is_published = true);

CREATE POLICY "Allow admin full access" ON site_pages
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));