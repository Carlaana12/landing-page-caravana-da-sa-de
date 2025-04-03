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

async function checkDatabaseErrors() {
  console.log('🔍 Starting database error check...\n');

  const checks = [
    checkTableStructure,
    checkForeignKeys,
    checkIndexes,
    checkPolicies,
    checkTriggers,
    checkUserCreation
  ];

  for (const check of checks) {
    try {
      await check();
    } catch (error) {
      console.error(`❌ Error in ${check.name}:`, error.message);
    }
  }
}

async function checkTableStructure() {
  console.log('📋 Checking table structure...');
  const { data: tables, error } = await supabase
    .from('information_schema.tables')
    .select('*')
    .eq('table_schema', 'public');

  if (error) throw new Error(`Failed to fetch tables: ${error.message}`);
  
  for (const table of tables) {
    const { data: columns, error: columnError } = await supabase
      .from('information_schema.columns')
      .select('*')
      .eq('table_name', table.table_name);

    if (columnError) {
      console.error(`❌ Error checking columns for ${table.table_name}: ${columnError.message}`);
      continue;
    }

    console.log(`✓ Table ${table.table_name}: ${columns.length} columns`);
  }
}

async function checkForeignKeys() {
  console.log('\n🔗 Checking foreign key constraints...');
  const { data: fks, error } = await supabase
    .from('information_schema.referential_constraints')
    .select('*')
    .eq('constraint_schema', 'public');

  if (error) throw new Error(`Failed to fetch foreign keys: ${error.message}`);
  console.log(`✓ Found ${fks.length} foreign key constraints`);
}

async function checkIndexes() {
  console.log('\n📑 Checking indexes...');
  const { data: indexes, error } = await supabase
    .from('pg_indexes')
    .select('*')
    .eq('schemaname', 'public');

  if (error) throw new Error(`Failed to fetch indexes: ${error.message}`);
  console.log(`✓ Found ${indexes.length} indexes`);
}

async function checkPolicies() {
  console.log('\n🔒 Checking RLS policies...');
  const { data: policies, error } = await supabase
    .from('pg_policies')
    .select('*');

  if (error) throw new Error(`Failed to fetch policies: ${error.message}`);
  console.log(`✓ Found ${policies.length} RLS policies`);
}

async function checkTriggers() {
  console.log('\n⚡ Checking triggers...');
  const { data: triggers, error } = await supabase
    .from('information_schema.triggers')
    .select('*')
    .eq('trigger_schema', 'public');

  if (error) throw new Error(`Failed to fetch triggers: ${error.message}`);
  console.log(`✓ Found ${triggers.length} triggers`);
}

async function checkUserCreation() {
  console.log('\n👤 Checking user creation...');
  const { data: users, error } = await supabase
    .from('auth.users')
    .select('*')
    .limit(1);

  if (error) {
    console.error('❌ Error checking user creation:', error.message);
    return;
  }

  if (users && users.length > 0) {
    console.log('✓ User creation is working');
  } else {
    console.log('⚠️ No users found in the database');
  }
}

checkDatabaseErrors().catch(console.error);