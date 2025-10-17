import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  XCircle,
  Clock,
  BookOpen
} from 'lucide-react';
import type { QCMQuestion, ShortAnswerQuestion, FillInTheBlanksQuestion } from '../../types/course';

interface QuizInterfaceProps {
  moduleId: string;
  moduleName: string;
  qcmQuestions?: QCMQuestion[];
  shortAnswerQuestions?: ShortAnswerQuestion[];
  fillInTheBlanksQuestions?: FillInTheBlanksQuestion[];
  onComplete?: (results: QuizResults) => void;
  onBack?: () => void;
}

interface QuizResults {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeSpent: number;
  answers: QuizAnswer[];
}

interface QuizAnswer {
  questionId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  type: 'qcm' | 'short_answer' | 'fill_in_the_blanks';
}

export default function QuizInterface({
  moduleId,
  moduleName,
  qcmQuestions = [],
  shortAnswerQuestions = [],
  fillInTheBlanksQuestions = [],
  onComplete,
  onBack
}: QuizInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, string>>(new Map());
  const [showResults, setShowResults] = useState(false);
  const [startTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);

  // Combine all questions
  const allQuestions = [
    ...qcmQuestions.map((q, i) => ({ ...q, id: `qcm-${i}`, type: 'qcm' as const })),
    ...shortAnswerQuestions.map((q, i) => ({ ...q, id: `short-${i}`, type: 'short_answer' as const })),
    ...fillInTheBlanksQuestions.map((q, i) => ({ ...q, id: `fill-${i}`, type: 'fill_in_the_blanks' as const }))
  ];

  const currentQuestion = allQuestions[currentQuestionIndex];
  const totalQuestions = allQuestions.length;

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => new Map(prev.set(questionId, answer)));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    const results = calculateResults();
    setShowResults(true);
    if (onComplete) {
      onComplete(results);
    }
  };

  const calculateResults = (): QuizResults => {
    const quizAnswers: QuizAnswer[] = [];
    let correctCount = 0;

    allQuestions.forEach(question => {
      const userAnswer = answers.get(question.id) || '';
      let correctAnswer = '';
      let isCorrect = false;

      switch (question.type) {
        case 'qcm':
          const qcmQ = question as QCMQuestion & { id: string };
          const correctChoice = qcmQ.choices.find(choice => choice.isCorrect);
          correctAnswer = correctChoice?.text || '';
          isCorrect = userAnswer === correctAnswer;
          break;
        case 'short_answer':
          const shortQ = question as ShortAnswerQuestion & { id: string };
          correctAnswer = shortQ.answer;
          isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
          break;
        case 'fill_in_the_blanks':
          const fillQ = question as FillInTheBlanksQuestion & { id: string };
          correctAnswer = fillQ.answer;
          isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
          break;
      }

      if (isCorrect) correctCount++;

      quizAnswers.push({
        questionId: question.id,
        question: question.question || question.sentence || '',
        userAnswer,
        correctAnswer,
        isCorrect,
        type: question.type
      });
    });

    return {
      totalQuestions,
      correctAnswers: correctCount,
      score: Math.round((correctCount / totalQuestions) * 100),
      timeSpent,
      answers: quizAnswers
    };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case 'qcm':
        const qcmQ = currentQuestion as QCMQuestion & { id: string };
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{qcmQ.question}</h3>
            <RadioGroup
              value={answers.get(qcmQ.id) || ''}
              onValueChange={(value) => handleAnswerChange(qcmQ.id, value)}
            >
              {qcmQ.choices.map((choice, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={choice.text} id={`${qcmQ.id}-${index}`} />
                  <Label htmlFor={`${qcmQ.id}-${index}`} className="flex-1 cursor-pointer">
                    {choice.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 'short_answer':
        const shortQ = currentQuestion as ShortAnswerQuestion & { id: string };
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{shortQ.question}</h3>
            <div className="space-y-2">
              <Label htmlFor={`answer-${shortQ.id}`}>Votre réponse :</Label>
              <textarea
                id={`answer-${shortQ.id}`}
                value={answers.get(shortQ.id) || ''}
                onChange={(e) => handleAnswerChange(shortQ.id, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md resize-none"
                rows={4}
                placeholder="Votre réponse ici"
              />
            </div>
          </div>
        );

      case 'fill_in_the_blanks':
        const fillQ = currentQuestion as FillInTheBlanksQuestion & { id: string };
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{fillQ.sentence}</h3>
            <div className="space-y-2">
              <Label htmlFor={`answer-${fillQ.id}`}>Réponse :</Label>
              <input
                id={`answer-${fillQ.id}`}
                type="text"
                value={answers.get(fillQ.id) || ''}
                onChange={(e) => handleAnswerChange(fillQ.id, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="Votre réponse ici"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (showResults) {
    const results = calculateResults();
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Quiz Terminé !</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {results.score}%
              </div>
              <p className="text-gray-600">
                {results.correctAnswers} sur {results.totalQuestions} bonnes réponses
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold">{formatTime(results.timeSpent)}</div>
                <div className="text-sm text-gray-600">Temps écoulé</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold">{results.correctAnswers}</div>
                <div className="text-sm text-gray-600">Bonnes réponses</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Détail des réponses :</h4>
              {results.answers.map((answer, index) => (
                <div key={answer.questionId} className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {answer.isCorrect ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="font-medium">Question {index + 1}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{answer.question}</p>
                  <p className="text-sm">
                    <span className="font-medium">Votre réponse :</span> {answer.userAnswer || 'Aucune réponse'}
                  </p>
                  {!answer.isCorrect && (
                    <p className="text-sm text-green-600">
                      <span className="font-medium">Bonne réponse :</span> {answer.correctAnswer}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onBack} className="flex-1">
                Retour au cours
              </Button>
              <Button onClick={() => window.location.reload()} className="flex-1">
                Recommencer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-xl font-bold">{moduleName} - Quiz</h1>
                <p className="text-gray-600">Module 1</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeSpent)}</span>
              </div>
              <Badge variant="outline">
                Question {currentQuestionIndex + 1}/{totalQuestions}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-6">
            <Button variant="ghost" className="border-b-2 border-primary rounded-none">
              Quiz
            </Button>
            <Button variant="ghost" className="rounded-none">
              Cours
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-6">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progression</span>
                  <span>{Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%</span>
                </div>
                <Progress value={((currentQuestionIndex + 1) / totalQuestions) * 100} />
              </div>

              {/* Question content */}
              <div className="min-h-[300px]">
                {renderQuestion()}
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Précédent
                </Button>
                
                <Button
                  onClick={handleNext}
                  disabled={!answers.has(currentQuestion?.id || '')}
                >
                  {currentQuestionIndex === totalQuestions - 1 ? (
                    'Terminer'
                  ) : (
                    <>
                      Suivant
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
