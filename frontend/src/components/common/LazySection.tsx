import React, { useState, useEffect, useRef, useCallback } from 'react';

interface LazySectionProps {
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  placeholder?: React.ReactNode;
  className?: string;
  id?: string;
  onLoad?: () => void;
  minHeight?: string | number;
  fadeIn?: boolean;
  slideUp?: boolean;
  delay?: number;
}

const LazySection: React.FC<LazySectionProps> = ({
  children,
  threshold = 0.1,
  rootMargin = '50px',
  placeholder = null,
  className = '',
  id,
  onLoad,
  minHeight = '200px',
  fadeIn = true,
  slideUp = false,
  delay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isVisible) {
        setIsVisible(true);
        setHasLoaded(true);
        
        // Llamar callback si existe
        if (onLoad) {
          setTimeout(onLoad, delay);
        }
        
        // Desconectar observer una vez visible
        if (observerRef.current) {
          observerRef.current.disconnect();
          observerRef.current = null;
        }
      }
    });
  }, [isVisible, onLoad, delay]);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Si el navegador no soporta IntersectionObserver, cargar inmediatamente
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      setHasLoaded(true);
      return;
    }

    // Crear observer con configuración optimizada
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observerRef.current.observe(sectionRef.current);

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [handleIntersection, threshold, rootMargin]);

  // Clases de animación
  const getAnimationClasses = () => {
    if (!fadeIn && !slideUp) return '';
    
    let classes = 'transition-all duration-700 ease-out';
    
    if (fadeIn) {
      classes += isVisible ? ' opacity-100' : ' opacity-0';
    }
    
    if (slideUp) {
      classes += isVisible ? ' translate-y-0' : ' translate-y-8';
    }
    
    return classes;
  };

  // Si ya se cargó, renderizar contenido directamente
  if (hasLoaded && isVisible) {
    return (
      <section
        ref={sectionRef}
        id={id}
        className={`${className} ${getAnimationClasses()}`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {children}
      </section>
    );
  }

  // Renderizar placeholder o skeleton mientras no es visible
  return (
    <section
      ref={sectionRef}
      id={id}
      className={`${className} ${getAnimationClasses()}`}
      style={{ 
        minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
        transitionDelay: `${delay}ms`
      }}
    >
      {placeholder || (
        <div className="w-full h-full bg-gray-100 animate-pulse">
          <div className="h-full flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      )}
    </section>
  );
};

// Componente para cargar múltiples secciones con stagger
interface LazySectionGroupProps {
  sections: Array<{
    id: string;
    component: React.ComponentType;
    delay?: number;
    threshold?: number;
  }>;
  className?: string;
  staggerDelay?: number;
  onSectionLoad?: (id: string) => void;
}

export const LazySectionGroup: React.FC<LazySectionGroupProps> = ({
  sections,
  className = '',
  staggerDelay = 200,
  onSectionLoad,
}) => {
  return (
    <div className={className}>
      {sections.map((section, index) => {
        const Component = section.component;
        return (
          <LazySection
            key={section.id}
            id={section.id}
            delay={index * staggerDelay}
            threshold={section.threshold || 0.1}
            fadeIn={true}
            slideUp={true}
            onLoad={() => onSectionLoad?.(section.id)}
            minHeight="400px"
          >
            <Component />
          </LazySection>
        );
      })}
    </div>
  );
};

// Hook personalizado para lazy loading
export function useLazyLoading<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = {}
) {
  const elementRef = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
            setHasLoaded(true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isVisible, options]);

  return { elementRef, isVisible, hasLoaded };
}

export default LazySection;
