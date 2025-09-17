import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui';
import { Button } from '../components/ui';
import { ROUTES } from '../constants';
import { 
  Globe, 
  Users, 
  Target, 
  Heart, 
  BookOpen, 
  Smartphone, 
  Brain, 
  TrendingUp,
  CheckCircle,
  Star,
  Award,
  Zap
} from 'lucide-react';

export default function AboutPage() {
  const features = [
    {
      icon: Brain,
      title: "IA Pédagogique",
      description: "Transformez vos PDF en leçons interactives avec l'intelligence artificielle"
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Optimisé pour les smartphones et les connexions lentes d'Afrique"
    },
    {
      icon: BookOpen,
      title: "Classes Virtuelles",
      description: "Créez et gérez vos classes en ligne facilement"
    },
    {
      icon: TrendingUp,
      title: "Suivi en Temps Réel",
      description: "Quiz auto-corrigés et rapports automatiques aux parents"
    }
  ];

  const stats = [
    { label: "Enseignants formés", value: "2,500+" },
    { label: "Élèves impactés", value: "50,000+" },
    { label: "Cours générés", value: "15,000+" },
    { label: "Pays d'Afrique", value: "12" }
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion pour l'Éducation",
      description: "Nous croyons que chaque enfant mérite une éducation de qualité, peu importe où il se trouve."
    },
    {
      icon: Globe,
      title: "Adaptation Locale",
      description: "Nos solutions sont conçues spécifiquement pour les réalités africaines et les défis locaux."
    },
    {
      icon: Users,
      title: "Communauté",
      description: "Nous construisons une communauté d'enseignants passionnés qui s'entraident et partagent leurs connaissances."
    },
    {
      icon: Target,
      title: "Impact Mesurable",
      description: "Chaque fonctionnalité est conçue pour avoir un impact concret sur l'apprentissage des élèves."
    }
  ];

  const achievements = [
    {
      icon: Award,
      title: "Prix Innovation Éducation 2024",
      description: "Reconnu pour l'innovation dans l'éducation numérique africaine"
    },
    {
      icon: Star,
      title: "4.8/5 Étoiles",
      description: "Note moyenne des enseignants utilisateurs"
    },
    {
      icon: CheckCircle,
      title: "95% Satisfaction",
      description: "Taux de satisfaction des utilisateurs"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-background via-background to-muted py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              À propos de{' '}
              <span className="text-[#E3AC02]">
                Yello
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
              Révolutionner l'éducation en Afrique avec l'intelligence artificielle
            </p>
            <p className="text-lg text-muted-foreground/80 mb-8 max-w-2xl mx-auto">
              Nous transformons la façon dont les enseignants créent des contenus pédagogiques 
              et dont les élèves apprennent, en rendant l'éducation plus accessible et interactive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8 py-4">
                <Link to={ROUTES.CONTACT}>
                  Nous contacter
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-lg px-8 py-4">
                <Link to={ROUTES.HOME}>
                  Découvrir Yello
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#E3AC02] mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Notre Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Dans de nombreux établissements en Afrique, les enseignants font face à une triple difficulté : 
                ils passent un temps considérable à produire leurs contenus pédagogiques, souvent manuellement, 
                sans appui technologique adapté à leur contexte.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Yello Studio permet à tout enseignant de transformer instantanément ses cours (PDF, Word, notes) 
                en leçons pédagogiques interactives grâce à l'IA, et de suivre la progression de ses apprenants 
                en temps réel.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-[#E3AC02]" />
                  <span className="text-foreground">Réduire la charge de travail des enseignants</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-[#E3AC02]" />
                  <span className="text-foreground">Rendre l'éducation plus accessible et interactive</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-[#E3AC02]" />
                  <span className="text-foreground">Renforcer l'implication des parents</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#E3AC02]/10 to-[#E3AC02]/5 rounded-2xl p-8 border border-[#E3AC02]/20">
                <div className="text-center">
                  <Zap className="h-16 w-16 text-[#E3AC02] mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Innovation Continue
                  </h3>
                  <p className="text-muted-foreground">
                    Nous utilisons les dernières technologies d'IA et de EdTech pour créer 
                    des solutions adaptées aux réalités africaines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Nos Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Des outils puissants et simples pour transformer l'éducation en Afrique
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-[#E3AC02]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-[#E3AC02]" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Nos Valeurs
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Les principes qui guident notre mission d'éducation en Afrique
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Nos Réalisations
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Des résultats concrets qui témoignent de notre impact
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {achievement.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {achievement.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-[#E3AC02] to-[#E3AC02]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Rejoignez la Révolution Éducative
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Découvrez comment Yello peut transformer votre façon d'enseigner et d'apprendre.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-4">
              <Link to={ROUTES.REGISTER}>
                Commencer gratuitement
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4 border-white bg-transparent text-white hover:bg-white hover:text-[#E3AC02]">
              <Link to={ROUTES.CONTACT}>
                Demander une démo
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
