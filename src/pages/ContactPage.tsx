import { 
  ContactHeroSection,
  ContactInfoSection,
  ContactForm,
  FAQSection,
  ContactCTASection
} from '../components/sections';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock
} from 'lucide-react';

export default function ContactPage() {
  // Configuration des données
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "contact@yello.africa",
      description: "Réponse sous 24h"
    },
    {
      icon: Phone,
      title: "Téléphone",
      value: "+221 33 XXX XX XX",
      description: "Lun-Ven 8h-18h (GMT)"
    },
    {
      icon: MapPin,
      title: "Adresse",
      value: "Dakar, Sénégal",
      description: "Siège social"
    },
    {
      icon: Clock,
      title: "Support",
      value: "7j/7",
      description: "Support technique"
    }
  ];

  const faqs = [
    {
      question: "Comment puis-je commencer à utiliser Yello ?",
      answer: "Créez simplement un compte gratuit et uploadez votre premier PDF pour générer une leçon interactive."
    },
    {
      question: "Yello fonctionne-t-il hors ligne ?",
      answer: "Oui, une fois vos cours générés, vous pouvez les consulter et les partager même avec une connexion limitée."
    },
    {
      question: "Puis-je utiliser Yello sur mon téléphone ?",
      answer: "Absolument ! Yello est optimisé pour les smartphones et fonctionne parfaitement sur tous les appareils mobiles."
    },
    {
      question: "Quels types de fichiers sont supportés ?",
      answer: "Nous supportons les PDF, Word, et documents texte. L'IA analyse le contenu pour créer des leçons adaptées."
    }
  ];

  // Gestionnaire de soumission du formulaire
  const handleFormSubmit = async (formData: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    role: 'teacher' | 'student' | 'parent' | 'admin' | 'other';
  }) => {
    // Simulation d'envoi (remplacer par vraie logique API)
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Formulaire soumis:', formData);
  };

  return (
    <div className="min-h-screen bg-background">
      <ContactHeroSection 
        title="Contactez"
        subtitle="Nous sommes là pour vous accompagner dans votre transformation éducative"
        description="Que vous soyez enseignant, parent, ou responsable d'établissement, notre équipe est à votre écoute pour répondre à vos questions."
      />
      
      <ContactInfoSection contactInfo={contactInfo} />
      
      {/* Main Content */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ContactForm onSubmit={handleFormSubmit} />
            
            <FAQSection 
              faqs={faqs}
              title="Questions fréquentes"
              subtitle="Trouvez rapidement des réponses aux questions les plus courantes."
              communityTitle="Besoin d'aide immédiate ?"
              communityDescription="Rejoignez notre communauté d'utilisateurs sur WhatsApp pour obtenir de l'aide en temps réel."
              communityButtonText="Rejoindre la communauté"
            />
          </div>
        </div>
      </div>
      
      <ContactCTASection 
        title="Prêt à transformer votre éducation ?"
        subtitle="Découvrez comment Yello peut révolutionner votre façon d'enseigner et d'apprendre."
        primaryButtonText="Commencer gratuitement"
        secondaryButtonText="Découvrir Yello"
      />
    </div>
  );
}
