import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

dotenv.config({ path: join(projectRoot, '.env') });

if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas!');
  process.exit(1);
}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkFunctionality() {
  console.log('🔍 Verificando funcionalidades do sistema...\n');

  // 1. Verificar conexão com Supabase
  console.log('1️⃣ Testando conexão com Supabase...');
  try {
    const { data, error } = await supabase.from('admin_users').select('count');
    if (error) throw error;
    console.log('✅ Conexão com Supabase estabelecida com sucesso!\n');
  } catch (error) {
    console.error('❌ Erro na conexão com Supabase:', error.message, '\n');
  }

  // 2. Verificar usuários iniciais
  console.log('2️⃣ Verificando usuários iniciais...');
  try {
    // Verificar usuário admin
    const { data: adminData, error: adminError } = await supabase
      .from('auth.users')
      .select('*')
      .eq('email', 'Ciacomunicaointegrada@gmail.com')
      .single();

    if (adminError) {
      console.log('❌ Usuário admin não encontrado');
    } else {
      console.log('✅ Usuário admin encontrado');
      
      // Verificar se está na tabela admin_users
      const { data: adminUserData } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', adminData.id)
        .single();

      if (adminUserData) {
        console.log('✅ Usuário admin está ativo na tabela admin_users');
      } else {
        console.log('❌ Usuário admin não está na tabela admin_users');
      }
    }

    // Verificar usuário parceiro
    const { data: partnerData, error: partnerError } = await supabase
      .from('auth.users')
      .select('*')
      .eq('email', 'Ciacomunicacaointegrada@gmail.com')
      .single();

    if (partnerError) {
      console.log('❌ Usuário parceiro não encontrado');
    } else {
      console.log('✅ Usuário parceiro encontrado');
      
      // Verificar se está na tabela partner_users
      const { data: partnerUserData } = await supabase
        .from('partner_users')
        .select('*')
        .eq('user_id', partnerData.id)
        .single();

      if (partnerUserData) {
        console.log('✅ Usuário parceiro está ativo na tabela partner_users');
      } else {
        console.log('❌ Usuário parceiro não está na tabela partner_users');
      }

      // Verificar se tem perfil
      const { data: partnerProfileData } = await supabase
        .from('partner_profiles')
        .select('*')
        .eq('user_id', partnerData.id)
        .single();

      if (partnerProfileData) {
        console.log('✅ Usuário parceiro tem perfil ativo');
      } else {
        console.log('❌ Usuário parceiro não tem perfil');
      }
    }
    console.log('');
  } catch (error) {
    console.error('❌ Erro ao verificar usuários:', error.message, '\n');
  }

  // 3. Verificar tabelas principais
  console.log('3️⃣ Verificando tabelas principais...');
  const mainTables = [
    'carousel_items',
    'highlights',
    'events',
    'media_items',
    'ads',
    'site_appearance',
    'site_sections',
    'site_pages'
  ];

  for (const table of mainTables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count');
      
      if (error) throw error;
      console.log(`✅ Tabela ${table} está acessível`);
    } catch (error) {
      console.error(`❌ Erro ao acessar tabela ${table}:`, error.message);
    }
  }
  console.log('');

  // 4. Verificar políticas de segurança
  console.log('4️⃣ Verificando políticas de segurança...');
  try {
    // Tentar acessar dados públicos
    const { data: publicData, error: publicError } = await supabase
      .from('carousel_items')
      .select('*')
      .limit(1);

    if (!publicError) {
      console.log('✅ Acesso público funcionando corretamente');
    } else {
      console.log('❌ Erro no acesso público:', publicError.message);
    }

    // Tentar acessar dados protegidos sem autenticação
    const { data: protectedData, error: protectedError } = await supabase
      .from('admin_users')
      .select('*')
      .limit(1);

    if (protectedError) {
      console.log('✅ Proteção de dados funcionando corretamente\n');
    } else {
      console.log('⚠️ Dados protegidos estão acessíveis sem autenticação\n');
    }
  } catch (error) {
    console.error('❌ Erro ao verificar políticas:', error.message, '\n');
  }

  // 5. Verificar configurações do site
  console.log('5️⃣ Verificando configurações do site...');
  try {
    const { data: appearance } = await supabase
      .from('site_appearance')
      .select('*')
      .single();

    if (appearance) {
      console.log('✅ Configurações de aparência encontradas');
      console.log('   Tema:', appearance.theme_colors.primary);
      console.log('   Fonte:', appearance.typography.bodyFont);
    } else {
      console.log('⚠️ Configurações de aparência não encontradas');
    }
  } catch (error) {
    console.error('❌ Erro ao verificar configurações:', error.message);
  }
}

checkFunctionality().catch(console.error);