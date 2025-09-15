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
  // Routes d'authentification
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',
  // Routes protégées
  DASHBOARD: '/dashboard',
  TEACHER_DASHBOARD: '/teacher/dashboard',
  TEACHER_COURSES: '/teacher/courses',
  TEACHER_IMPORT_PDF: '/teacher/import-pdf',
  TEACHER_COURSE_EDITOR: '/teacher/course-editor',
  TEACHER_QUIZ: '/teacher/quiz',
  TEACHER_ANALYTICS: '/teacher/analytics',
  
  // Routes étudiant
  STUDENT_DASHBOARD: '/student/dashboard',
  STUDENT_COURSES: '/student/courses',
  STUDENT_PROGRESS: '/student/progress',
  
  // Routes parent
  PARENT_DASHBOARD: '/parent/dashboard',
  PARENT_CHILDREN: '/parent/children',
  PARENT_REPORTS: '/parent/reports',
  
  // Routes admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_SCHOOLS: '/admin/schools',
  CLASSES: '/classes',
  STUDENTS: '/students',
  REPORTS: '/reports',
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
  REFRESH_TOKEN: 'yello-refresh-token',
} as const;

export const USER_ROLES = {
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
  ADMIN: 'admin',
} as const;

// Re-export des mocks depuis le fichier centralisé
export {
  MOCK_USERS,
  MOCK_COURSES,
  MOCK_COURSE_CONTENT,
  MOCK_ANALYTICS,
  MOCK_SCHOOL_LEVELS,
  MOCK_EXPORT_FORMATS,
  MOCK_NOTIFICATIONS,
  MOCK_QUICK_START_STEPS,
  MOCK_DASHBOARD_STATS
} from './mocks';
