import { supabase } from './supabase';
import { useAuthStore } from './store';
import { USER_TYPES, UserType } from './constants';
import { PatientRegistration, ProfessionalRegistration } from './types';
import toast from 'react-hot-toast';
import { 
  patientRegistrationSchema, 
  professionalRegistrationSchema,
  emailSchema,
  passwordSchema
} from './validators';
import { z } from 'zod';
import { User } from '@supabase/supabase-js';

// Email autorizado único para admin
const AUTHORIZED_ADMIN_EMAIL = 'ciacomunicacaointegrada@gmail.com'.toLowerCase();

// Constantes
const MAX_LOGIN_ATTEMPTS = 5;
const MAX_PASSWORD_RESET_ATTEMPTS = 3;
const LOCKOUT_TIME_MINUTES = 15;
const PASSWORD_MIN_LENGTH = 8;

// Mensagens de erro
const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Email ou senha incorretos',
  EMAIL_NOT_FOUND: 'Email não encontrado',
  PROFILE_NOT_FOUND: 'Perfil não encontrado',
  WRONG_USER_TYPE: 'Acesso permitido apenas para {type}',
  EMAIL_NOT_VERIFIED: 'Por favor, verifique seu email antes de fazer login',
  TOO_MANY_ATTEMPTS: 'Muitas tentativas. Tente novamente em {minutes} minutos.',
  WEAK_PASSWORD: 'A senha deve ter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais',
  INVALID_DATA: 'Dados inválidos',
  SYSTEM_ERROR: 'Erro no sistema. Tente novamente mais tarde'
};

// Interface para o usuário autenticado
interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  userType: UserType;
}

// Interface para o usuário do Supabase
interface SupabaseUser {
  id: string;
  email: string;
  email_confirmed_at: string | null;
}

// Interface para o estado do usuário
interface UserState {
  id: string;
  email: string;
  userType: UserType;
}

// Funções auxiliares
const isStrongPassword = (password: string): boolean => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return password.length >= PASSWORD_MIN_LENGTH && 
         hasUpperCase && 
         hasLowerCase && 
         hasNumbers && 
         hasSpecialChar;
};

const getLockoutTime = (lastAttempt: string): number => {
  const last = new Date(lastAttempt);
  const now = new Date();
  return Math.ceil((LOCKOUT_TIME_MINUTES * 60 * 1000 - (now.getTime() - last.getTime())) / (60 * 1000));
};

// Funções de controle de tentativas
const incrementAttempts = async (email: string, table: 'login_attempts' | 'password_reset_attempts') => {
  const { data: attempts } = await supabase
    .from(table)
    .select('count')
    .eq('email', email)
    .single();

  await supabase
    .from(table)
    .upsert({
      email,
      count: attempts?.count ? attempts.count + 1 : 1,
      last_attempt: new Date().toISOString()
    });
};

const resetAttempts = async (email: string, table: 'login_attempts' | 'password_reset_attempts') => {
  await supabase
    .from(table)
    .delete()
    .eq('email', email);
};

const checkAttempts = async (email: string, table: 'login_attempts' | 'password_reset_attempts', maxAttempts: number) => {
  const { data: attempts } = await supabase
    .from(table)
    .select('count, last_attempt')
    .eq('email', email)
    .single();

  if (attempts && attempts.count >= maxAttempts) {
    const remainingMinutes = getLockoutTime(attempts.last_attempt);
    if (remainingMinutes > 0) {
      throw new Error(ERROR_MESSAGES.TOO_MANY_ATTEMPTS.replace('{minutes}', remainingMinutes.toString()));
      } else {
      await resetAttempts(email, table);
      }
    }
};

// Logs
const logLoginAttempt = async (userId: string | null, success: boolean, error?: string) => {
  const ip = typeof window !== 'undefined' ? '' : (global as any).req?.ip || '';
  const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : (global as any).req?.headers['user-agent'] || '';

  await supabase
    .from('login_logs')
    .insert({
      user_id: userId,
      success,
      error: error || null,
      timestamp: new Date().toISOString(),
      ip_address: ip,
      user_agent: userAgent
    });
};

