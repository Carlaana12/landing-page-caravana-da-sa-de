/*
  # Configuração Final dos Destaques

  1. Changes
    - Configuração única e definitiva para highlights
    - Políticas de acesso simplificadas
    - Trigger para updated_at
    
  2. Security
    - RLS habilitado
    - Acesso público para leitura
    - Acesso admin para todas operações
*/

-- Garantir que RLS está habilitado
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes
DROP POLICY IF EXISTS "highlights_public_read_policy" ON highlights;
DROP POLICY IF EXISTS "highlights_admin_full_policy" ON highlights;

-- Criar políticas simplificadas
CREATE POLICY "highlights_public_read_policy"
ON highlights
FOR SELECT
TO public
USING (true);

CREATE POLICY "highlights_admin_full_policy"
ON highlights
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
  )
);

-- Atualizar trigger para updated_at
CREATE OR REPLACE FUNCTION update_highlights_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recriar trigger
DROP TRIGGER IF EXISTS update_highlights_updated_at ON highlights;
CREATE TRIGGER update_highlights_updated_at
  BEFORE UPDATE ON highlights
  FOR EACH ROW
  EXECUTE FUNCTION update_highlights_updated_at();