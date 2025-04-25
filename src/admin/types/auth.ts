import { User } from '@supabase/supabase-js';

export type AdminUser = User & {
  nome?: string;
  role?: string;
};

export interface AuthState {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
} 