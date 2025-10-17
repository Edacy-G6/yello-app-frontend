import type { Quiz, QuizQuestion, CourseContent } from '../types';

// Types pour la génération de quiz
export interface QuizGenerationOptions {
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  includeMultipleChoice: boolean;
  includeTrueFalse: boolean;
  includeTextQuestions: boolean;
  includeNumericalQuestions: boolean;
}

export interface QuizGenerationResult {
  success: boolean;
  quiz: Quiz | null;
  questions: QuizQuestion[];
  error?: string;
}

// Templates de questions par type
const QUESTION_TEMPLATES = {
  multipleChoice: {
    easy: [
      "Quel est le concept principal de {topic} ?",
      "Quelle est la définition de {concept} ?",
      "Quel est l'objectif principal de {topic} ?"
    ],
    medium: [
      "Quelle est la différence entre {concept1} et {concept2} ?",
      "Comment {process} fonctionne-t-il ?",
      "Quel est l'impact de {factor} sur {outcome} ?"
    ],
    hard: [
      "Analysez les avantages et inconvénients de {concept}",
      "Expliquez le processus de {complexProcess}",
      "Évaluez l'efficacité de {method} dans le contexte de {situation}"
    ]
  },
  trueFalse: [
    "{statement} est vrai.",
    "{concept} est essentiel pour {outcome}.",
    "La méthode {method} est plus efficace que {alternative}."
  ],
  text: [
    "Expliquez le concept de {concept}",
    "Décrivez le processus de {process}",
    "Analysez l'importance de {topic}",
    "Comparez {concept1} et {concept2}"
  ],
  numerical: [
    "Calculez {calculation}",
    "Résolvez l'équation {equation}",
    "Déterminez la valeur de {variable}"
  ]
};

// Options par défaut
const DEFAULT_OPTIONS: QuizGenerationOptions = {
  difficulty: 'medium',
  questionCount: 5,
  includeMultipleChoice: true,
  includeTrueFalse: true,
  includeTextQuestions: false,
  includeNumericalQuestions: false
};

// Extraire les concepts clés du contenu du cours
const extractKeyConcepts = (content: CourseContent[]): string[] => {
  const concepts: string[] = [];
  
  content.forEach(item => {
    if (item.type === 'heading') {
      // Extraire les mots clés des titres
      const words = item.content.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3);
      concepts.push(...words);
    } else if (item.type === 'paragraph') {
      // Extraire les concepts des paragraphes
      const sentences = item.content.split(/[.!?]+/);
      sentences.forEach(sentence => {
        const words = sentence.toLowerCase()
          .replace(/[^\w\s]/g, '')
          .split(/\s+/)
          .filter(word => word.length > 4);
        concepts.push(...words.slice(0, 2)); // Prendre les 2 premiers mots significatifs
      });
    }
  });

  // Dédupliquer et retourner les concepts uniques
  return [...new Set(concepts)].slice(0, 10);
};

// Générer une question à choix multiples
const generateMultipleChoiceQuestion = (
  concepts: string[],
  difficulty: 'easy' | 'medium' | 'hard',
  questionId: string
): QuizQuestion => {
  const templates = QUESTION_TEMPLATES.multipleChoice[difficulty];
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  const concept = concepts[Math.floor(Math.random() * concepts.length)];
  const question = template.replace('{topic}', concept).replace('{concept}', concept);
  
  // Générer des options de réponse
  const options = [
    `Réponse correcte pour ${concept}`,
    `Option alternative 1`,
    `Option alternative 2`,
    `Option incorrecte`
  ];
  
  return {
    id: questionId,
    type: 'multiple-choice',
    question,
    options,
    correctAnswer: 0,
    explanation: `Explication : La réponse correcte est la première option car elle correspond précisément à la définition de ${concept}.`,
    points: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3
  };
};

// Générer une question vrai/faux
const generateTrueFalseQuestion = (
  concepts: string[],
  questionId: string
): QuizQuestion => {
  const templates = QUESTION_TEMPLATES.trueFalse;
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  const concept = concepts[Math.floor(Math.random() * concepts.length)];
  const question = template.replace('{concept}', concept);
  
  const isTrue = Math.random() > 0.5;
  
  return {
    id: questionId,
    type: 'true-false',
    question,
    correctAnswer: isTrue,
    explanation: isTrue 
      ? `C'est correct. ${concept} est effectivement important dans ce contexte.`
      : `C'est incorrect. ${concept} n'est pas toujours vrai dans ce contexte.`,
    points: 1
  };
};

// Générer une question texte
const generateTextQuestion = (
  concepts: string[],
  questionId: string
): QuizQuestion => {
  const templates = QUESTION_TEMPLATES.text;
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  const concept = concepts[Math.floor(Math.random() * concepts.length)];
  const question = template.replace('{concept}', concept);
  
  return {
    id: questionId,
    type: 'text',
    question,
    correctAnswer: `Réponse attendue : Explication détaillée de ${concept}`,
    explanation: `Points clés à mentionner : définition, importance, applications pratiques de ${concept}.`,
    points: 3
  };
};

