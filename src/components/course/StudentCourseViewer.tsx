import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  BookOpen, 
  Clock, 
  Users, 
  ArrowRight, 
  CheckCircle,
  PlayCircle,
  FileText,
  Star
} from 'lucide-react';
import type { Course, Module } from '../../types/course';

interface StudentCourseViewerProps {
  course: Course;
  onStartQuiz?: (moduleId: string) => void;
  onModuleChange?: (moduleId: string) => void;
  studentProgress?: {
    completedModules: string[];
    completedSections: string[];
    quizScores: Record<string, number>;
  };
}

export default function StudentCourseViewer({ 
  course, 
  onStartQuiz, 
  onModuleChange,
  studentProgress 
}: StudentCourseViewerProps) {
  const navigate = useNavigate();
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const currentModule = course.modules?.[currentModuleIndex];
  const sections = currentModule ? parseModuleSections(currentModule.content) : [];

  const handleModuleChange = (index: number) => {
    setCurrentModuleIndex(index);
    setCurrentSectionIndex(0);
    if (onModuleChange && course.modules?.[index]) {
      onModuleChange(course.modules[index]._id);
    }
  };

  const handleStartQuiz = () => {
    if (onStartQuiz && currentModule) {
      onStartQuiz(currentModule._id);
    }
  };

  const getModuleProgress = (moduleIndex: number) => {
    const module = course.modules?.[moduleIndex];
    if (!module || !studentProgress) return 0;
    
    const isCompleted = studentProgress.completedModules.includes(module._id);
    if (isCompleted) return 100;
    
    const totalSections = parseModuleSections(module.content).length;
    const completedCount = studentProgress.completedSections.filter(id => 
      id.startsWith(`${moduleIndex}-`)
    ).length;
    
    return totalSections > 0 ? (completedCount / totalSections) * 100 : 0;
  };

  const getModuleQuizScore = (moduleIndex: number) => {
    const module = course.modules?.[moduleIndex];
    if (!module || !studentProgress) return null;
    
    return studentProgress.quizScores[module._id] || null;
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'Non défini';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const isModuleCompleted = (moduleIndex: number) => {
    const module = course.modules?.[moduleIndex];
    return module && studentProgress?.completedModules.includes(module._id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
              <p className="text-gray-600 mt-1">{course.subject}</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(course.duration)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{course.studentCount} étudiant{course.studentCount > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Navigation des modules */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Modules</h3>
                <div className="space-y-2">
                  {course.modules?.map((module, index) => {
                    const isCompleted = isModuleCompleted(index);
                    const quizScore = getModuleQuizScore(index);
                    
                    return (
                      <div key={module._id} className="space-y-2">
                        <Button
                          variant={currentModuleIndex === index ? "default" : "ghost"}
                          className="w-full justify-start text-left h-auto p-3"
                          onClick={() => handleModuleChange(index)}
                        >
                          <div className="flex items-center gap-2 w-full">
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <PlayCircle className="h-4 w-4" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">
                                Module {index + 1}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {module.name}
                              </div>
                            </div>
                            {quizScore !== null && (
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500" />
                                <span className="text-xs font-medium">{quizScore}%</span>
                              </div>
                            )}
                          </div>
                        </Button>
                        
                        {/* Progress bar for module */}
                        <div className="ml-6">
                          <Progress 
                            value={getModuleProgress(index)} 
                            className="h-1"
                          />
                          <div className="text-xs text-muted-foreground mt-1">
                            {Math.round(getModuleProgress(index))}% complété
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content area */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Module navigation tabs */}
              <div className="flex gap-2">
                {course.modules?.map((module, index) => {
                  const isCompleted = isModuleCompleted(index);
                  const quizScore = getModuleQuizScore(index);
                  
                  return (
                    <Button
                      key={module._id}
                      variant={currentModuleIndex === index ? "default" : "outline"}
                      onClick={() => handleModuleChange(index)}
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Module {index + 1}
                      {isCompleted && (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      )}
                      {quizScore !== null && (
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {quizScore}%
                        </Badge>
                      )}
                    </Button>
                  );
                })}
              </div>

              {/* Course/Quiz navigation */}
              <div className="flex items-center justify-between border-b">
                <div className="flex gap-6">
                  <Button variant="ghost" className="border-b-2 border-primary rounded-none">
                    Cours
                  </Button>
                  <Button variant="ghost" className="rounded-none">
                    Quiz
                  </Button>
                </div>
              </div>

              {/* Module content */}
              {currentModule && (
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Module title */}
                      <div className="text-center">
                        <h2 className="text-3xl font-bold uppercase text-gray-900 mb-2">
                          {currentModule.name}
                        </h2>
                        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                          <Badge variant="outline">
                            {formatDuration(currentModule.duration)}
                          </Badge>
                          <span>Module {currentModuleIndex + 1}</span>
                          {isModuleCompleted(currentModuleIndex) && (
                            <Badge variant="default" className="bg-green-500">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Terminé
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Module content */}
                      <div 
                        className="prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: currentModule.content }}
                      />

                      {/* Quiz button */}
                      <div className="flex justify-center pt-6">
                        <Button 
                          onClick={handleStartQuiz}
                          size="lg"
                          className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3"
                        >
                          Passer au quiz
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to parse module content into sections
function parseModuleSections(content: string): string[] {
  // Simple parsing - in a real app, you'd want more sophisticated parsing
  const sections = content.split(/<h[1-6][^>]*>/i);
  return sections.filter(section => section.trim().length > 0);
}
