-- Drop a tabela existente
DROP TABLE IF EXISTS admin_ads;

-- Recria a tabela com a nova estrutura
CREATE TABLE admin_ads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  titulo TEXT NOT NULL,
  cor_titulo TEXT NOT NULL DEFAULT '#00FF00',
  imagens JSONB NOT NULL DEFAULT '[]',
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  divulgado BOOLEAN DEFAULT FALSE
);

-- Adiciona RLS (Row Level Security)
ALTER TABLE admin_ads ENABLE ROW LEVEL SECURITY;

-- Cria políticas de segurança
CREATE POLICY "Permitir leitura pública para anúncios divulgados"
  ON admin_ads FOR SELECT
  USING (divulgado = true);

CREATE POLICY "Permitir acesso total para administradores"
  ON admin_ads FOR ALL
  USING (auth.role() = 'authenticated'); 