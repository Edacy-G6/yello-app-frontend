import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { quizService } from '../services';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Target, 
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Trophy,
  BookOpen,
  Brain,
  Loader2
} from 'lucide-react';

interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'text';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  answers: { questionId: string; answer: string; isCorrect: boolean }[];
}

interface QuizInterfacePageProps {
  quizId: number;
}

export default function QuizInterfacePage({ quizId }: QuizInterfacePageProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentAttemptId, setCurrentAttemptId] = useState<string | null>(null);

  useEffect(() => {
    loadQuizQuestions();
  }, [quizId]);

  const loadQuizQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await quizService.getQuizQuestions(quizId);
      if (response.success && response.data) {
        setQuestions(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des questions');
    } finally {
      setLoading(false);
    }
  };

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isQuizStarted && !isQuizCompleted) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isQuizStarted, isQuizCompleted]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Chargement des questions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadQuizQuestions} variant="outline">
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Vérification de sécurité
  if (!currentQuestion || questions.length === 0) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground">Erreur</h1>
          <p className="text-muted-foreground">Aucune question trouvée pour ce quiz</p>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startQuiz = async () => {
    try {
      const response = await quizService.startQuizAttempt(quizId);
      if (response.success && response.data) {
        setCurrentAttemptId(response.data.id);
        setIsQuizStarted(true);
        setTimeSpent(0);
        setCurrentQuestionIndex(0);
        setAnswers({});
        setIsQuizCompleted(false);
        setShowResults(false);
        setQuizResult(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du démarrage du quiz');
    }
  };

  const handleAnswerChange = async (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));

    // Sauvegarder la réponse si une tentative est en cours
    if (currentAttemptId) {
      try {
        await quizService.submitAnswer(currentAttemptId, currentQuestion.id, answer);
      } catch (err) {
        console.error('Erreur lors de la sauvegarde de la réponse:', err);
      }
    }
  };

  const goToNextQuestion = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      completeQuiz();
    }
  };

  const goToPreviousQuestion = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const completeQuiz = async () => {
    if (currentAttemptId) {
      try {
        const response = await quizService.completeQuizAttempt(currentAttemptId);
        if (response.success && response.data) {
          setIsQuizCompleted(true);
          setQuizResult({
            score: response.data.score,
            totalQuestions: questions.length,
            correctAnswers: response.data.answers.filter(a => a.isCorrect).length,
            timeSpent: response.data.timeSpent,
            answers: response.data.answers
          });
          setShowResults(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors de la finalisation du quiz');
      }
    } else {
      // Fallback si pas d'API
      setIsQuizCompleted(true);
      calculateResults();
    }
  };

  const calculateResults = () => {
    const correctAnswers = questions.filter(q => 
      answers[q.id] === q.correctAnswer
    ).length;
    
    const score = Math.round((correctAnswers / questions.length) * 100);
    
    const result: QuizResult = {
      score,
      totalQuestions: questions.length,
      correctAnswers,
      timeSpent,
      answers: questions.map(q => ({
        questionId: q.id,
        answer: answers[q.id] || '',
        isCorrect: answers[q.id] === q.correctAnswer
      }))
    };
    
    setQuizResult(result);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setIsQuizStarted(false);
    setIsQuizCompleted(false);
    setShowResults(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeSpent(0);
    setQuizResult(null);
    setShowExplanation(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Excellent ! 🎉';
    if (score >= 80) return 'Très bien ! 👏';
    if (score >= 60) return 'Bien ! 👍';
    return 'Continuez à vous entraîner ! 💪';
  };

  if (!isQuizStarted) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
                <Brain className="h-8 w-8 text-primary" />
                <span>Quiz Interactif</span>
              </CardTitle>
              <CardDescription className="text-lg">
                Testez vos connaissances avec ce quiz interactif
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border border-border rounded-lg">
                  <Target className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{questions.length}</div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                </div>
                <div className="text-center p-4 border border-border rounded-lg">
                  <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">
                    {Math.ceil(questions.length * 1.5)} min
                  </div>
                  <div className="text-sm text-muted-foreground">Durée estimée</div>
                </div>
                <div className="text-center p-4 border border-border rounded-lg">
                  <Trophy className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">
                    {questions.reduce((sum, q) => sum + q.points, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Points total</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Instructions :</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Lisez chaque question attentivement</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Choisissez la meilleure réponse</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Vous pouvez naviguer entre les questions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Le quiz se termine automatiquement</span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <Button onClick={startQuiz} size="lg" className="px-8">
                  <Play className="h-5 w-5 mr-2" />
                  Commencer le Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showResults && quizResult) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <span>Résultats du Quiz</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score principal */}
              <div className="text-center p-8 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg">
                <div className={`text-6xl font-bold ${getScoreColor(quizResult.score)}`}>
                  {quizResult.score}%
                </div>
                <div className="text-xl font-semibold text-foreground mt-2">
                  {getScoreMessage(quizResult.score)}
                </div>
                <div className="text-muted-foreground mt-2">
                  {quizResult.correctAnswers} sur {quizResult.totalQuestions} questions correctes
                </div>
              </div>

              {/* Statistiques détaillées */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border border-border rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{quizResult.correctAnswers}</div>
                  <div className="text-sm text-muted-foreground">Bonnes Réponses</div>
                </div>
                <div className="text-center p-4 border border-border rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{formatTime(quizResult.timeSpent)}</div>
                  <div className="text-sm text-muted-foreground">Temps Écoulé</div>
                </div>
                <div className="text-center p-4 border border-border rounded-lg">
                  <div className="text-2xl font-bold text-foreground">
                    {Math.round(quizResult.timeSpent / quizResult.totalQuestions)}s
                  </div>
                  <div className="text-sm text-muted-foreground">Temps par Question</div>
                </div>
              </div>

              {/* Détail des réponses */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">Détail des Réponses</h3>
                <div className="space-y-4">
                  {questions.map((question, index) => {
                    const userAnswer = quizResult.answers.find(a => a.questionId === question.id);
                    const isCorrect = userAnswer?.isCorrect || false;
                    
                    return (
                      <div key={question.id} className="p-4 border border-border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-foreground">
                            Question {index + 1}: {question.question}
                          </h4>
                          <div className="flex items-center space-x-2">
                            {isCorrect ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                            <Badge variant={isCorrect ? 'default' : 'destructive'}>
                              {isCorrect ? 'Correct' : 'Incorrect'}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-muted-foreground">Votre réponse: </span>
                            <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                              {userAnswer?.answer || 'Non répondue'}
                            </span>
                          </div>
                          {!isCorrect && (
                            <div>
                              <span className="font-medium text-muted-foreground">Bonne réponse: </span>
                              <span className="text-green-600">{question.correctAnswer}</span>
                            </div>
                          )}
                          <div>
                            <span className="font-medium text-muted-foreground">Explication: </span>
                            <span className="text-foreground">{question.explanation}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-center space-x-4">
                <Button onClick={resetQuiz} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Recommencer
                </Button>
                <Button onClick={() => setShowExplanation(!showExplanation)}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  {showExplanation ? 'Masquer' : 'Voir'} les Explications
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header avec progression */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-foreground">Quiz en Cours</h1>
              <Badge variant="outline">
                Question {currentQuestionIndex + 1} sur {questions.length}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeSpent)}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Target className="h-4 w-4" />
                <span>{currentQuestion.points} points</span>
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {currentQuestion.question}
            </CardTitle>
            <CardDescription>
              Type: {currentQuestion.type === 'multiple-choice' ? 'Choix multiple' : 
                     currentQuestion.type === 'true-false' ? 'Vrai/Faux' : 'Texte libre'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Réponse selon le type */}
            {currentQuestion.type === 'multiple-choice' && (
              <RadioGroup
                value={answers[currentQuestion.id] || ''}
                onValueChange={handleAnswerChange}
                className="space-y-3"
              >
                {currentQuestion.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="text-sm cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQuestion.type === 'true-false' && (
              <RadioGroup
                value={answers[currentQuestion.id] || ''}
                onValueChange={handleAnswerChange}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Vrai" id="true" />
                  <Label htmlFor="true" className="text-sm cursor-pointer">Vrai</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Faux" id="false" />
                  <Label htmlFor="false" className="text-sm cursor-pointer">Faux</Label>
                </div>
              </RadioGroup>
            )}

            {currentQuestion.type === 'text' && (
              <Textarea
                placeholder="Tapez votre réponse ici..."
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="min-h-[100px]"
              />
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={goToPreviousQuestion}
                disabled={isFirstQuestion}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Précédent
              </Button>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {Object.keys(answers).length} / {questions.length} répondues
                </span>
              </div>

              <Button
                onClick={goToNextQuestion}
                disabled={!answers[currentQuestion.id] && currentQuestion.type !== 'text'}
              >
                {isLastQuestion ? 'Terminer' : 'Suivant'}
                {isLastQuestion ? (
                  <Trophy className="h-4 w-4 ml-2" />
                ) : (
                  <ArrowRight className="h-4 w-4 ml-2" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
