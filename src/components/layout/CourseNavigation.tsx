import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { ROUTES } from '../../constants';
import { BookOpen, HelpCircle } from 'lucide-react';

interface CourseNavigationProps {
  className?: string;
}

export default function CourseNavigation({ className = '' }: CourseNavigationProps) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'courses' | 'quiz'>(
    location.pathname.includes('quiz') ? 'quiz' : 'courses'
  );

  const handleTabChange = (tab: 'courses' | 'quiz') => {
    setActiveTab(tab);
  };

  return (
    <div className={`flex items-center space-x-1 bg-muted/30 p-1 rounded-lg ${className}`}>
      <Link to={ROUTES.TEACHER_COURSES}>
        <Button
          variant={activeTab === 'courses' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleTabChange('courses')}
          className={`flex items-center space-x-2 px-4 py-2 ${
            activeTab === 'courses'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span className="font-medium">Cours</span>
        </Button>
      </Link>
      
      <Link to={ROUTES.TEACHER_QUIZ}>
        <Button
          variant={activeTab === 'quiz' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleTabChange('quiz')}
          className={`flex items-center space-x-2 px-4 py-2 ${
            activeTab === 'quiz'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          <span className="font-medium">Quiz</span>
        </Button>
      </Link>
    </div>
  );
}
