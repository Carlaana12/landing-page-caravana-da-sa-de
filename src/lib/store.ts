import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { UserType, USER_TYPES } from './constants';

interface AuthState {
  user: User | null;
  userType: UserType | null;
  setUser: (user: User | null) => void;
  setUserType: (type: UserType | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userType: null,
  setUser: (user) => set({ user }),
  setUserType: (type) => set({ userType: type }),
}));