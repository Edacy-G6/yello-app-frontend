interface ContactHeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
}

export function ContactHeroSection({ title, subtitle, description }: ContactHeroSectionProps) {
  return (
    <div className="bg-gradient-to-br from-background via-background to-muted py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            {title}{' '}
            <span className="text-[#E3AC02]">
              Yello
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
            {subtitle}
          </p>
          <p className="text-lg text-muted-foreground/80 mb-8 max-w-2xl mx-auto">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
