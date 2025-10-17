import { Link } from 'react-router-dom';
import { Button } from '../ui';
import { ROUTES } from '../../constants';

interface ContactCTASectionProps {
  title: string;
  subtitle: string;
  primaryButtonText: string;
  secondaryButtonText: string;
}

export function ContactCTASection({ 
  title, 
  subtitle, 
  primaryButtonText, 
  secondaryButtonText 
}: ContactCTASectionProps) {
  return (
    <div className="py-20 bg-gradient-to-r from-[#E3AC02] to-[#E3AC02]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          {title}
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-4">
            <Link to={ROUTES.REGISTER}>
              {primaryButtonText}
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4 border-white bg-transparent text-white hover:bg-white hover:text-[#E3AC02]">
            <Link to={ROUTES.HOME}>
              {secondaryButtonText}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
