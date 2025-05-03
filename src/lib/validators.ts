import { z } from 'zod';

// Validação de CPF
export const cpfSchema = z.string()
  .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato 000.000.000-00')
  .refine((cpf) => {
    // Remove pontos e hífen
    const cpfNumbers = cpf.replace(/[^\d]/g, '');
    const cpfArray = cpfNumbers.split('').map(Number);
    const dv1 = cpfArray[9];
    const dv2 = cpfArray[10];
    
    // Cálculo do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += cpfArray[i] * (10 - i);
    }
    let rest = sum % 11;
    const calculatedDv1 = rest < 2 ? 0 : 11 - rest;
    
    // Cálculo do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += cpfArray[i] * (11 - i);
    }
    rest = sum % 11;
    const calculatedDv2 = rest < 2 ? 0 : 11 - rest;
    
    return calculatedDv1 === dv1 && calculatedDv2 === dv2;
  }, 'CPF inválido');

// Validação de senha forte
export const passwordSchema = z.string()
  .min(8, 'A senha deve ter no mínimo 8 caracteres')
  .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
  .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
  .regex(/[^A-Za-z0-9]/, 'A senha deve conter pelo menos um caractere especial');

// Validação de email
export const emailSchema = z.string()
  .email('Email inválido')
  .transform(email => email.toLowerCase().trim());

// Validação de telefone
export const phoneSchema = z.string()
  .regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone deve estar no formato (99) 99999-9999');

// Validação de data de nascimento
export const birthDateSchema = z.string()
  .refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 18;
  }, 'O usuário deve ter pelo menos 18 anos');

// Validação de número de registro profissional
export const registrationNumberSchema = z.string()
  .regex(/^\d{4,10}$/, 'Número de registro inválido');

// Validação de estado
export const stateSchema = z.string()
  .length(2, 'Estado deve ter 2 letras')
  .toUpperCase();

// Schema para cadastro de paciente
export const patientRegistrationSchema = z.object({
  fullName: z.string().min(3, 'Nome completo é obrigatório'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  cpf: cpfSchema,
  phone: phoneSchema,
  birthDate: birthDateSchema,
  termsAccepted: z.boolean().refine(val => val === true, 'Você deve aceitar os termos de uso')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
});

// Schema para cadastro de profissional
export const professionalRegistrationSchema = z.object({
  fullName: z.string().min(3, 'Nome completo é obrigatório'),
  email: emailSchema,
  password: passwordSchema,
  cpf: cpfSchema,
  phone: phoneSchema,
  registrationType: z.enum(['CRM', 'CRO', 'CRF', 'CRN', 'CREFITO', 'CRP', 'COREN', 'OUTRO']),
  registrationNumber: registrationNumberSchema,
  registrationState: stateSchema,
  specialty: z.string().min(3, 'Especialidade é obrigatória'),
  location: z.string().optional(),
  documentUrl: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, 'Você deve aceitar os termos de uso')
}); 