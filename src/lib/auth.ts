import { supabase } from './supabase';
import { useAuthStore } from './store';
import { USER_TYPES, UserType } from './constants';
import { PatientRegistration, ProfessionalRegistration } from './types';
import toast from 'react-hot-toast';

// Email autorizado único para admin
const AUTHORIZED_ADMIN_EMAIL = 'ciacomunicacaointegrada@gmail.com'.toLowerCase();

// Função para validar força da senha
function isStrongPassword(password: string): boolean {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return password.length >= minLength && 
         hasUpperCase && 
         hasLowerCase && 
         hasNumbers && 
         hasSpecialChar;
}

// Função para limitar tentativas de login
const loginAttempts = new Map<string, { count: number, lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos

function checkLoginAttempts(email: string): boolean {
  const now = Date.now();
  const attempts = loginAttempts.get(email);

  if (attempts) {
    if (attempts.count >= MAX_ATTEMPTS) {
      const timeSinceLastAttempt = now - attempts.lastAttempt;
      if (timeSinceLastAttempt < LOCKOUT_TIME) {
        const remainingTime = Math.ceil((LOCKOUT_TIME - timeSinceLastAttempt) / 60000);
        throw new Error(`Conta temporariamente bloqueada. Tente novamente em ${remainingTime} minutos.`);
      } else {
        loginAttempts.delete(email);
      }
    }
  }
  return true;
}

function recordLoginAttempt(email: string) {
  const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
  loginAttempts.set(email, {
    count: attempts.count + 1,
    lastAttempt: Date.now()
  });
}

function resetLoginAttempts(email: string) {
  loginAttempts.delete(email);
}

// Autenticação do Portal do Paciente
export async function signInPatient(email: string, password: string) {
  try {
    checkLoginAttempts(email);

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (authError) {
      recordLoginAttempt(email);
      throw authError;
    }

    if (!authData.user) {
      recordLoginAttempt(email);
      throw new Error('Dados do usuário não retornados');
    }

    // Verificar se é um paciente
    const { data: userData, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', authData.user.id)
      .maybeSingle();

    if (userError) {
      throw new Error('Erro ao verificar perfil de paciente');
    }

    if (!userData) {
      throw new Error('Usuário não encontrado no portal do paciente');
    }

    // Verificar se o email foi verificado
    if (!userData.email_verified) {
      throw new Error('Por favor, verifique seu email antes de fazer login');
    }

    useAuthStore.getState().setUser(authData.user);
    useAuthStore.getState().setUserType(USER_TYPES.USER);
    resetLoginAttempts(email);

    return authData;
  } catch (error) {
    console.error('Erro de login:', error);
    throw error;
  }
}

// Cadastro do Portal do Paciente
export async function signUpPatient(data: PatientRegistration) {
  try {
    if (!isStrongPassword(data.password)) {
      throw new Error('A senha deve ter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais.');
    }

    if (!data.termsAccepted) {
      throw new Error('Você precisa aceitar os termos de uso para continuar.');
    }

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email.trim().toLowerCase(),
      password: data.password,
      options: {
        data: {
          full_name: data.fullName
        }
      }
    });

    if (signUpError) throw signUpError;
    if (!authData.user) throw new Error('Erro ao criar usuário');

    // Criar perfil de paciente
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert([{
        user_id: authData.user.id,
        full_name: data.fullName,
        phone: data.phone,
        birth_date: data.birthDate,
        terms_accepted: data.termsAccepted,
        terms_accepted_at: new Date().toISOString()
      }]);

    if (profileError) throw profileError;

    // Criar configurações do paciente
    const { error: settingsError } = await supabase
      .from('user_settings')
      .insert([{
        user_id: authData.user.id
      }]);

    if (settingsError) throw settingsError;

    return authData;
  } catch (error) {
    console.error('Erro ao criar conta de paciente:', error);
    throw error;
  }
}

