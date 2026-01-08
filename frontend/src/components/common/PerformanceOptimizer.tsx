import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
  loadTime: number | null;
  domContentLoaded: number | null;
}

interface PerformanceOptimizerProps {
  children: React.ReactNode;
  enableMonitoring?: boolean;
  enableOptimization?: boolean;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

// Componente principal de optimización de rendimiento
const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({
  children,
  enableMonitoring = true,
  enableOptimization = true,
  onMetricsUpdate,
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    loadTime: null,
    domContentLoaded: null,
  });
  
  const router = useRouter();

  // Optimizar recursos críticos
  useEffect(() => {
    if (!enableOptimization) return;

    // Pre-cargar recursos críticos
    const preloadCriticalResources = () => {
      // Pre-cargar fuentes
      const fonts = [
        '/fonts/inter-var-latin.woff2',
        '/fonts/inter-var-latin-ext.woff2',
      ];
      
      fonts.forEach(font => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        link.href = font;
        document.head.appendChild(link);
      });

      // Pre-cargar imágenes críticas
      const criticalImages = [
        '/images/logo.svg',
        '/images/hero-bg.webp',
      ];
      
      criticalImages.forEach(image => {
        const img = new Image();
        img.src = image;
      });
    };

    // Optimizar imágenes existentes
    const optimizeImages = () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        // Agregar loading="lazy" a imágenes no críticas
        if (!img.hasAttribute('loading') && !img.hasAttribute('priority')) {
          img.setAttribute('loading', 'lazy');
        }
        
        // Optimizar formatos de imagen
        if (img.src && !img.src.includes('webp') && !img.src.includes('avif')) {
          // Intentar usar formatos modernos
          const webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
          img.setAttribute('data-webp', webpSrc);
        }
      });
    };

    // Optimizar CSS y JavaScript
    const optimizeResources = () => {
      // Eliminar bloqueos de renderizado
      const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
      stylesheets.forEach(link => {
        if (!link.hasAttribute('media')) {
          link.setAttribute('media', 'all');
        }
      });

      // Optimizar scripts
      const scripts = document.querySelectorAll('script[src]');
      scripts.forEach(script => {
        if (!script.hasAttribute('async') && !script.hasAttribute('defer')) {
          script.setAttribute('defer', 'true');
        }
      });
    };

    // Ejecutar optimizaciones
    preloadCriticalResources();
    optimizeImages();
    optimizeResources();
  }, [enableOptimization]);

  // Monitorear métricas de rendimiento
  useEffect(() => {
    if (!enableMonitoring) return;

    const measureWebVitals = () => {
      // First Contentful Paint (FCP)
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
            break;
          }
        }
      }).observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint (LCP)
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.startTime > 0) {
            setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
            break;
          }
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const e = entry as PerformanceEventTiming;
          if (e.processingStart > 0) {
            setMetrics(prev => ({ ...prev, fid: e.processingStart - e.startTime }));
            break;
          }
        }
      }).observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const ls: any = entry as any;
          if (!ls.hadRecentInput) {
            clsValue += ls.value || 0;
          }
        }
        setMetrics(prev => ({ ...prev, cls: clsValue }));
      }).observe({ entryTypes: ['layout-shift'] });

      // Time to First Byte (TTFB)
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        setMetrics(prev => ({ ...prev, ttfb: navigationEntry.responseStart - navigationEntry.requestStart }));
      }

      // Load Time y DOM Content Loaded
      window.addEventListener('load', () => {
        setMetrics(prev => ({ ...prev, loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart }));
      });

      document.addEventListener('DOMContentLoaded', () => {
        setMetrics(prev => ({ ...prev, domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart }));
      });
    };

    measureWebVitals();
  }, [enableMonitoring]);

  // Notificar actualización de métricas
  useEffect(() => {
    if (onMetricsUpdate && Object.values(metrics).some(v => v !== null)) {
      onMetricsUpdate(metrics);
    }
  }, [metrics, onMetricsUpdate]);

  // Optimizar navegación entre páginas
  useEffect(() => {
    const handleRouteChangeStart = () => {
      // Guardar posición de scroll
      sessionStorage.setItem('scrollPosition', window.pageYOffset.toString());
    };

    const handleRouteChangeComplete = () => {
      // Restaurar posición de scroll o ir arriba
      const savedPosition = sessionStorage.getItem('scrollPosition');
      if (savedPosition && router.pathname === '/') {
        window.scrollTo(0, parseInt(savedPosition));
      } else {
        window.scrollTo(0, 0);
      }
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

  return <>{children}</>;
};

// Componente para mostrar indicador de rendimiento
export const PerformanceIndicator: React.FC<{ metrics: PerformanceMetrics }> = ({ metrics }) => {
  const getScoreColor = (value: number | null, thresholds: [number, number]) => {
    if (value === null) return 'text-gray-400';
    if (value <= thresholds[0]) return 'text-green-500';
    if (value <= thresholds[1]) return 'text-yellow-500';
    return 'text-red-500';
  };

  const formatTime = (ms: number | null) => {
    if (ms === null) return 'N/A';
    return `${Math.round(ms)}ms`;
  };

  const formatScore = (value: number | null) => {
    if (value === null) return 'N/A';
    return value.toFixed(2);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-50">
      <h3 className="text-sm font-semibold mb-2">Web Vitals</h3>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span>FCP:</span>
          <span className={getScoreColor(metrics.fcp, [1800, 3000])}>
            {formatTime(metrics.fcp)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>LCP:</span>
          <span className={getScoreColor(metrics.lcp, [2500, 4000])}>
            {formatTime(metrics.lcp)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>FID:</span>
          <span className={getScoreColor(metrics.fid, [100, 300])}>
            {formatTime(metrics.fid)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>CLS:</span>
          <span className={getScoreColor(metrics.cls, [0.1, 0.25])}>
            {formatScore(metrics.cls)}
          </span>
        </div>
      </div>
    </div>
  );
};

// Hook para medir el rendimiento de componentes
export function usePerformanceMeasure(componentName: string) {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }
      
      // Enviar a analytics si está disponible
      const w = typeof window !== 'undefined' ? (window as any) : undefined;
      if (w && typeof w.gtag !== 'undefined') {
        w.gtag('event', 'component_render_time', {
          component_name: componentName,
          render_time: renderTime,
        });
      }
    };
  }, [componentName]);
}

// Optimización de memoria y garbage collection
export function useMemoryOptimization() {
  useEffect(() => {
    // Limpiar referencias cuando el componente se desmonta
    return () => {
      // Forzar garbage collection si está disponible
      if (window.gc) {
        window.gc();
      }
      
      // No hay listeners globales registrados aquí
    };
  }, []);
}

export default PerformanceOptimizer;
