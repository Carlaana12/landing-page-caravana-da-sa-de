import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = 'https://tmhkepakeovbzspxllkx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtaGtlcGFrZW92YnpzcHhsbGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyODgyMzMsImV4cCI6MjA1Njg2NDIzM30.1akezhk3BOKpopHAMAJ3U6PEQjFQTyDutEGhZS5icbA'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: window.localStorage
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    },
    global: {
      headers: {
        'x-application-name': 'anuario-saude'
      }
    }
  }
)

// Verificar conexão
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('Conectado ao Supabase')
  }
})