// Générer une question numérique
const generateNumericalQuestion = (
  concepts: string[],
  questionId: string
): QuizQuestion => {
  const templates = QUESTION_TEMPLATES.numerical;
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  const concept = concepts[Math.floor(Math.random() * concepts.length)];
  const question = template.replace('{concept}', concept);
  
  const correctAnswer = Math.floor(Math.random() * 100) + 1;
  
  return {
    id: questionId,
    type: 'numerical',
    question,
    correctAnswer,
    explanation: `Calcul : La réponse est ${correctAnswer} basée sur les données fournies.`,
    points: 2
  };
};

// Générer un quiz complet
export const generateQuiz = async (
  courseId: number,
  courseContent: CourseContent[],
  options: Partial<QuizGenerationOptions> = {}
): Promise<QuizGenerationResult> => {
  try {
    const finalOptions = { ...DEFAULT_OPTIONS, ...options };
    const concepts = extractKeyConcepts(courseContent);
    
    if (concepts.length === 0) {
      return {
        success: false,
        quiz: null,
        questions: [],
        error: 'Aucun concept clé trouvé dans le contenu du cours'
      };
    }

    const questions: QuizQuestion[] = [];
    let questionId = 1;

    // Générer les questions selon les options
    const questionTypes = [];
    if (finalOptions.includeMultipleChoice) questionTypes.push('multiple-choice');
    if (finalOptions.includeTrueFalse) questionTypes.push('true-false');
    if (finalOptions.includeTextQuestions) questionTypes.push('text');
    if (finalOptions.includeNumericalQuestions) questionTypes.push('numerical');

    for (let i = 0; i < finalOptions.questionCount; i++) {
      const questionType = questionTypes[i % questionTypes.length];
      const id = `q${questionId++}`;

      let question: QuizQuestion;

      switch (questionType) {
        case 'multiple-choice':
          question = generateMultipleChoiceQuestion(concepts, finalOptions.difficulty, id);
          break;
        case 'true-false':
          question = generateTrueFalseQuestion(concepts, id);
          break;
        case 'text':
          question = generateTextQuestion(concepts, id);
          break;
        case 'numerical':
          question = generateNumericalQuestion(concepts, id);
          break;
        default:
          question = generateMultipleChoiceQuestion(concepts, finalOptions.difficulty, id);
      }

      questions.push(question);
    }

    // Créer le quiz
    const quiz: Quiz = {
      id: `quiz-${courseId}-${Date.now()}`,
      courseId,
      title: `Quiz - ${concepts[0] || 'Cours'}`,
      questions,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return {
      success: true,
      quiz,
      questions
    };

  } catch (error) {
    return {
      success: false,
      quiz: null,
      questions: [],
      error: error instanceof Error ? error.message : 'Erreur inconnue lors de la génération du quiz'
    };
  }
};

// Générer des questions supplémentaires
export const generateAdditionalQuestions = async (
  existingQuestions: QuizQuestion[],
  courseContent: CourseContent[],
  count: number = 3
): Promise<QuizQuestion[]> => {
  try {
    const concepts = extractKeyConcepts(courseContent);
    const newQuestions: QuizQuestion[] = [];
    let questionId = existingQuestions.length + 1;

    for (let i = 0; i < count; i++) {
      const questionType = ['multiple-choice', 'true-false'][Math.floor(Math.random() * 2)];
      const id = `q${questionId++}`;

      let question: QuizQuestion;

      if (questionType === 'multiple-choice') {
        question = generateMultipleChoiceQuestion(concepts, 'medium', id);
      } else {
        question = generateTrueFalseQuestion(concepts, id);
      }

      newQuestions.push(question);
    }

    return newQuestions;

  } catch (error) {
    console.error('Erreur lors de la génération de questions supplémentaires:', error);
    return [];
  }
};

// Analyser la difficulté du contenu
export const analyzeContentDifficulty = (content: CourseContent[]): 'easy' | 'medium' | 'hard' => {
  let complexityScore = 0;

  content.forEach(item => {
    if (item.type === 'heading') {
      complexityScore += item.level === 1 ? 3 : item.level === 2 ? 2 : 1;
    } else if (item.type === 'formula') {
      complexityScore += 3;
    } else if (item.type === 'exercise') {
      complexityScore += 2;
    } else if (item.type === 'paragraph') {
      const wordCount = item.content.split(/\s+/).length;
      complexityScore += wordCount > 100 ? 2 : 1;
    }
  });

  if (complexityScore < 10) return 'easy';
  if (complexityScore < 20) return 'medium';
  return 'hard';
};

// Service principal de génération de quiz
export const quizGenerator = {
  generateQuiz,
  generateAdditionalQuestions,
  analyzeContentDifficulty
};

export default quizGenerator;
