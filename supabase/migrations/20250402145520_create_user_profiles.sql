/*
  # Adicionar Política de Inserção para user_settings

  1. Alterações
    - Adicionar política para permitir inserção de configurações
    - Manter políticas existentes
*/

-- Habilitar RLS nas tabelas
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can create profile" ON user_profiles;
DROP POLICY IF EXISTS "Specialists can view own profile" ON partner_profiles;
DROP POLICY IF EXISTS "Specialists can update own profile" ON partner_profiles;
DROP POLICY IF EXISTS "Specialists can create profile" ON partner_profiles;
DROP POLICY IF EXISTS "Users can manage own settings" ON user_settings;

-- Criar novas políticas para user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can create profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Criar novas políticas para partner_profiles
CREATE POLICY "Specialists can view own profile"
  ON partner_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Specialists can update own profile"
  ON partner_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Specialists can create profile"
  ON partner_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Criar políticas para user_settings
CREATE POLICY "Users can manage own settings"
  ON user_settings
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Adicionar política para permitir criação de configurações durante o cadastro
CREATE POLICY "Allow settings creation during signup"
  ON user_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true); 