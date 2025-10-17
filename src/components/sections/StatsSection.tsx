import { AnimatedSection } from '../ui';
import { motion } from 'framer-motion';

interface Stat {
  value: string;
  label: string;
}

interface StatsSectionProps {
  stats: Stat[];
}

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <div className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <div className="text-center">
                <motion.div 
                  className="text-3xl md:text-4xl font-bold text-[#E3AC02] mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm md:text-base text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
}
