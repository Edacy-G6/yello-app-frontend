// Types globaux de l'application

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  schoolId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser extends User {
  token: string;
  refreshToken: string;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  role: UserRole;
  schoolId?: string;
}

export interface AuthResponse {
  user: AuthUser;
  message: string;
}

export type UserRole = 'teacher' | 'student' | 'parent' | 'admin';

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type Theme = 'light' | 'dark' | 'system';

export interface AppState {
  theme: Theme;
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Types pour les cours et contenu éducatif
export interface Course {
  id: number;
  title: string;
  generatedAt: string;
  type: 'pdf' | 'manual' | 'template';
  status: 'draft' | 'completed' | 'published' | 'archived';
  studentCount: number;
  quizCount: number;
  description?: string;
  schoolLevel?: string;
  keywords?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CourseContent {
  id: string;
  type: 'heading' | 'paragraph' | 'formula' | 'example' | 'exercise' | 'image' | 'video';
  level: 1 | 2 | 3;
  content: string;
  metadata?: Record<string, unknown>;
}

export interface Quiz {
  id: string;
  courseId: number;
  title: string;
  questions: QuizQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'text' | 'numerical';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  points: number;
}

// Types pour les analytics et suivi
export interface Analytics {
  totalCourses: number;
  totalStudents: number;
  completionRate: number;
  averageScore: number;
  recentActivity: Activity[];
  monthlyStats: MonthlyStat[];
}

export interface Activity {
  id: number;
  type: 'course_completed' | 'quiz_taken' | 'course_started' | 'course_published';
  title: string;
  student: string;
  timestamp: string;
  score: number | null;
}

export interface MonthlyStat {
  month: string;
  courses: number;
  students: number;
  completion: number;
}

// Types pour les notifications
export interface Notification {
  id: number;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// Types pour les formats d'export
export interface ExportFormat {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Types pour les niveaux scolaires
export interface SchoolLevel {
  value: string;
  label: string;
}

// Types pour les étapes de démarrage rapide
export interface QuickStartStep {
  id: number;
  title: string;
  description: string;
  isActive?: boolean;
}
