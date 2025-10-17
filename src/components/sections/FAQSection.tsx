import { Button, Card, CardHeader, CardTitle, CardContent } from '../ui';
import { MessageCircle, Users, Globe } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
  title: string;
  subtitle: string;
  communityTitle: string;
  communityDescription: string;
  communityButtonText: string;
}

export function FAQSection({ 
  faqs, 
  title, 
  subtitle, 
  communityTitle, 
  communityDescription, 
  communityButtonText 
}: FAQSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold flex items-center">
          <MessageCircle className="h-8 w-8 text-[#E3AC02] mr-3" />
          {title}
        </CardTitle>
        <p className="text-muted-foreground">
          {subtitle}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-l-4 border-[#E3AC02]/20 pl-4">
              <h4 className="font-semibold text-foreground mb-2">
                {faq.question}
              </h4>
              <p className="text-muted-foreground text-sm">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="h-6 w-6 text-[#E3AC02]" />
            <h4 className="font-semibold text-foreground">
              {communityTitle}
            </h4>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            {communityDescription}
          </p>
          <Button variant="outline" className="w-full">
            <Globe className="h-4 w-4 mr-2" />
            {communityButtonText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