// Autenticação do Portal do Paciente
export async function signInPatient(email: string, password: string) {
  try {
    // 1. Validação dos dados
    emailSchema.parse(email);
    passwordSchema.parse(password);

    // 2. Verificar tentativas
    await checkAttempts(email, 'login_attempts', MAX_LOGIN_ATTEMPTS);

    // 3. Autenticação
    const { data: authResponse, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      await incrementAttempts(email, 'login_attempts');
      if (authError.message.includes('Invalid login credentials')) {
        throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }
      throw authError;
    }

    if (!authResponse.user) {
      await incrementAttempts(email, 'login_attempts');
      throw new Error(ERROR_MESSAGES.EMAIL_NOT_FOUND);
    }

    // 4. Verificar perfil e tipo
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', authResponse.user.id)
      .single();

    if (!userProfile) {
      await incrementAttempts(email, 'login_attempts');
      throw new Error(ERROR_MESSAGES.PROFILE_NOT_FOUND);
    }

    if (userProfile.user_type !== USER_TYPES.PATIENT) {
      await incrementAttempts(email, 'login_attempts');
      throw new Error(ERROR_MESSAGES.WRONG_USER_TYPE.replace('{type}', 'pacientes'));
    }

    // 5. Verificar status do email
    if (!authResponse.user.email_confirmed_at) {
      throw new Error(ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
    }

    // 6. Resetar tentativas e logar sucesso
    await resetAttempts(email, 'login_attempts');
    await logLoginAttempt(authResponse.user.id, true);

    // 7. Atualizar estado
    useAuthStore.getState().setUser(authResponse.user);
    useAuthStore.getState().setUserType(USER_TYPES.PATIENT);

    return { ...authResponse, userType: USER_TYPES.PATIENT };
  } catch (error) {
    await logLoginAttempt(null, false, error instanceof Error ? error.message : undefined);
    if (error instanceof z.ZodError) {
      throw new Error(ERROR_MESSAGES.INVALID_DATA);
    }
    throw error;
  }
}

// Cadastro do Portal do Paciente
export async function signUpPatient(data: PatientRegistration) {
  try {
    // Validação dos dados
    const validatedData = patientRegistrationSchema.parse(data);

    // Verificar se CPF já existe na tabela user_profiles (verificação inicial)
    const { data: existingPatient } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('cpf', validatedData.cpf)
      .single();

    if (existingPatient) {
      // Mensagem específica para CPF duplicado
      throw new Error('Este CPF já está cadastrado em nossos perfis.');
    }

    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          full_name: validatedData.fullName,
          user_type: USER_TYPES.PATIENT
        }
      }
    });

    // Tratamento específico para erro de email duplicado do Supabase Auth
    if (authError) {
      if (authError.message.includes('User already registered')) {
        throw new Error('Este e-mail já está registrado para autenticação.');
      }
      // Outros erros de autenticação
      console.error("Erro Supabase Auth signUp (Patient):", authError);
      throw new Error('Erro ao criar o usuário de autenticação.');
    }
    if (!authData.user) {
      throw new Error('Erro interno: usuário não retornado após cadastro de autenticação.');
    }

    // Criar perfil do paciente
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        user_id: authData.user.id,
        email: validatedData.email,
        full_name: validatedData.fullName,
        cpf: validatedData.cpf,
        phone: validatedData.phone,
        birth_date: validatedData.birthDate,
        email_verified: false
      });

    // Tratamento específico para erros de inserção no perfil (ex: duplicação)
    if (profileError) {
      console.error("Erro ao criar user_profile (Patient):", profileError);
      // Verificar violação de restrição única (PostgreSQL code 23505)
      if (profileError.code === '23505') {
        if (profileError.message.includes('user_profiles_cpf_key')) { // Ajuste o nome da constraint se for diferente
          throw new Error('Erro: O CPF informado já existe em um perfil.');
        } else if (profileError.message.includes('user_profiles_email_key')) { // Ajuste o nome da constraint se for diferente
          throw new Error('Erro: O Email informado já existe em um perfil.');
        }
        // Outra violação única?
        throw new Error('Erro: Já existe um perfil com um dos dados informados (CPF, Email ou outro campo único).');
      }
      // Outro erro de banco ao inserir perfil
      throw new Error('Erro ao salvar os dados do perfil do paciente.');
    }

    // Criar configurações do usuário
    const { error: settingsError } = await supabase
      .from('user_settings')
      .insert({
        user_id: authData.user.id,
        email_notifications: true,
        sms_notifications: true,
        appointment_reminders: true,
        newsletter_subscription: true
      });

    if (settingsError) {
       // Idealmente, deletar user auth e profile aqui
      console.error("Erro ao criar user_settings (Patient):", settingsError);
      throw new Error('Erro ao salvar as configurações do usuário.');
    }

    return authData;
  } catch (error) {
    // Captura erros de validação Zod e outros erros lançados nos blocos try
    if (error instanceof z.ZodError) {
      // Retorna a primeira mensagem de erro de validação
      throw new Error(error.errors[0].message);
    }
    // Relança outros erros (incluindo os específicos que criamos)
    throw error;
  }
}

