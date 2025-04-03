/*
  # Correção Final das Políticas de Admin

  1. Alterações
    - Remoção completa de todas as funções e triggers antigos
    - Recriação da estrutura com verificações aprimoradas
    - Simplificação das políticas de RLS
    - Normalização do email para comparação case-insensitive

  2. Segurança
    - Política única e abrangente
    - Verificações de email normalizadas
    - Trigger com SECURITY DEFINER
*/

-- Remover todas as funções e triggers existentes
DROP TRIGGER IF EXISTS first_admin_trigger ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS add_first_admin();

-- Garantir que a tabela admin_users existe com a estrutura correta
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Recriar função com verificações melhoradas
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  IF lower(NEW.email) = 'ciacomunicacaointegrada@gmail.com' THEN
    INSERT INTO public.admin_users (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Recriar trigger com novo nome
CREATE TRIGGER handle_new_user_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Reconfigurar RLS
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Remover todas as políticas existentes
DROP POLICY IF EXISTS "admin_users_policy" ON admin_users;
DROP POLICY IF EXISTS "admin_users_select_policy" ON admin_users;
DROP POLICY IF EXISTS "admin_users_insert_policy" ON admin_users;
DROP POLICY IF EXISTS "admin_users_update_policy" ON admin_users;
DROP POLICY IF EXISTS "admin_users_delete_policy" ON admin_users;
DROP POLICY IF EXISTS "Acesso admin_users para admins" ON admin_users;
DROP POLICY IF EXISTS "enable_admin_access" ON admin_users;

-- Criar política única e simplificada
CREATE POLICY "admin_access_policy"
ON admin_users
FOR ALL
TO authenticated
USING (
  lower(auth.email()) = 'ciacomunicacaointegrada@gmail.com'
  OR EXISTS (
    SELECT 1 FROM admin_users au 
    WHERE au.user_id = auth.uid()
  )
)
WITH CHECK (
  lower(auth.email()) = 'ciacomunicacaointegrada@gmail.com'
  OR EXISTS (
    SELECT 1 FROM admin_users au 
    WHERE au.user_id = auth.uid()
  )
);