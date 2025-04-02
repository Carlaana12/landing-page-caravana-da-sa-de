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

// Create Supabase client without auth options to avoid fetch issues
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Função para tentar uma operação com retry
async function retryOperation(operation, maxRetries = 3) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.log(`Tentativa ${i + 1} falhou, tentando novamente em ${(i + 1)}s...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  
  throw lastError;
}

async function checkHighlightsSync() {
  console.log('🔍 Verificando sincronização dos destaques...\n');

  let channel;
  
  try {
    // 1. Verificar conexão com Supabase
    console.log('1️⃣ Testando conexão com Supabase...');
    const { data: healthCheck, error: healthError } = await retryOperation(() =>
      supabase.from('highlights').select('count')
    );

    if (healthError) {
      throw new Error(`Erro na conexão com Supabase: ${healthError.message}`);
    }
    console.log('✅ Conexão com Supabase estabelecida\n');

    // 2. Verificar destaques no banco
    console.log('2️⃣ Verificando destaques no banco de dados...');
    const { data: dbHighlights, error: dbError } = await retryOperation(() =>
      supabase
        .from('highlights')
        .select('*')
        .order('display_order', { ascending: true })
    );

    if (dbError) throw new Error(`Erro ao buscar destaques: ${dbError.message}`);

    console.log(`✅ Encontrados ${dbHighlights.length} destaques no banco\n`);
    console.log('Destaques ativos por categoria:');
    
    const activeByCategory = dbHighlights
      .filter(h => h.active)
      .reduce((acc, h) => {
        acc[h.category] = (acc[h.category] || 0) + 1;
        return acc;
      }, {});

    Object.entries(activeByCategory).forEach(([category, count]) => {
      console.log(`- ${category}: ${count} destaques ativos`);
    });

    // 3. Verificar realtime subscription
    console.log('\n3️⃣ Testando subscription realtime...');
    
    let eventReceived = false;
    
    // Criar canal com nome único para evitar conflitos
    const channelId = `test_highlights_${Date.now()}`;
    channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'highlights'
        },
        (payload) => {
          console.log('✅ Evento realtime recebido:', payload.eventType);
          eventReceived = true;
        }
      );

    // Aguardar subscription estar ativa
    await channel.subscribe();
    console.log('✅ Canal realtime subscrito com sucesso');
    
    // Aguardar um momento para garantir que a subscription está ativa
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Fazer uma pequena alteração para testar
    const testHighlight = dbHighlights[0];
    if (testHighlight) {
      console.log('Testando atualização do destaque:', testHighlight.id);
      
      const { data: updateData, error: updateError } = await retryOperation(() =>
        supabase
          .from('highlights')
          .update({ 
            title: testHighlight.title, // Atualizar com o mesmo valor para não modificar dados
            updated_at: new Date().toISOString()
          })
          .eq('id', testHighlight.id)
          .select()
      );

      if (updateError) {
        console.error('Detalhes do erro de atualização:', updateError);
        throw new Error(`Erro ao testar atualização: ${updateError.message}`);
      }

      console.log('✅ Atualização realizada com sucesso');

      // Aguardar o evento realtime
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (!eventReceived) {
        console.log('⚠️ Nenhum evento realtime recebido após a atualização');
      } else {
        console.log('✅ Evento realtime recebido com sucesso');
      }
    }

    console.log('✅ Teste de sincronização concluído\n');

  } catch (error) {
    console.error('❌ Erro durante a verificação:', error.message);
    if (error.stack) {
      console.debug('Stack trace:', error.stack);
    }
    process.exit(1);
  } finally {
    // Garantir que o canal seja limpo mesmo em caso de erro
    if (channel) {
      try {
        await channel.unsubscribe();
        console.log('Canal realtime desconectado');
      } catch (error) {
        console.error('Erro ao desconectar canal:', error.message);
      }
    }
  }
}

// Adicionar tratamento de erros não capturados
process.on('unhandledRejection', (error) => {
  console.error('❌ Erro não tratado:', error);
  process.exit(1);
});

checkHighlightsSync().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});