import type { UserRole, CourseContent } from '../types';

// Mock Users pour l'authentification
export const MOCK_USERS = {
  teacher: {
    email: 'teacher@yello.com',
    password: 'teacher123',
    name: 'Amadou Diallo',
    role: 'teacher' as UserRole,
    schoolId: 'school-001'
  },
  student: {
    email: 'student@yello.com', 
    password: 'student123',
    name: 'Fatou Sall',
    role: 'student' as UserRole,
    schoolId: 'school-001'
  },
  parent: {
    email: 'parent@yello.com',
    password: 'parent123', 
    name: 'Mariama Ba',
    role: 'parent' as UserRole,
    schoolId: 'school-001'
  },
  admin: {
    email: 'admin@yello.com',
    password: 'admin123',
    name: 'Ibrahima Ndiaye',
    role: 'admin' as UserRole,
    schoolId: 'school-001'
  }
} as const;

// Mock Courses pour le tableau de bord
export const MOCK_COURSES = [
  {
    id: 1,
    title: "Mathématiques - Algèbre",
    generatedAt: "il y a 2 heures",
    type: "pdf" as const,
    status: "completed" as const,
    studentCount: 25,
    quizCount: 8
  },
  {
    id: 2,
    title: "Physique - Mécanique",
    generatedAt: "il y a 1 jour",
    type: "pdf" as const,
    status: "completed" as const,
    studentCount: 18,
    quizCount: 6
  },
  {
    id: 3,
    title: "Chimie - Réactions",
    generatedAt: "il y a 3 jours",
    type: "pdf" as const,
    status: "completed" as const,
    studentCount: 22,
    quizCount: 10
  },
  {
    id: 4,
    title: "Biologie - Cellules",
    generatedAt: "il y a 1 semaine",
    type: "pdf" as const,
    status: "draft" as const,
    studentCount: 0,
    quizCount: 0
  },
  {
    id: 5,
    title: "Histoire - Révolution",
    generatedAt: "il y a 2 semaines",
    type: "pdf" as const,
    status: "published" as const,
    studentCount: 30,
    quizCount: 12
  }
] as const;

// Mock Course Content pour l'éditeur
export const MOCK_COURSE_CONTENT: CourseContent[] = [
  {
    id: '1',
    type: 'heading',
    level: 1,
    content: 'Chapitre: Le Théorème de Pythagore'
  },
  {
    id: '2',
    type: 'paragraph',
    level: 2,
    content: 'Introduction'
  },
  {
    id: '3',
    type: 'paragraph',
    level: 3,
    content: 'Le théorème de Pythagore est l\'un des théorèmes les plus connus en géométrie. Il permet de calculer la longueur d\'un côté d\'un triangle rectangle si l\'on connaît les longueurs des deux autres côtés. Ce théorème est très utile dans de nombreuses applications pratiques, comme calculer la diagonale d\'un terrain de football ou la hauteur d\'une échelle appuyée contre un mur.'
  },
  {
    id: '4',
    type: 'heading',
    level: 2,
    content: 'Énoncé du théorème'
  },
  {
    id: '5',
    type: 'formula',
    level: 3,
    content: 'AB² = AC² + BC²'
  },
  {
    id: '6',
    type: 'paragraph',
    level: 3,
    content: 'Où :\n• AB = hypoténuse (le côté le plus long)\n• AC et BC = les deux autres côtés'
  },
  {
    id: '7',
    type: 'heading',
    level: 2,
    content: 'Exemple illustré'
  },
  {
    id: '8',
    type: 'example',
    level: 3,
    content: 'Si AC = 3 cm et BC = 4 cm, alors :\nAB² = 3² + 4² = 9 + 16 = 25\nAB = √25 = 5 cm'
  },
  {
    id: '9',
    type: 'heading',
    level: 2,
    content: 'Applications concrètes'
  },
  {
    id: '10',
    type: 'paragraph',
    level: 3,
    content: '• Calculer la diagonale d\'un rectangle\n• Vérifier qu\'un triangle est rectangle\n• Mesurer des hauteurs inaccessibles\n• Navigation et cartographie'
  },
  {
    id: '11',
    type: 'heading',
    level: 2,
    content: 'Exercices guidés (avec correction)'
  },
  {
    id: '12',
    type: 'exercise',
    level: 3,
    content: 'Exercice 1: Dans un triangle rectangle, les deux côtés mesurent 7 cm et 24 cm. Quelle est la longueur de l\'hypoténuse ?\n\nSolution: AB² = 7² + 24² = 49 + 576 = 625\nAB = √625 = 25 cm'
  },
  {
    id: '13',
    type: 'exercise',
    level: 3,
    content: 'Exercice 2: Un triangle a des côtés de 8 cm, 15 cm et 17 cm. Est-ce un triangle rectangle ?\n\nSolution: Vérifions si 17² = 8² + 15²\n289 = 64 + 225 = 289 ✓\nOui, c\'est un triangle rectangle.'
    }
];

// Mock Analytics pour le suivi
export const MOCK_ANALYTICS = {
  totalCourses: 12,
  totalStudents: 156,
  completionRate: 78.5,
  averageScore: 82.3,
  recentActivity: [
    {
      id: 1,
      type: 'course_completed',
      title: 'Mathématiques - Algèbre',
      student: 'Fatou Sall',
      timestamp: 'il y a 2 heures',
      score: 85
    },
    {
      id: 2,
      type: 'quiz_taken',
      title: 'Quiz - Théorème de Pythagore',
      student: 'Amadou Diallo',
      timestamp: 'il y a 4 heures',
      score: 92
    },
    {
      id: 3,
      type: 'course_started',
      title: 'Physique - Mécanique',
      student: 'Mariama Ba',
      timestamp: 'il y a 6 heures',
      score: null
    }
  ],
  monthlyStats: [
    { month: 'Jan', courses: 8, students: 120, completion: 75 },
    { month: 'Fév', courses: 12, students: 145, completion: 78 },
    { month: 'Mar', courses: 15, students: 156, completion: 82 },
    { month: 'Avr', courses: 18, students: 167, completion: 79 },
    { month: 'Mai', courses: 20, students: 172, completion: 85 },
    { month: 'Jun', courses: 22, students: 180, completion: 88 }
  ]
} as const;

// Mock School Levels
export const MOCK_SCHOOL_LEVELS = [
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

// Mock Export Formats
export const MOCK_EXPORT_FORMATS = [
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

// Mock Notifications
export const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'success',
    title: 'Cours généré avec succès',
    message: 'Votre cours "Mathématiques - Algèbre" est prêt',
    timestamp: 'il y a 2 heures',
    read: false
  },
  {
    id: 2,
    type: 'info',
    title: 'Nouveau quiz disponible',
    message: 'Un quiz a été généré pour "Physique - Mécanique"',
    timestamp: 'il y a 1 jour',
    read: false
  },
  {
    id: 3,
    type: 'warning',
    title: 'Rappel d\'échéance',
    message: 'N\'oubliez pas de publier vos cours en attente',
    timestamp: 'il y a 2 jours',
    read: true
  }
] as const;

// Mock Quick Start Steps
export const MOCK_QUICK_START_STEPS = [
  {
    id: 1,
    title: "Import du PDF",
    description: "importez votre document source"
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

// Mock Dashboard Stats
export const MOCK_DASHBOARD_STATS = {
  totalCourses: 12,
  totalStudents: 156,
  completionRate: 78.5,
  averageScore: 82.3,
  monthlyGrowth: 15.2
} as const;
