/*
  # Blog System Schema

  1. Tables
    - blog_posts: Main posts table
    - blog_categories: Categories table
    - blog_post_categories: Junction table
    - featured_articles: Featured posts table
    
  2. Security
    - RLS enabled on all tables
    - Proper policies for public/authenticated access
    
  3. Features
    - Automatic slug generation
    - Updated timestamps
    - Category management
*/

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL,
  author_id uuid REFERENCES auth.users NOT NULL,
  published_at timestamptz,
  is_published boolean DEFAULT false,
  cover_image text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Blog Categories Table
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Blog Post Categories Junction Table
CREATE TABLE IF NOT EXISTS blog_post_categories (
  post_id uuid REFERENCES blog_posts ON DELETE CASCADE,
  category_id uuid REFERENCES blog_categories ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- Featured Articles Table
CREATE TABLE IF NOT EXISTS featured_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES blog_posts ON DELETE CASCADE NOT NULL,
  feature_type text NOT NULL CHECK (feature_type IN ('weekly', 'featured')),
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users NOT NULL,
  UNIQUE (post_id, feature_type)
);

-- Slug Generation Function
CREATE OR REPLACE FUNCTION generate_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(NEW.title, '[^a-zA-Z0-9\s-]', '', 'g'));
    NEW.slug := regexp_replace(NEW.slug, '\s+', '-', 'g');
    
    WHILE EXISTS (
      SELECT 1 FROM blog_posts 
      WHERE slug = NEW.slug 
      AND id != NEW.id
    ) LOOP
      NEW.slug := NEW.slug || '-' || floor(random() * 1000)::text;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS generate_slug_trigger ON blog_posts;
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;

-- Create Triggers
CREATE TRIGGER generate_slug_trigger
  BEFORE INSERT OR UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION generate_slug();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_articles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view published posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can manage own posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can manage all posts" ON blog_posts;
DROP POLICY IF EXISTS "Public can view categories" ON blog_categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON blog_categories;
DROP POLICY IF EXISTS "Public can view post categories" ON blog_post_categories;
DROP POLICY IF EXISTS "Authors can manage own post categories" ON blog_post_categories;
DROP POLICY IF EXISTS "Public can view featured articles" ON featured_articles;
DROP POLICY IF EXISTS "Admins can manage featured articles" ON featured_articles;

-- Create RLS Policies
CREATE POLICY "Public can view published posts"
  ON blog_posts
  FOR SELECT
  TO public
  USING (is_published = true AND published_at <= now());

CREATE POLICY "Authors can manage own posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Admins can manage all posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  ));

CREATE POLICY "Public can view categories"
  ON blog_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON blog_categories
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  ));

CREATE POLICY "Public can view post categories"
  ON blog_post_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authors can manage own post categories"
  ON blog_post_categories
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM blog_posts
    WHERE blog_posts.id = post_id
    AND blog_posts.author_id = auth.uid()
  ));

CREATE POLICY "Public can view featured articles"
  ON featured_articles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage featured articles"
  ON featured_articles
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  ));

-- Insert default categories
INSERT INTO blog_categories (name, slug, description)
VALUES 
  ('Saúde', 'saude', 'Artigos sobre saúde em geral'),
  ('Bem-estar', 'bem-estar', 'Conteúdo sobre bem-estar e qualidade de vida'),
  ('Medicina', 'medicina', 'Informações médicas e tratamentos'),
  ('Pesquisa', 'pesquisa', 'Últimas pesquisas e descobertas'),
  ('Tecnologia', 'tecnologia', 'Inovações na área da saúde')
ON CONFLICT (slug) DO NOTHING;