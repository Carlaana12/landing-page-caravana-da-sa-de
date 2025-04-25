-- Resetar senhas dos usuários admin
UPDATE auth.users
SET encrypted_password = crypt('Ciacomunica@12', gen_salt('bf'))
WHERE email IN (
  'carla.accp64@gmail.com',
  'cia.comunicacaointegrada@gmail.com'
);

-- Criar usuários admin usando a função auth.admin_create_user
SELECT auth.admin_create_user(
  'carla.accp64@gmail.com',
  'Ciacomunica@12',
  '{"name": "Carla ACCP", "role": "admin"}',
  true
);

SELECT auth.admin_create_user(
  'cia.comunicacaointegrada@gmail.com',
  'Ciacomunica@12',
  '{"name": "CIA Comunicação", "role": "admin"}',
  true
); 