// Autenticação do Portal do Profissional
export async function signInProfessional(email: string, password: string) {
  try {
    checkLoginAttempts(email);

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (authError) {
      recordLoginAttempt(email);
      throw authError;
    }

    if (!authData.user) {
      recordLoginAttempt(email);
      throw new Error('Dados do usuário não retornados');
    }

    // Verificar se é um profissional
    const { data: specialistData, error: specialistError } = await supabase
      .from('partner_profiles')
      .select('*')
      .eq('user_id', authData.user.id)
      .maybeSingle();

    if (specialistError) {
      throw new Error('Erro ao verificar credenciais de profissional');
    }

    if (!specialistData) {
      throw new Error('Usuário não encontrado no portal do profissional');
    }

    // Verificar se o email foi verificado
    if (!specialistData.email_verified) {
      throw new Error('Por favor, verifique seu email antes de fazer login');
    }

    // Verificar se a conta foi aprovada
    if (specialistData.verification_status === 'pending') {
      throw new Error('Sua conta está em análise. Aguarde a aprovação para fazer login.');
    }

    if (specialistData.verification_status === 'rejected') {
      throw new Error('Sua conta não foi aprovada. Entre em contato com o suporte.');
    }

    useAuthStore.getState().setUser(authData.user);
    useAuthStore.getState().setUserType(USER_TYPES.SPECIALIST);
    resetLoginAttempts(email);

    return authData;
  } catch (error) {
    console.error('Erro de login:', error);
    throw error;
  }
}

// Cadastro do Portal do Profissional
export async function signUpProfessional(data: ProfessionalRegistration) {
  try {
    if (!isStrongPassword(data.password)) {
      throw new Error('A senha deve ter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais.');
    }

    if (!data.termsAccepted) {
      throw new Error('Você precisa aceitar os termos de uso para continuar.');
    }

    if (!data.documentUrl) {
      throw new Error('É necessário enviar um documento de comprovação profissional.');
    }

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email.trim().toLowerCase(),
      password: data.password,
      options: {
        data: {
          full_name: data.fullName
        }
      }
    });

    if (signUpError) throw signUpError;
    if (!authData.user) throw new Error('Erro ao criar usuário');

    // Criar registro de profissional
    const { error: partnerError } = await supabase
      .from('partner_users')
      .insert([{
        user_id: authData.user.id,
        role: 'partner'
      }]);

    if (partnerError) throw partnerError;

    // Criar perfil de profissional
    const { error: profileError } = await supabase
      .from('partner_profiles')
      .insert([{
        user_id: authData.user.id,
        full_name: data.fullName,
        phone: data.phone,
        registration_type: data.registrationType,
        registration_number: data.registrationNumber,
        registration_state: data.registrationState,
        registration_expiry: data.registrationExpiry,
        specialty: data.specialty,
        location: data.location,
        document_url: data.documentUrl,
        terms_accepted: data.termsAccepted,
        terms_accepted_at: new Date().toISOString(),
        verification_status: 'pending'
      }]);

    if (profileError) throw profileError;

    return authData;
  } catch (error) {
    console.error('Erro ao criar conta de profissional:', error);
    throw error;
  }
}

// Autenticação do Admin
export async function signInAdmin(email: string, password: string) {
  try {
    checkLoginAttempts(email);

    if (email.toLowerCase() !== AUTHORIZED_ADMIN_EMAIL) {
      throw new Error('Acesso não autorizado');
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (authError) {
      recordLoginAttempt(email);
      throw authError;
    }

    if (!authData.user) {
      recordLoginAttempt(email);
      throw new Error('Dados do usuário não retornados');
    }

    const { data: adminData } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();

    if (!adminData) {
      throw new Error('Usuário não é administrador');
    }

    useAuthStore.getState().setUser(authData.user);
    useAuthStore.getState().setUserType(USER_TYPES.ADMIN);
    resetLoginAttempts(email);

    return authData;
  } catch (error) {
    console.error('Erro de login:', error);
    throw error;
  }
}

// Recuperação de senha
export async function resetPasswordPatient(email: string) {
  try {
    // Verificar se é um paciente
    const { data: user } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (!user) {
      throw new Error('Email não encontrado no portal do paciente');
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/usuario/reset-password`,
    });

    if (error) throw error;
  } catch (error) {
    console.error('Erro ao enviar email de recuperação:', error);
    throw error;
  }
}

export async function resetPasswordProfessional(email: string) {
  try {
    // Verificar se é um profissional
    const { data: partner } = await supabase
      .from('partner_profiles')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (!partner) {
      throw new Error('Email não encontrado no portal do profissional');
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/especialista/reset-password`,
    });

    if (error) throw error;
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