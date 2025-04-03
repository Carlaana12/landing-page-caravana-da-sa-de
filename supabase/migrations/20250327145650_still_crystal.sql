/*
  # Add Default Categories and Tags

  1. New Data
    - Default categories for pages
    - Default tags for pages
    - Proper slugs and descriptions
    
  2. Security
    - Safe insertion with conflict handling
*/

-- Insert default categories
INSERT INTO page_categories (name, slug, description)
VALUES 
  ('Saúde', 'saude', 'Artigos sobre saúde em geral'),
  ('Bem-estar', 'bem-estar', 'Conteúdo sobre bem-estar e qualidade de vida'),
  ('Medicina', 'medicina', 'Informações médicas e tratamentos'),
  ('Nutrição', 'nutricao', 'Artigos sobre alimentação saudável'),
  ('Exercícios', 'exercicios', 'Conteúdo sobre atividade física'),
  ('Mental', 'saude-mental', 'Artigos sobre saúde mental'),
  ('Prevenção', 'prevencao', 'Informações sobre prevenção de doenças'),
  ('Tratamentos', 'tratamentos', 'Detalhes sobre diferentes tratamentos'),
  ('Notícias', 'noticias', 'Últimas notícias da área da saúde'),
  ('Eventos', 'eventos', 'Eventos e congressos da área médica')
ON CONFLICT (slug) DO NOTHING;

-- Insert default tags
INSERT INTO page_tags (name, slug)
VALUES 
  ('COVID-19', 'covid-19'),
  ('Diabetes', 'diabetes'),
  ('Hipertensão', 'hipertensao'),
  ('Obesidade', 'obesidade'),
  ('Estresse', 'estresse'),
  ('Ansiedade', 'ansiedade'),
  ('Depressão', 'depressao'),
  ('Exercícios', 'exercicios'),
  ('Alimentação', 'alimentacao'),
  ('Sono', 'sono'),
  ('Medicina Preventiva', 'medicina-preventiva'),
  ('Tecnologia', 'tecnologia'),
  ('Pesquisa', 'pesquisa'),
  ('Tratamento', 'tratamento'),
  ('Diagnóstico', 'diagnostico'),
  ('Medicamentos', 'medicamentos'),
  ('Vacinas', 'vacinas'),
  ('Saúde Pública', 'saude-publica'),
  ('Especialidades', 'especialidades'),
  ('Emergência', 'emergencia')
ON CONFLICT (slug) DO NOTHING;

-- Assign categories and tags to existing pages
DO $$
DECLARE
  page_id uuid;
  category_id uuid;
  tag_id uuid;
BEGIN
  -- Get home page
  SELECT id INTO page_id FROM site_pages WHERE slug = 'home' LIMIT 1;
  IF FOUND THEN
    -- Get category IDs
    SELECT id INTO category_id FROM page_categories WHERE slug = 'saude' LIMIT 1;
    IF FOUND THEN
      INSERT INTO page_category_assignments (page_id, category_id)
      VALUES (page_id, category_id)
      ON CONFLICT DO NOTHING;
    END IF;

    -- Get tag IDs
    SELECT id INTO tag_id FROM page_tags WHERE slug = 'saude-publica' LIMIT 1;
    IF FOUND THEN
      INSERT INTO page_tag_assignments (page_id, tag_id)
      VALUES (page_id, tag_id)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  -- Get about page
  SELECT id INTO page_id FROM site_pages WHERE slug = 'sobre' LIMIT 1;
  IF FOUND THEN
    -- Get category IDs
    SELECT id INTO category_id FROM page_categories WHERE slug = 'saude' LIMIT 1;
    IF FOUND THEN
      INSERT INTO page_category_assignments (page_id, category_id)
      VALUES (page_id, category_id)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  -- Get contact page
  SELECT id INTO page_id FROM site_pages WHERE slug = 'contato' LIMIT 1;
  IF FOUND THEN
    -- Get category IDs
    SELECT id INTO category_id FROM page_categories WHERE slug = 'saude' LIMIT 1;
    IF FOUND THEN
      INSERT INTO page_category_assignments (page_id, category_id)
      VALUES (page_id, category_id)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
END $$;