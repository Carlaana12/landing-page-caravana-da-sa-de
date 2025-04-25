import { supabase } from '../../lib/supabase';

export class AuthService {
  static async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    return data;
  }

  static async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  }

  static async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      return null;
    }
  }

  static async isAuthenticated() {
    const user = await this.getCurrentUser();
    return !!user;
  }

  static async createAdminUser() {
    const { data, error } = await supabase.auth.signUp({
      email: 'carla.accp64@gmail.com',
      password: 'Ciacomunica@12',
      options: {
        data: {
          role: 'admin'
        }
      }
    });

    if (error) {
      throw error;
    }

    return data;
  }
} 