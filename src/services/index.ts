// Export de tous les services API
export { default as apiService } from './apiService';
export { default as authService } from './authService';
export { default as googleAuthService } from './googleAuthService';
export { default as courseService } from './courseService';
export { default as moduleService } from './moduleService';
export { default as userService } from './userService';
export { default as quizService } from './quizService';
export { default as analyticsService } from './analyticsService';
export { default as studentService } from './studentService';
export { default as parentService } from './parentService';
export { default as aiService } from './aiService';
export { default as quizGenerator } from './quizGenerator';

export type { AnalyticsData, DashboardStats } from './analyticsService';
export type { Quiz, QuizQuestion } from './quizService';
export type { StudentProgress, StudentStats, StudentActivity } from './studentService';
export type { ParentDashboard, ChildProgress } from './parentService';
export type { AIProcessingStep, PDFAnalysisResult } from './aiService';
export type { GoogleAuthResponse, GoogleCredentialResponse } from './googleAuthService';

// Export des types de cours
export type {
  Course,
  Module,
  CreateCourseData,
  UpdateCourseData,
  GenerateCourseFromFileData,
  GenerationProgress,
  CourseStatus,
  CourseLevel,
  GenerationStatus,
  QCMQuestion,
  ShortAnswerQuestion,
  FillInTheBlanksQuestion,
  QuestionChoice,
} from '../types/course';

