'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks';
import { Testimonial } from '@/types';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.1 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, testimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        goToPrevious();
        break;
      case 'ArrowRight':
        goToNext();
        break;
      case ' ':
        e.preventDefault();
        setIsPaused(!isPaused);
        break;
    }
  };

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
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section
      ref={ref as any}
      className="py-20 bg-blue-50"
      aria-labelledby="testimonials-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2
            id="testimonials-heading"
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            La satisfacción de nuestros clientes es nuestra mayor recompensa. Conoce sus experiencias trabajando con nosotros.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isIntersecting ? 'visible' : 'hidden'}
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-label="Carrusel de testimonios"
        >
          {/* Testimonial Carousel */}
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="relative h-96 md:h-80">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="absolute inset-0 p-8 md:p-12 flex items-center justify-center"
                >
                  <div className="text-center max-w-2xl">
                    {/* Quote Icon */}
                    <div className="flex justify-center mb-6">
                      <Quote className="w-12 h-12 text-blue-600 opacity-50" />
                    </div>

                    {/* Testimonial Text */}
                    <blockquote className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
                      "{testimonials[currentIndex].content}"
                    </blockquote>

                    {/* Author Info */}
                    <div className="flex items-center justify-center space-x-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                        <Image
                          src={testimonials[currentIndex].image}
                          alt={testimonials[currentIndex].name}
                          fill
                          className="object-cover"
                          sizes="64px"
                          quality={85}
                        />
                      </div>
                      <div className="text-left">
                        <cite className="text-lg font-semibold text-gray-900 not-italic">
                          {testimonials[currentIndex].name}
                        </cite>
                        <p className="text-gray-600">
                          {testimonials[currentIndex].role} - {testimonials[currentIndex].company}
                        </p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex justify-center mt-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < testimonials[currentIndex].rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
              aria-label="Testimonio anterior"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
              aria-label="Siguiente testimonio"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2" role="tablist">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  index === currentIndex
                    ? 'bg-blue-600'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                role="tab"
                aria-selected={index === currentIndex}
                aria-label={`Ir al testimonio ${index + 1}`}
              />
            ))}
          </div>

          {/* Keyboard Instructions */}
          <div className="sr-only" aria-live="polite">
            Testimonio {currentIndex + 1} de {testimonials.length}. 
            Use las flechas para navegar o espacio para pausar.
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600">Clientes Satisfechos</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
            <div className="text-gray-600">Años de Experiencia</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
            <div className="text-gray-600">Tasa de Satisfacción</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
