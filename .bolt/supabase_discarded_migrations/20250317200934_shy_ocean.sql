/*
  # Criar Usuários Iniciais

  1. Usuários
    - Admin: Ciacomunicaointegrada@gmail.com
    - Parceiro: Ciacomunicacaointegrada@gmail.com

  2. Alterações
    - Criação de função para adicionar usuário admin
    - Criação de função para adicionar usuário parceiro
    - Execução das funções
    - Limpeza das funções após uso

  3. Segurança
    - Senhas criptografadas usando bcrypt
    - Permissões apropriadas configuradas
*/

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS add_first_admin();
DROP FUNCTION IF EXISTS add_first_partner();

-- Função para criar usuário admin
CREATE FUNCTION add_first_admin()
RETURNS void AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Criar usuário no auth.users
  INSERT INTO auth.users (
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role
  )
  VALUES (
    'Ciacomunicaointegrada@gmail.com',
    crypt('Ciacomunica@12', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Admin CIA"}',
    'authenticated',
    'authenticated'
  )
  RETURNING id INTO new_user_id;

  -- Adicionar à tabela admin_users
  INSERT INTO admin_users (user_id, role)
  VALUES (new_user_id, 'admin');
END;
$$ LANGUAGE plpgsql;

-- Função para criar usuário parceiro
CREATE FUNCTION add_first_partner()
RETURNS void AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Criar usuário no auth.users
  INSERT INTO auth.users (
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role
  )
  VALUES (
    'Ciacomunicacaointegrada@gmail.com',
    crypt('Ciacomunica@12', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Parceiro CIA"}',
    'authenticated',
    'authenticated'
  )
  RETURNING id INTO new_user_id;

  -- Adicionar à tabela partner_users
  INSERT INTO partner_users (user_id, role)
  VALUES (new_user_id, 'partner');

  -- Criar perfil inicial do parceiro
  INSERT INTO partner_profiles (
    user_id,
    name,
    email
  )
  VALUES (
    new_user_id,
    'Parceiro CIA',
    'Ciacomunicacaointegrada@gmail.com'
  );
END;
$$ LANGUAGE plpgsql;

-- Criar usuários
SELECT add_first_admin();
SELECT add_first_partner();

-- Limpar funções
DROP FUNCTION IF EXISTS add_first_admin();
DROP FUNCTION IF EXISTS add_first_partner();