// Cadastro do Portal do Profissional (Com tratamento de erro melhorado)
export async function signUpProfessional(data: ProfessionalRegistration) {
  let authData: { user: User | null; session: any } | null = null; // Declarar fora para possível limpeza
  try {
    // 1. Validação inicial dos dados Zod
    const validatedData = professionalRegistrationSchema.parse(data);

    // Verificar se CPF já existe na tabela partner_profiles
    const { data: existingProfessional } = await supabase
      .from('partner_profiles')
      .select('id')
      .eq('cpf', validatedData.cpf)
      .single();

    if (existingProfessional) {
      throw new Error('Este CPF já está cadastrado em nossos perfis de profissionais.');
    }

    // 2. Operações com Supabase
    try {
      // Criar usuário no Supabase Auth
      const { data: signUpData, error: authError } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
      options: {
        data: {
            full_name: validatedData.fullName,
            user_type: USER_TYPES.SPECIALIST
          }
        }
      });

      // Tratamento específico para erro de email duplicado do Auth
      if (authError) {
        if (authError.message.includes('User already registered')) {
          throw new Error('Este e-mail já está registrado para autenticação.');
        }
        // Outros erros do signUp
        console.error("Erro Supabase Auth signUp (Professional):", authError);
        throw new Error('Erro ao criar o usuário de autenticação.');
      }
      if (!signUpData?.user) {
          throw new Error('Auth user not returned after signup');
      }
      const userId = signUpData.user.id;
      authData = signUpData; // Guarda os dados para possível limpeza

      // Criar perfil do profissional
      const { error: profileError } = await supabase
        .from('partner_profiles')
        .insert({
          user_id: userId,
          name: validatedData.fullName,
          email: validatedData.email,
          cpf: validatedData.cpf,
          phone: validatedData.phone,
          registration_type: validatedData.registrationType,
          registration_number: validatedData.registrationNumber,
          registration_state: validatedData.registrationState,
          specialty: validatedData.specialty,
          location: validatedData.location,
          document_url: validatedData.documentUrl,
          terms_accepted: validatedData.termsAccepted,
          email_verified: false,
          verification_status: 'pending'
        });

      // Se insert no perfil falhou
      if (profileError) {
        console.error("Erro ao criar partner_profile:", profileError);
        // Lança erro específico ou mais genérico
        if (profileError.code === '23503') { // Nosso erro persistente de FK
             throw new Error('Erro de configuração ao vincular perfil ao usuário.');
        } else if (profileError.code === '23505') { // Erro de duplicidade no perfil
             throw new Error('Erro: Dados duplicados no perfil (Email, Registro, etc.).');
        }
        throw new Error('Erro ao salvar os dados do perfil do profissional.');
      }

      // Criar registro de parceiro
    const { error: partnerError } = await supabase
      .from('partner_users')
        .insert({
          user_id: userId, // Usa a variável userId
        role: 'partner'
        });

      // Se insert no partner_users falhou
      if (partnerError) {
        console.error("Erro ao criar partner_users:", partnerError);
         // Lança erro específico ou mais genérico
        if (partnerError.code === '23503') { // FK
             throw new Error('Erro de configuração ao associar usuário como parceiro.');
        } else if (partnerError.code === '23505') { // Duplicidade
             throw new Error('Erro: Usuário já associado como parceiro.');
        }
        throw new Error('Erro ao associar o usuário como parceiro.');
      }

      // Se chegou aqui, tudo deu certo
    return authData;

    } catch (internalError) {
      // Captura erros lançados pelos blocos acima (Auth, Profile, Partner)
      console.error("Erro interno no processo de signUpProfessional:", internalError); // Loga o erro real

      // ** Limpeza Opcional **
      // Se o usuário Auth foi criado mas algo depois falhou, podemos tentar deletá-lo
      // if (authData?.user && internalError.message !== 'Este e-mail já está registrado para autenticação.') {
      //   console.warn(`Tentando deletar usuário órfão ${authData.user.id} devido a erro subsequente.`);
      //   // Chamada admin para deletar usuário (requer service_key, idealmente em API separada)
      //   // await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      // }

      // Relança o erro (seja específico ou genérico do bloco try)
      throw internalError;
    }

  } catch (error) {
    // Captura erro de validação Zod ou erros relançados do bloco interno
    if (error instanceof z.ZodError) {
      // Mantém mensagem específica para erro de validação Zod
      throw new Error(error.errors[0].message);
    }
    // Relança o erro para o frontend tratar
    throw error;
  }
}

