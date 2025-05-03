import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  signInAdmin, 
  signInPatient, 
  signInProfessional,
  signUpPatient,
  resetPasswordPatient,
  resetPasswordProfessional,
  signOut,
  signUpProfessional
} from '../lib/auth';
import { USER_TYPES, UserType } from '../lib/constants';
import toast from 'react-hot-toast';
import { 
  Mail, 
  Lock, 
  Loader, 
  Eye, 
  EyeOff, 
  UserPlus, 
  ArrowLeft, 
  KeyRound,
  User,
  Phone,
  Calendar,
  FileText,
  MapPin,
  Award,
  FileCheck,
  Stethoscope,
  Building2,
  AlertCircle
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const navigate = useNavigate();
  const location = useLocation();

  // Campos adicionais para registro
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [cpf, setCpf] = useState('');
  const [registrationType, setRegistrationType] = useState<'CRM' | 'CRO' | 'CREFITO' | 'CRP' | 'COREN' | 'OUTRO'>('CRM');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [registrationState, setRegistrationState] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [practiceLocation, setPracticeLocation] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Determinar tipo de usuário baseado na URL
  const getUserType = (): UserType => {
    if (location.pathname.includes('/arearestrita')) {
      return USER_TYPES.ADMIN;
    } else if (location.pathname.includes('/especialista')) {
      return USER_TYPES.SPECIALIST;
    }
    return USER_TYPES.USER;
  };

  const userType = getUserType();

  // Obter título e redirecionamento baseado no tipo de usuário
  const getLoginInfo = () => {
    switch (userType) {
      case USER_TYPES.ADMIN:
        return {
          title: 'Login Administrativo',
          redirect: '/arearestrita'
        };
      case USER_TYPES.SPECIALIST:
        return {
          title: 'Portal Profissional',
          redirect: '/especialista/dashboard'
        };
      default:
        return {
          title: 'Portal do Paciente',
          redirect: '/usuario/dashboard'
        };
    }
  };

  const { title, redirect } = getLoginInfo();

  // Adicionar a função de formatação do telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  // Adicionar a função de formatação do CPF
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      switch (mode) {
        case 'register':
          if (password !== confirmPassword) {
            throw new Error('As senhas não coincidem');
          }

          if (userType === USER_TYPES.SPECIALIST) {
            // Chamada direta restaurada
            await signUpProfessional({
              fullName,
              email,
              password,
              phone,
              registrationType,
              registrationNumber,
              registrationState,
              specialty,
              location: practiceLocation,
              documentUrl,
              termsAccepted
            });
            toast.success('Cadastro realizado com sucesso! Verifique seu email para confirmar sua conta.');

          } else { // Cadastro de Paciente
            await signUpPatient({
              fullName,
              email,
              password,
              confirmPassword,
              cpf,
              phone,
              birthDate,
              termsAccepted
            });
            toast.success('Cadastro realizado com sucesso! Verifique seu email para confirmar sua conta.');
          }
          setMode('login');
          break;

        case 'reset':
          if (userType === USER_TYPES.SPECIALIST) {
            await resetPasswordProfessional(email);
          } else {
            await resetPasswordPatient(email);
          }
          toast.success('Email de recuperação enviado! Verifique sua caixa de entrada.');
          setMode('login');
          break;

        default:
          let authResult;
          if (userType === USER_TYPES.ADMIN) {
            authResult = await signInAdmin(email, password);
          } else if (userType === USER_TYPES.SPECIALIST) {
            authResult = await signInProfessional(email, password);
          } else { // Assumindo Paciente
            console.log('Tentando login como Paciente...');
            authResult = await signInPatient(email, password);
            console.log('Resultado de signInPatient:', authResult);
          }

          toast.success('Login realizado com sucesso!');
          
          // Redirecionar baseado no tipo de usuário
          if (authResult && authResult.userType === USER_TYPES.PATIENT) {
            console.log('Redirecionando para /paciente/dashboard...');
            navigate('/paciente/dashboard');
          } else if (authResult && authResult.userType === USER_TYPES.SPECIALIST) {
            console.log('Redirecionando para /especialista/dashboard...');
            navigate('/especialista/dashboard');
          } else if (authResult && authResult.userType === USER_TYPES.ADMIN) {
            console.log('Redirecionando para /arearestrita...');
            navigate('/arearestrita');
          } else {
            console.error('Não foi possível determinar o tipo de usuário ou authResult está inesperado:', authResult);
            // Fallback: talvez redirecionar para home ou exibir erro?
            navigate('/'); 
          }
      }
    } catch (error: any) {
      console.error('Erro:', error);
      
      // Tratamento específico de erros
      if (error.message.includes('Email not confirmed')) {
        toast.error('Por favor, verifique seu email antes de fazer login.');
      } else if (error.message.includes('Invalid login credentials')) {
        toast.error('Email ou senha incorretos.');
      } else if (error.message.includes('User already registered')) {
        toast.error('Este email já está cadastrado.');
      } else if (error.message.includes('Password should be at least 6 characters')) {
        toast.error('A senha deve ter pelo menos 6 caracteres.');
      } else if (error.message.includes('Acesso permitido apenas para')) {
        toast.error(error.message);
      } else {
        toast.error(error.message || 'Erro ao processar sua solicitação');
      }
    } finally {
      setLoading(false);
    }
  };

  // Não mostrar opção de registro para admin
  const canRegister = userType !== USER_TYPES.ADMIN;
  // Não mostrar opção de recuperar senha para admin
  const canResetPassword = userType !== USER_TYPES.ADMIN;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { userType } = await signInPatient(email, password);
      toast.success('Login realizado com sucesso');
      
      if (userType === USER_TYPES.PATIENT) {
        navigate('/paciente/dashboard');
      } else if (userType === USER_TYPES.SPECIALIST) {
        navigate('/especialista/dashboard');
      } else if (userType === USER_TYPES.ADMIN) {
        navigate('/admin/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-verde-cia/5 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          {mode !== 'login' && (
            <button
              onClick={() => setMode('login')}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-6 group transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
              Voltar para login
            </button>
          )}
          
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              {userType === USER_TYPES.SPECIALIST ? (
                <div className="w-16 h-16 bg-verde-cia/10 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-8 h-8 text-verde-cia" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-verde-cia/10 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-verde-cia" />
                </div>
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {mode === 'register' ? 'Criar Conta' : 
               mode === 'reset' ? 'Recuperar Senha' : 
               title}
            </h2>
            <p className="text-gray-600">
              {mode === 'register' ? 'Preencha seus dados para criar uma conta' :
               mode === 'reset' ? 'Digite seu email para recuperar sua senha' :
               'Entre com suas credenciais para acessar'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'register' && (
              <div className="space-y-6">
                {/* Informações Pessoais */}
                <div className="bg-gray-50 p-6 rounded-xl space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Informações Pessoais
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome Completo
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde-cia focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CPF
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={cpf}
                          onChange={(e) => setCpf(formatCPF(e.target.value))}
                          placeholder="000.000.000-00"
                          maxLength={14}
                          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde-cia focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(formatPhone(e.target.value))}
                          placeholder="(99) 99999-9999"
                          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde-cia focus:border-transparent"
                          required
                        />
                    </div>
                  </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data de Nascimento
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="date"
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde-cia focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {userType === USER_TYPES.SPECIALIST && (
                  <div className="bg-gray-50 p-6 rounded-xl space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <Award className="w-5 h-5 mr-2" />
                      Informações Profissionais
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo de Registro
                        </label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <select
                            value={registrationType}
                            onChange={(e) => setRegistrationType(e.target.value as any)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde-cia focus:border-transparent appearance-none"
                            required
                          >
                            <option value="CRM">CRM</option>
                            <option value="CRO">CRO</option>
                            <option value="CREFITO">CREFITO</option>
                            <option value="CRP">CRP</option>
                            <option value="COREN">COREN</option>
                            <option value="OUTRO">Outro</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Número do Registro
                        </label>
                        <div className="relative">
                          <Award className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={registrationNumber}
                            onChange={(e) => setRegistrationNumber(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde-cia focus:border-transparent"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Estado do Registro
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={registrationState}
                            onChange={(e) => setRegistrationState(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde-cia focus:border-transparent"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Especialidade
                        </label>
                        <div className="relative">
                          <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={specialty}
                            onChange={(e) => setSpecialty(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde-cia focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Local de Atendimento
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={practiceLocation}
                          onChange={(e) => setPracticeLocation(e.target.value)}
                          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde-cia focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Documento de Comprovação
                      </label>
                      <div className="relative">
                        <FileCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="file"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              setDocumentUrl('temp-url');
                            }
                          }}
                          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde-cia focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-verde-cia file:text-white hover:file:bg-verde-cia-escuro"
                          required
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Envie um documento que comprove seu registro profissional
                      </p>
                    </div>
                  </div>
                )}

                {/* Credenciais de Acesso */}
                <div className="bg-gray-50 p-6 rounded-xl space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Lock className="w-5 h-5 mr-2" />
                    Credenciais de Acesso
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde-cia focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-12 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde-cia focus:border-transparent"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-12 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde-cia focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="h-4 w-4 text-verde-cia focus:ring-verde-cia border-gray-300 rounded"
                    required
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Li e aceito os <a href="#" className="text-verde-cia hover:text-verde-cia-escuro">termos de uso</a>
                  </label>
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde-cia focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-12 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde-cia focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {mode === 'reset' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde-cia focus:border-transparent"
                    required
                  />
                </div>
              </div>
            )}

            {mode === 'login' && canResetPassword && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setMode('reset')}
                  className="text-sm text-verde-cia hover:text-verde-cia-escuro transition-colors flex items-center"
                >
                  <KeyRound className="w-4 h-4 mr-1" />
                  Esqueceu sua senha?
                </button>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-verde-cia hover:bg-verde-cia-escuro focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde-cia transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  mode === 'register' ? 'Criar Conta' :
                  mode === 'reset' ? 'Enviar Email de Recuperação' :
                  'Entrar'
                )}
              </button>
            </div>

            {canRegister && mode === 'login' && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Ainda não tem uma conta?</p>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="inline-flex items-center justify-center px-4 py-2 border border-verde-cia text-sm font-medium rounded-lg text-verde-cia hover:bg-verde-cia hover:text-white transition-colors"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Criar nova conta
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;