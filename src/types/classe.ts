// Types pour la gestion des classes virtuelles

// Enums
export enum ClasseStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum EnrollmentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

// Types de base
export interface Schedule {
  dayOfWeek: number; // 0-6 (0=Dimanche, 6=Samedi)
  startTime: string; // Format "HH:MM"
  endTime: string; // Format "HH:MM"
  duration: number; // Durée en minutes
}

export interface ClasseSettings {
  maxStudents: number;
  currentStudents: number;
  isPublic: boolean;
  requiresApproval: boolean;
}

export interface Enrollment {
  studentId: string;
  joinedAt: Date;
  status: EnrollmentStatus;
}

export interface ClasseStats {
  totalStudents: number;
  activeStudents: number;
  completedModules: number;
  averageScore: number;
}

// Types pour les réponses API
export interface Classe {
  _id: string;
  className: string;
  description?: string;
  teacherId: string;
  courseId: string;
  students: string[];
  parents: string[];
  status: ClasseStatus;
  startDate?: Date;
  endDate?: Date;
  schedule: Schedule[];
  settings: ClasseSettings;
  enrollments: Enrollment[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// DTOs pour les listes (données allégées)
export interface ClasseListDto {
  _id: string;
  className: string;
  description?: string;
  teacherId: string;
  teacherName: string;
  courseId: string;
  courseTitle: string;
  status: ClasseStatus;
  currentStudents: number;
  maxStudents: number;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// DTOs pour les détails complets
export interface ClasseResponseDto {
  _id: string;
  className: string;
  description?: string;
  teacherId: string;
  teacher: {
    _id: string;
    name: string;
    lastname: string;
    email: string;
  };
  courseId: string;
  course: {
    _id: string;
    courseTitle: string;
    description: string;
    modules?: any[];
  };
  status: ClasseStatus;
  settings: ClasseSettings;
  startDate?: Date;
  endDate?: Date;
  schedule: Schedule[];
  students: string[];
  enrollments: Enrollment[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// DTOs pour les formulaires
export interface CreateClasseDto {
  className: string;
  description?: string;
  courseId: string;
  startDate?: string; // Format ISO string
  endDate?: string; // Format ISO string
  schedule?: Schedule[];
  settings?: Partial<ClasseSettings>;
}

export interface UpdateClasseDto {
  className?: string;
  description?: string;
  status?: ClasseStatus;
  startDate?: string; // Format ISO string
  endDate?: string; // Format ISO string
  schedule?: Schedule[];
  settings?: Partial<ClasseSettings>;
}

export interface EnrollStudentDto {
  studentId: string;
}

// Types pour les filtres et recherche
export interface ClasseFilters {
  status?: ClasseStatus;
  courseId?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

// Types pour les statistiques
export interface ClasseStatsDto {
  totalStudents: number;
  activeStudents: number;
  completedModules: number;
  averageScore: number;
}

// Types pour les formulaires d'horaire
export interface ScheduleFormData {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  duration: number;
}

// Types pour les paramètres de classe
export interface ClasseSettingsFormData {
  maxStudents: number;
  isPublic: boolean;
  requiresApproval: boolean;
}

// Types pour les formulaires de classe
export interface ClasseFormData {
  className: string;
  description: string;
  courseId: string;
  startDate: string;
  endDate: string;
  schedule: ScheduleFormData[];
  settings: ClasseSettingsFormData;
}

// Types pour les réponses d'API
export interface ClasseApiResponse {
  success: boolean;
  message: string;
  data: Classe | Classe[] | ClasseListDto[] | ClasseResponseDto | ClasseStats;
  error?: string;
}

// Types pour les hooks
export interface UseClassesOptions {
  teacherId?: string;
  studentId?: string;
  filters?: ClasseFilters;
  enabled?: boolean;
}

export interface UseClasseOptions {
  classId: string;
  enabled?: boolean;
}

// Types pour les mutations
export interface CreateClasseMutation {
  data: CreateClasseDto;
  onSuccess?: (classe: Classe) => void;
  onError?: (error: Error) => void;
}

export interface UpdateClasseMutation {
  classId: string;
  data: UpdateClasseDto;
  onSuccess?: (classe: Classe) => void;
  onError?: (error: Error) => void;
}

export interface EnrollStudentMutation {
  classId: string;
  studentId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export interface UnenrollStudentMutation {
  classId: string;
  studentId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

// Types pour les étudiants dans une classe
export interface StudentInClass {
  _id: string;
  name: string;
  lastname: string;
  email: string;
  matricule?: string;
  niveau?: string;
  joinedAt: Date;
  enrollmentStatus: EnrollmentStatus;
}

// Types pour les étudiants disponibles
export interface AvailableStudent {
  _id: string;
  name: string;
  lastname: string;
  email: string;
  matricule?: string;
  niveau?: string;
}

// Types pour les mutations d'étudiants
export interface UpdateEnrollmentStatusMutation {
  classId: string;
  studentId: string;
  status: EnrollmentStatus;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}