// Autenticação do Portal do Profissional
export async function signInProfessional(email: string, password: string) {
  try {
    // 1. Validação dos dados
    emailSchema.parse(email);
    passwordSchema.parse(password);

    // 2. Verificar tentativas
    await checkAttempts(email, 'login_attempts', MAX_LOGIN_ATTEMPTS);

    // 3. Autenticação
    const { data: authResponse, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      await incrementAttempts(email, 'login_attempts');
      if (authError.message.includes('Invalid login credentials')) {
        throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }
      throw authError;
    }

    if (!authResponse.user) {
      await incrementAttempts(email, 'login_attempts');
      throw new Error(ERROR_MESSAGES.EMAIL_NOT_FOUND);
    }

    // 4. Verificar perfil e tipo
    const { data: userProfile } = await supabase
      .from('partner_profiles')
      .select('*')
      .eq('user_id', authResponse.user.id)
      .single();

    if (!userProfile) {
      await incrementAttempts(email, 'login_attempts');
      throw new Error(ERROR_MESSAGES.PROFILE_NOT_FOUND);
    }

    // 5. Verificar status do email
    if (!authResponse.user.email_confirmed_at) {
      throw new Error(ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
    }

    // 6. Resetar tentativas e logar sucesso
    await resetAttempts(email, 'login_attempts');
    await logLoginAttempt(authResponse.user.id, true);

    // 7. Atualizar estado
    useAuthStore.getState().setUser(authResponse.user);
    useAuthStore.getState().setUserType(USER_TYPES.SPECIALIST);

    return { ...authResponse, userType: USER_TYPES.SPECIALIST };
  } catch (error) {
    await logLoginAttempt(null, false, error instanceof Error ? error.message : undefined);
    if (error instanceof z.ZodError) {
      throw new Error(ERROR_MESSAGES.INVALID_DATA);
    }
    throw error;
  }
}

// Recuperação de Senha do Paciente
export async function resetPasswordPatient(email: string) {
  try {
    // 1. Validação do email
    emailSchema.parse(email);

    // 2. Verificar tentativas
    await checkAttempts(email, 'password_reset_attempts', MAX_PASSWORD_RESET_ATTEMPTS);

    // 3. Registrar tentativa
    await incrementAttempts(email, 'password_reset_attempts');

    // 4. Enviar email de recuperação
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/usuario/reset-password`,
    });

    if (error) {
      if (error.message.includes('User not found')) {
        throw new Error(ERROR_MESSAGES.EMAIL_NOT_FOUND);
      }
      throw error;
    }

    return { success: true, message: 'Email de recuperação enviado com sucesso' };
  } catch (error) {
    console.error('Erro ao enviar email de recuperação:', error);
    throw error;
  }
}

// Recuperação de Senha do Profissional
export async function resetPasswordProfessional(email: string) {
  try {
    // 1. Validação do email
    emailSchema.parse(email);

    // 2. Verificar tentativas
    await checkAttempts(email, 'password_reset_attempts', MAX_PASSWORD_RESET_ATTEMPTS);

    // 3. Registrar tentativa
    await incrementAttempts(email, 'password_reset_attempts');

    // 4. Enviar email de recuperação
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/especialista/reset-password`,
    });

    if (error) {
      if (error.message.includes('User not found')) {
        throw new Error(ERROR_MESSAGES.EMAIL_NOT_FOUND);
      }
      throw error;
    }

    return { success: true, message: 'Email de recuperação enviado com sucesso' };
  } catch (error) {
    console.error('Erro ao enviar email de recuperação:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    useAuthStore.getState().setUser(null);
    useAuthStore.getState().setUserType(null);
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
}

export function useAuth() {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      useAuthStore.getState().setUser(session.user);
    } else if (event === 'SIGNED_OUT') {
      useAuthStore.getState().setUser(null);
      useAuthStore.getState().setUserType(null);
    }
  });
}

