import { Link } from 'react-router-dom';
import { Button, AnimatedSection } from '../ui';
import { ROUTES } from '../../constants';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

interface HeroSectionProps {
  isAuthenticated: boolean;
  userName?: string | undefined;
}

export function HeroSection({ isAuthenticated, userName }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-[#E3AC02]/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <AnimatedSection delay={0.2}>
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-foreground mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Bienvenue sur{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E3AC02] to-[#E3AC02]/80">
                Yello
              </span>
            </motion.h1>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
              La plateforme d'éducation numérique qui révolutionne l'apprentissage en Afrique
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.6}>
            <p className="text-lg text-muted-foreground/80 mb-12 max-w-2xl mx-auto">
              Transformez vos contenus pédagogiques en leçons interactives avec l'IA, 
              créez des classes virtuelles et suivez la progression de vos élèves en temps réel.
            </p>
          </AnimatedSection>
          
          <AnimatedSection delay={0.8}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              {isAuthenticated ? (
                <>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size="lg" asChild className="text-lg px-8 py-4 bg-[#E3AC02] hover:bg-[#E3AC02]/90">
                      <Link to={ROUTES.DASHBOARD}>
                        Aller au tableau de bord
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </motion.div>
                  <p className="text-sm text-muted-foreground">
                    Connecté en tant que {userName}
                  </p>
                </>
              ) : (
                <>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size="lg" asChild className="text-lg px-8 py-4 bg-[#E3AC02] hover:bg-[#E3AC02]/90">
                      <Link to={ROUTES.REGISTER}>
                        Commencer gratuitement
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" size="lg" asChild className="text-lg px-8 py-4">
                      <Link to={ROUTES.LOGIN}>
                        Se connecter
                      </Link>
                    </Button>
                  </motion.div>
                </>
              )}
            </div>
          </AnimatedSection>

          {/* Demo Video Section */}
          <AnimatedSection delay={1.0}>
            <motion.div 
              className="relative max-w-4xl mx-auto"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-r from-[#E3AC02]/20 to-primary/20 p-1">
                <div className="bg-background rounded-xl p-8 text-center">
                  <div className="w-20 h-20 bg-[#E3AC02]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="h-8 w-8 text-[#E3AC02] ml-1" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Découvrez Yello en action
                  </h3>
                  <p className="text-muted-foreground">
                    Regardez comment transformer un PDF en leçon interactive en 2 minutes
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
