import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';
import { professionalRegistrationSchema } from '../../lib/validators'; // Caminho ajustado
import { Database } from '../../lib/database.types'; // Caminho ajustado
import { USER_TYPES } from '../../lib/constants'; // Caminho ajustado
import { z } from 'zod';

// É ESSENCIAL que estas variáveis de ambiente estejam configuradas no seu backend
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('!!! Variáveis de ambiente Supabase não configuradas no backend !!!');
  // Não lance um erro aqui para permitir que o servidor inicie,
  // mas registre o erro claramente. A função falhará se não forem definidas.
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  // Garante que as variáveis foram carregadas antes de criar o cliente
  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ message: 'Configuração do servidor incompleta.' });
  }

  // Crie um cliente Supabase específico para o backend usando a chave de serviço
  // Este cliente IGNORARÁ as políticas RLS por padrão, a menos que você as force
  // Mas, como temos uma política para service_role, ele será autorizado por ela.
  const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey);

  try {
    // 1. Validação dos dados recebidos no corpo da requisição
    const validatedData = professionalRegistrationSchema.parse(req.body);

    // 2. Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          full_name: validatedData.fullName,
          user_type: USER_TYPES.SPECIALIST
        },
        // Opcional: Enviar email de confirmação automaticamente
        // emailRedirectTo: `${req.headers.origin}/login` // Ou outra página
      }
    });

    // Tratamento de erros do signUp
    if (authError) {
        // Verificar se o erro é de usuário já existente
        if (authError.message.includes('User already registered')) {
            return res.status(409).json({ message: 'Este e-mail já está cadastrado.' });
        }
         // Outros erros de autenticação
        console.error('Erro Supabase Auth signUp:', authError);
        return res.status(400).json({ message: authError.message || 'Erro ao criar usuário de autenticação.' });
    }
    if (!authData.user) {
      console.error('Erro: Usuário não retornado após signUp.');
      return res.status(500).json({ message: 'Erro interno ao criar usuário.' });
    }

    const userId = authData.user.id;

    // 3. Criar perfil do profissional em partner_profiles
    const { error: profileError } = await supabaseAdmin
      .from('partner_profiles')
      .insert({
        user_id: userId,
        name: validatedData.fullName,
        email: validatedData.email,
        phone: validatedData.phone,
        registration_type: validatedData.registrationType,
        registration_number: validatedData.registrationNumber,
        registration_state: validatedData.registrationState,
        specialty: validatedData.specialty,
        location: validatedData.location,
        document_url: validatedData.documentUrl,
        terms_accepted: validatedData.termsAccepted,
        email_verified: false, // Começa como não verificado
        verification_status: 'pending' // Status inicial
      });

    if (profileError) {
        console.error('Erro ao criar perfil do parceiro:', profileError);
        // Idealmente, deveríamos tentar deletar o usuário auth recém-criado aqui
        // para evitar usuários órfãos, mas isso adiciona complexidade.
        // Por agora, apenas retornamos o erro.
        return res.status(500).json({ message: 'Erro ao salvar perfil do profissional.' });
    }

    // 4. Criar registro em partner_users (ESTA É A PARTE QUE ESTAVA FALHANDO)
    // Agora, como estamos usando supabaseAdmin (com service_role),
    // a política RLS que permite INSERT para service_role deve ser aplicada.
    const { error: partnerError } = await supabaseAdmin
      .from('partner_users')
      .insert({
        user_id: userId,
        role: 'partner' // Ou o valor apropriado para a role
      });

    if (partnerError) {
      console.error('Erro ao criar registro partner_users:', partnerError);
       // Novamente, idealmente deletar user auth e profile
      return res.status(500).json({ message: 'Erro ao associar perfil de parceiro.' });
    }

    // 5. Sucesso
    // Não retorne o objeto authData completo, especialmente se contiver tokens.
    // Retorne apenas o necessário ou uma mensagem de sucesso.
    return res.status(201).json({ message: 'Usuário profissional criado com sucesso! Verifique seu e-mail.' });

  } catch (error) {
    // Tratar erros de validação Zod
    if (error instanceof z.ZodError) {
      console.error('Erro de validação Zod:', error.errors);
      return res.status(400).json({ message: 'Dados inválidos.', errors: error.errors });
    }
    // Outros erros inesperados
    console.error('Erro inesperado no signup-professional:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
} 