// Função para buscar todos os pacientes
export async function getAllPatients() {
  try {
    console.log('=== BUSCANDO TODOS OS PACIENTES ===');
    
    const { data: patients, error } = await supabase
      .from('user_profiles')
      .select(`
        *,
        user_settings (
          email_notifications,
          sms_notifications,
          appointment_reminders
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar pacientes:', error);
      throw error;
    }

    console.log(`Encontrados ${patients.length} pacientes`);
    return patients;
  } catch (error) {
    console.error('Erro na busca de pacientes:', error);
    throw error;
  }
}

// Adicionar usuário de teste
const addTestUser = async () => {
  try {
    const { data: user } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', 'ciacomunicacaointegrada@gmail.com')
      .single();

    if (user) {
      await supabase
        .from('partner_profiles')
        .insert({
          user_id: user.id,
          name: 'CIA Comunicação Integrada',
          email: 'ciacomunicacaointegrada@gmail.com',
          phone: '(99) 99999-9999',
          registration_type: 'OUTRO',
          registration_number: '000000',
          registration_state: 'SP',
          specialty: 'Administração',
          location: 'São Paulo',
          document_url: '',
          terms_accepted: true,
          email_verified: true,
          verification_status: 'approved'
        });
    }
  } catch (error) {
    console.error('Erro ao adicionar usuário de teste:', error);
  }
};

// Autenticação do Admin
export async function signInAdmin(email: string, password: string) {
  try {
    // 1. Validação dos dados
    emailSchema.parse(email);
    passwordSchema.parse(password);

    // 2. Verificar tentativas
    await checkAttempts(email, 'login_attempts', MAX_LOGIN_ATTEMPTS);

    // 3. Verificar email autorizado
    if (email.toLowerCase() !== AUTHORIZED_ADMIN_EMAIL) {
      await incrementAttempts(email, 'login_attempts');
      throw new Error(ERROR_MESSAGES.WRONG_USER_TYPE.replace('{type}', 'administradores'));
    }

    // 4. Autenticação
    const { data: authResponse, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      await incrementAttempts(email, 'login_attempts');
      if (authError.message.includes('Invalid login credentials')) {
        throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }
      throw authError;
    }

    if (!authResponse.user) {
      await incrementAttempts(email, 'login_attempts');
      throw new Error(ERROR_MESSAGES.EMAIL_NOT_FOUND);
    }

    // 5. Verificar status do email
    if (!authResponse.user.email_confirmed_at) {
      throw new Error(ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
    }

    // 6. Resetar tentativas e logar sucesso
    await resetAttempts(email, 'login_attempts');
    await logLoginAttempt(authResponse.user.id, true);

    // 7. Atualizar estado
    useAuthStore.getState().setUser(authResponse.user);
    useAuthStore.getState().setUserType(USER_TYPES.ADMIN);

    return { ...authResponse, userType: USER_TYPES.ADMIN };
  } catch (error) {
    console.error('Erro de login admin:', error);
    await logLoginAttempt(null, false, error instanceof Error ? error.message : undefined);
    if (error instanceof z.ZodError) { // Adicionado para consistência
      throw new Error(ERROR_MESSAGES.INVALID_DATA);
    }
    throw error;
  }
}