import { Link } from 'react-router-dom';
import { Button, AnimatedSection } from '../ui';
import { ROUTES } from '../../constants';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  title: string;
  subtitle: string;
  isAuthenticated: boolean;
}

export function CTASection({ title, subtitle, isAuthenticated }: CTASectionProps) {
  return (
    <div className="py-24 bg-gradient-to-r from-[#E3AC02] to-[#E3AC02]/80 relative overflow-hidden">
      {/* Background Animation */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)"
          ]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection>
          <h2 className="text-4xl font-bold text-white mb-4">
            {title}
          </h2>
        </AnimatedSection>
        
        <AnimatedSection delay={0.2}>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </AnimatedSection>
        
        {!isAuthenticated && (
          <AnimatedSection delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-4">
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
                <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4 border-white bg-transparent text-white hover:bg-white hover:text-[#E3AC02]">
                  <Link to={ROUTES.ABOUT}>
                    En savoir plus
                  </Link>
                </Button>
              </motion.div>
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
