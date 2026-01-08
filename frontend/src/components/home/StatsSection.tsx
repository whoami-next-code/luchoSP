'use client';

import { motion } from 'framer-motion';
import { useAnimatedCounter } from '@/hooks';
import { useIntersectionObserver } from '@/hooks';
import { Users, Award, Clock, TrendingUp } from 'lucide-react';

interface StatsSectionProps {
  stats: Array<{
    id: string;
    number: number;
    suffix: string;
    label: string;
    icon: string;
  }>;
}

const iconMap = {
  Users,
  Award,
  Clock,
  TrendingUp,
};

export default function StatsSection({ stats }: StatsSectionProps) {
  const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section
      ref={ref as any}
      className="py-20 bg-gradient-to-br from-blue-900 to-blue-700 text-white"
      aria-labelledby="stats-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2
            id="stats-heading"
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Nuestros Resultados
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Más de 15 años de experiencia respaldando la industria venezolana con soluciones innovadoras y confiables.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isIntersecting ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat) => {
            const IconComponent = iconMap[stat.icon as keyof typeof iconMap];
            const animatedValue = useAnimatedCounter(
              isIntersecting ? stat.number : 0,
              2000
            );

            return (
              <motion.div
                key={stat.id}
                variants={itemVariants}
                className="text-center group"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                      <IconComponent className="w-8 h-8" />
                    </div>
                  </div>

                  {/* Counter */}
                  <div className="mb-4">
                    <motion.div
                      className="text-4xl md:text-5xl font-bold mb-2"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {animatedValue}{stat.suffix}
                    </motion.div>
                    <div className="text-blue-100 text-lg">
                      {stat.label}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-white/20 rounded-full h-2 mt-4">
                    <motion.div
                      className="bg-white rounded-full h-2"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Calidad Garantizada</h3>
              <p className="text-blue-100 text-sm">
                Certificaciones ISO y estándares internacionales
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Soporte 24/7</h3>
              <p className="text-blue-100 text-sm">
                Asistencia técnica las 24 horas del día
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Entrega Rápida</h3>
              <p className="text-blue-100 text-sm">
                Entrega en todo el país en tiempo récord
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
