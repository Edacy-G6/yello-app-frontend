import { useAuth } from '../hooks/useAuth';
import { 
  HeroSection, 
  StatsSection, 
  FeaturesSection, 
  TestimonialsSection, 
  CTASection 
} from '../components/sections';
import { 
  Brain, 
  Smartphone, 
  TrendingUp
} from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  // Configuration des données
  const stats = [
    { value: "2,500+", label: "Enseignants actifs" },
    { value: "50,000+", label: "Élèves impactés" },
    { value: "15,000+", label: "Cours générés" },
    { value: "12", label: "Pays d'Afrique" }
  ];

  const features = [
    {
      icon: Brain,
      title: "IA Pédagogique",
      description: "Transformez instantanément vos PDF et documents en leçons interactives grâce à l'intelligence artificielle.",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Optimisé pour les smartphones et les connexions lentes, accessible partout en Afrique.",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: TrendingUp,
      title: "Suivi en Temps Réel",
      description: "Quiz auto-corrigés, rapports automatiques aux parents et tableau de bord pédagogique complet.",
      color: "from-purple-500 to-pink-600"
    }
  ];

  const testimonials = [
    {
      name: "Amadou Diallo",
      role: "Enseignant de Mathématiques",
      content: "Yello a révolutionné ma façon d'enseigner. Je crée maintenant des leçons interactives en quelques minutes !",
      rating: 5
    },
    {
      name: "Fatou Sarr",
      role: "Directrice d'école",
      content: "Nos élèves sont plus engagés et les parents reçoivent des rapports détaillés. Une solution exceptionnelle.",
      rating: 5
    },
    {
      name: "Moussa Traoré",
      role: "Parent d'élève",
      content: "Je peux suivre les progrès de mon fils en temps réel. Yello nous a rapprochés de son éducation.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <HeroSection 
        isAuthenticated={isAuthenticated} 
        userName={user?.name} 
      />
      
      <StatsSection stats={stats} />
      
      <FeaturesSection 
        features={features}
        title="Pourquoi choisir Yello ?"
        subtitle="Une solution complète adaptée aux réalités africaines pour moderniser l'éducation"
      />
      
      <TestimonialsSection 
        testimonials={testimonials}
        title="Ce que disent nos utilisateurs"
        subtitle="Des milliers d'enseignants, parents et élèves font confiance à Yello"
      />
      
      <CTASection 
        title="Prêt à révolutionner votre enseignement ?"
        subtitle="Rejoignez des milliers d'enseignants qui utilisent déjà Yello pour créer un apprentissage plus interactif et efficace."
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}