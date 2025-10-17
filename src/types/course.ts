export enum CourseStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum GenerationStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface Course {
  _id: string;
  title: string;
  description?: string;
  level: CourseLevel;
  subject: string;
  status: CourseStatus;
  duration?: number;
  tags: string[];
  teacherId: string;
  modules?: Module[];
  studentCount: number;
  completionRate: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Module {
  _id: string;
  name: string;
  content: string;
  order: number;
  duration?: number;
  courseId: string;
  qcmQuestions?: QCMQuestion[];
  shortAnswerQuestions?: ShortAnswerQuestion[];
  fillInTheBlanksQuestions?: FillInTheBlanksQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestionChoice {
  text: string;
  isCorrect: boolean;
}

export interface QCMQuestion {
  question: string;
  choices: QuestionChoice[];
}

export interface ShortAnswerQuestion {
  question: string;
  answer: string;
}

export interface FillInTheBlanksQuestion {
  sentence: string;
  answer: string;
}

export interface CreateCourseData {
  title: string;
  description?: string;
  level: CourseLevel;
  subject: string;
  duration?: number;
  tags?: string[];
}

export interface UpdateCourseData {
  title?: string;
  description?: string;
  level?: CourseLevel;
  subject?: string;
  status?: CourseStatus;
  duration?: number;
  tags?: string[];
}

export interface GenerateCourseFromFileData {
  title: string;
  description?: string;
  subject: string;
  level: string;
  tags?: string;
}

export interface GenerationProgress {
  generationId: string;
  status: GenerationStatus;
  progress: number;
  message?: string;
  data?: any;
  error?: string;
  course?: Course;
  createdAt: Date;
  updatedAt: Date;
}

export interface RAGModule {
  nom_module: string;
  contenu_module: string;
  qcm?: any[];
  reponses_courtes?: any[];
  texte_a_trou?: any[];
}

export interface RAGCourseResponse {
  titre_cours: string;
  modules: RAGModule[];
}
