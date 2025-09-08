// Constantes de l'application

export const APP_NAME = 'Yello';
export const APP_VERSION = '1.0.0';

export const API_BASE_URL = import.meta.env['VITE_API_BASE_URL'] || 'http://localhost:3000/api';

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

export const STORAGE_KEYS = {
  THEME: 'yello-theme',
  USER: 'yello-user',
  TOKEN: 'yello-token',
} as const;
