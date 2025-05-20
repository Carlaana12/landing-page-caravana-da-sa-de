/*
  # Add Initial Carousel Items

  1. New Data
    - Added initial carousel items for the homepage
    - Each item has title, description, image and proper ordering
    
  2. Content
    - Professional medical images
    - Engaging headlines
    - Clear descriptions
*/

-- Primeiro, vamos dropar a tabela existente se ela existir
DROP TABLE IF EXISTS carousel_items CASCADE;
DROP TABLE IF EXISTS carousel_items_backup CASCADE;

-- Agora criar a tabela principal com a estrutura correta
CREATE TABLE carousel_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar a tabela de backup com a mesma estrutura
CREATE TABLE carousel_items_backup (
  id uuid PRIMARY KEY,
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  backup_date timestamptz DEFAULT now()
);

-- Criar índice para melhorar a performance
CREATE INDEX idx_carousel_display_order ON carousel_items(display_order);
CREATE INDEX idx_carousel_backup_date ON carousel_items_backup(backup_date);

-- Criar trigger para atualizar o updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para fazer backup automático
CREATE OR REPLACE FUNCTION backup_carousel_items()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO carousel_items_backup (
        id, title, description, image_url, display_order, 
        active, created_at, updated_at, backup_date
    )
    VALUES (
        NEW.id, NEW.title, NEW.description, NEW.image_url, 
        NEW.display_order, NEW.active, NEW.created_at, 
        NEW.updated_at, now()
    );
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar os triggers
CREATE TRIGGER update_carousel_items_updated_at
    BEFORE UPDATE ON carousel_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER backup_carousel_items_trigger
    AFTER INSERT OR UPDATE ON carousel_items
    FOR EACH ROW
    EXECUTE FUNCTION backup_carousel_items();

-- Habilitar RLS
ALTER TABLE carousel_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousel_items_backup ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança
CREATE POLICY "Allow public read access" ON carousel_items
    FOR SELECT TO public
    USING (active = true);

CREATE POLICY "Allow admin full access" ON carousel_items
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM admin_users
        WHERE admin_users.user_id = auth.uid()
    ));

-- Políticas para a tabela de backup (apenas admin pode acessar)
CREATE POLICY "Allow admin backup access" ON carousel_items_backup
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM admin_users
        WHERE admin_users.user_id = auth.uid()
    ));

-- Inserir novos itens
INSERT INTO carousel_items (
  title,
  description,
  image_url,
  display_order,
  active
) VALUES 
(
  'Cuidando da Sua Saúde',
  'Encontre os melhores profissionais de saúde para cuidar de você e sua família',
  'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=2000&q=80',
  1,
  true
),
(
  'Especialistas Qualificados',
  'Uma rede completa de médicos e especialistas à sua disposição',
  'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=2000&q=80',
  2,
  true
),
(
  'Tecnologia e Saúde',
  'Utilizando o que há de mais moderno para seu atendimento',
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=2000&q=80',
  3,
  true
),
(
  'Atendimento 24 Horas',
  'Conte com nossa equipe médica disponível 24 horas por dia, 7 dias por semana',
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=2000&q=80',
  4,
  true
);