import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  CheckCircle, 
  Circle, 
  HelpCircle, 
  FileText, 
  Edit3,
  MessageSquare
} from 'lucide-react';

interface QuizQuestion {
  question: string;
  type: 'multiple_choice' | 'short_answer' | 'fill_in_the_blanks';
  options?: Array<{
    text: string;
    isCorrect: boolean;
  }>;
  correctAnswer?: string;
  points: number;
}

interface Quiz {
  title: string;
  type: string;
  questions: QuizQuestion[];
}

interface QuizRendererProps {
  quiz: Quiz;
  className?: string;
}

/**
 * Composant pour afficher un quiz de manière lisible
 */
export const QuizRenderer: React.FC<QuizRendererProps> = ({
  quiz,
  className = '',
}) => {
  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return null;
  }

  const getQuizIcon = (type: string) => {
    switch (type) {
      case 'multiple_choice':
        return <Circle className="h-4 w-4" />;
      case 'short_answer':
        return <Edit3 className="h-4 w-4" />;
      case 'fill_in_the_blanks':
        return <FileText className="h-4 w-4" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getQuizTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple_choice':
        return 'QCM';
      case 'short_answer':
        return 'Réponses Courtes';
      case 'fill_in_the_blanks':
        return 'Textes à Trous';
      default:
        return 'Quiz';
    }
  };

  const getQuizTypeColor = (type: string) => {
    switch (type) {
      case 'multiple_choice':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'short_answer':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'fill_in_the_blanks':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {getQuizIcon(quiz.type)}
            {quiz.title}
          </CardTitle>
          <Badge className={getQuizTypeColor(quiz.type)}>
            {getQuizTypeLabel(quiz.type)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {quiz.questions.map((question, questionIndex) => (
          <div key={questionIndex} className="border border-border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-medium text-foreground flex-1">
                Q{questionIndex + 1}: {question.question}
              </h4>
              <Badge variant="outline" className="ml-2">
                {question.points} pt{question.points > 1 ? 's' : ''}
              </Badge>
            </div>
            
            {question.type === 'multiple_choice' && question.options && (
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <div 
                    key={optionIndex}
                    className={`flex items-center gap-2 p-2 rounded border ${
                      option.isCorrect 
                        ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                        : 'bg-muted/50 border-border'
                    }`}
                  >
                    {option.isCorrect ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={`text-sm ${
                      option.isCorrect ? 'text-white dark:text-green-200' : 'text-foreground'
                    }`}>
                      {option.text}
                    </span>
                  </div>
                ))}
              </div>
            )}
            
            {question.type === 'short_answer' && question.correctAnswer && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-3">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Réponse attendue :
                  </span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {question.correctAnswer}
                </p>
              </div>
            )}
            
            {question.type === 'fill_in_the_blanks' && question.correctAnswer && (
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded p-3">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                    Mot à trouver :
                  </span>
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  {question.correctAnswer}
                </p>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default QuizRenderer;
