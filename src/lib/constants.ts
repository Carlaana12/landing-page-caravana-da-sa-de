// Base URL for the application
export const BASE_URL = 'http://localhost:3000';

// Authentication URLs
export const AUTH_URLS = {
  ADMIN_LOGIN: `/arearestrita/login`,
  ADMIN_DASHBOARD: `/arearestrita`,
  SPECIALIST_LOGIN: `/especialista/login`,
  SPECIALIST_DASHBOARD: `/especialista/dashboard`,
  USER_LOGIN: `/usuario/login`,
  USER_DASHBOARD: `/usuario/dashboard`
};

// Public URLs
export const PUBLIC_URLS = {
  HOME: '/',
  ABOUT: '/sobre',
  SPECIALTIES: '/encontre-aqui',
  DISEASES: '/tratamentos',
  NEWS: '/noticias',
  EVENTS: '/eventos',
  PUBLIC_UTILITIES: '/utilidades-publicas',
  CONTACT: '/contato'
};

// User Types
export const USER_TYPES = {
  ADMIN: 'admin',
  SPECIALIST: 'specialist',
  USER: 'user'
} as const;

export type UserType = typeof USER_TYPES[keyof typeof USER_TYPES];