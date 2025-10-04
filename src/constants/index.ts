// Constantes de l'application

export const APP_NAME = 'Yello';
export const APP_VERSION = '1.0.0';

export const API_BASE_URL = 'http://localhost:3001/api';

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
  TEACHER_COURSE_DETAIL: '/teacher/courses/:courseId',
  TEACHER_IMPORT_PDF: '/teacher/import-pdf',
  TEACHER_COURSE_EDITOR: '/teacher/course-editor',
  TEACHER_COURSE_EDITOR_WITH_ID: '/teacher/course-editor/:id',
  TEACHER_COURSE_GENERATION: '/teacher/course-generation',
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

// Constantes pour les niveaux scolaires
export const SCHOOL_LEVELS = [
  { value: 'cp', label: 'CP - Cours Préparatoire' },
  { value: 'ce1', label: 'CE1 - Cours Élémentaire 1' },
  { value: 'ce2', label: 'CE2 - Cours Élémentaire 2' },
  { value: 'cm1', label: 'CM1 - Cours Moyen 1' },
  { value: 'cm2', label: 'CM2 - Cours Moyen 2' },
  { value: '6eme', label: '6ème - Sixième' },
  { value: '5eme', label: '5ème - Cinquième' },
  { value: '4eme', label: '4ème - Quatrième' },
  { value: '3eme', label: '3ème - Troisième' },
  { value: '2nde', label: '2nde - Seconde' },
  { value: '1ere', label: '1ère - Première' },
  { value: 'terminale', label: 'Terminale' },
  { value: 'universite', label: 'Université' }
] as const;

// Formats d'export disponibles
export const EXPORT_FORMATS = [
  {
    id: 'pdf-light',
    name: 'PDF léger',
    description: 'Optimisé pour mobile',
    icon: 'FileText'
  },
  {
    id: 'shareable-link',
    name: 'Lien partageable',
    description: 'Accès web instantané',
    icon: 'Link'
  },
  {
    id: 'pdf-print',
    name: 'PDF impression',
    description: 'Format haute qualité',
    icon: 'Printer'
  },
  {
    id: 'scorm',
    name: 'SCORM',
    description: 'Standard e-learning',
    icon: 'BookOpen'
  }
] as const;

// Étapes du guide de démarrage rapide
export const QUICK_START_STEPS = [
  {
    id: 1,
    title: "Import du PDF",
    description: "Importez votre document source"
  },
  {
    id: 2,
    title: "Analyse IA",
    description: "L'IA analyse le contenu et structure"
  },
  {
    id: 3,
    title: "Génération automatique",
    description: "Création du cours et des quiz"
  },
  {
    id: 4,
    title: "Édition et export",
    description: "Personnalisez et exportez votre contenu",
    isActive: true
  }
] as const;
