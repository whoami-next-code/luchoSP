'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: 'Soluciones Industriales',
    subtitle: 'Equipos y maquinaria de alta calidad',
    description: 'Ofrecemos las mejores soluciones en equipos industriales para optimizar tus procesos productivos.',
    image: '/home2/img/banner-2-1.webp',
    ctaText: 'Ver catálogo',
    ctaLink: '/catalogo'
  },
  {
    id: 2,
    title: 'Calidad y Eficiencia',
    subtitle: 'Tecnología de vanguardia',
    description: 'Productos diseñados para maximizar la eficiencia y garantizar la calidad en cada proceso.',
    image: '/home2/img/banner-2-2.jpg',
    ctaText: 'Ver productos',
    ctaLink: '/productos'
  },
  {
    id: 3,
    title: 'Servicio Técnico',
    subtitle: 'Soporte especializado',
    description: 'Contamos con un equipo técnico altamente calificado para brindarte el mejor servicio.',
    image: '/home2/img/banner-2-3.jpg',
    ctaText: 'Contactar',
    ctaLink: '/contacto'
  }
];

export default function Home2Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [isAnimating]);

  const handleNextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const handlePrevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <section className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.image}
              alt={`${slide.title} - ${slide.subtitle}`}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
            {/* Industrial pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 right-20 w-32 h-32 border-4 border-orange-500 rounded-full"></div>
              <div className="absolute top-40 right-40 w-16 h-16 bg-orange-500 rounded-lg transform rotate-45"></div>
              <div className="absolute bottom-32 left-20 w-24 h-24 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-20 left-40 w-12 h-12 bg-white rounded-lg transform rotate-12"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Column - Main Content */}
            <div className="text-white space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="block animate-fade-in-up">{slides[currentSlide].title}</span>
                  <span className="block text-orange-400 text-2xl md:text-3xl lg:text-4xl font-medium mt-2">
                    {slides[currentSlide].subtitle}
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-200 max-w-lg animate-fade-in-up animation-delay-200">
                  {slides[currentSlide].description}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-400">
                <Link
                  href={slides[currentSlide].ctaLink}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:scale-105 inline-flex items-center justify-center"
                >
                  {slides[currentSlide].ctaText}
                </Link>
                <Link
                  href="/nosotros"
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 inline-flex items-center justify-center"
                >
                  Conocer más
                </Link>
              </div>
            </div>

            {/* Right Column - Side Content */}
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-4">Calidad y Eficiencia</h3>
                <p className="text-gray-200 mb-6">
                  Nuestros productos están diseñados para ofrecer el máximo rendimiento y durabilidad en los entornos industriales más exigentes.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400">15+</div>
                    <div className="text-sm text-gray-300">Años de experiencia</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400">500+</div>
                    <div className="text-sm text-gray-300">Clientes satisfechos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <button
        onClick={handlePrevSlide}
        disabled={isAnimating}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-full transition-all duration-300 hover:scale-110 z-20 focus:outline-none focus:ring-2 focus:ring-orange-500"
        aria-label="Slide anterior"
        type="button"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={handleNextSlide}
        disabled={isAnimating}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-full transition-all duration-300 hover:scale-110 z-20 focus:outline-none focus:ring-2 focus:ring-orange-500"
        aria-label="Slide siguiente"
        type="button"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isAnimating}
            className={`w-3 h-3 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              index === currentSlide
                ? 'bg-orange-500 w-8'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Ir al slide ${index + 1} de ${slides.length}`}
            aria-current={index === currentSlide ? 'true' : 'false'}
            type="button"
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
