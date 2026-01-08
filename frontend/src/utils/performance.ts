// Utilidades para optimización de rendimiento
import React from 'react';

// Lazy loading para componentes
export const lazyLoadComponent = (importFn: () => Promise<any>) => {
  return React.lazy(importFn as any);
};

// Debounce para optimizar eventos
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle para optimizar eventos frecuentes
export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Medición de Web Vitals
export const measureWebVitals = () => {
  if (typeof window === 'undefined') return;
  try {
    // usar import dinámico opcional si la lib está disponible
    // @ts-ignore
    import('web-vitals').then((m: any) => {
      if (process.env.NODE_ENV === 'development') {
        m.getCLS?.(console.log);
        m.getFID?.(console.log);
        m.getFCP?.(console.log);
        m.getLCP?.(console.log);
        m.getTTFB?.(console.log);
      }
    }).catch(() => {});
  } catch {}
};

// Precarga de recursos críticos
export const preloadResources = (resources: string[]) => {
  if (typeof document === 'undefined') return;

  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    
    if (resource.endsWith('.css')) {
      link.as = 'style';
    } else if (resource.endsWith('.js')) {
      link.as = 'script';
    } else if (resource.match(/\.(woff|woff2|ttf|otf)$/)) {
      link.as = 'font';
      link.crossOrigin = 'anonymous';
    } else if (resource.match(/\.(jpg|jpeg|png|webp|avif)$/)) {
      link.as = 'image';
    }
    
    document.head.appendChild(link);
  });
};

// Caché de recursos con Service Worker
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          if (process.env.NODE_ENV === 'development') {
            console.log('SW registered: ', registration);
          }
        })
        .catch(registrationError => {
          if (process.env.NODE_ENV === 'development') {
            console.log('SW registration failed: ', registrationError);
          }
        });
    });
  }
};

// Optimización de event listeners
export const optimizeEventListeners = () => {
  // Usar passive event listeners para mejorar el scroll
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  
  EventTarget.prototype.addEventListener = function(
    type: string,
    listener: EventListener,
    options?: boolean | AddEventListenerOptions
  ) {
    if (type === 'wheel' || type === 'mousewheel' || type === 'touchstart' || type === 'touchmove') {
      if (typeof options === 'boolean') {
        options = { passive: true };
      } else if (typeof options === 'object' && options !== null) {
        options.passive = true;
      } else {
        options = { passive: true };
      }
    }
    
    return originalAddEventListener.call(this, type, listener, options);
  };
};

// Gestión de memoria para optimización
export const optimizeMemoryUsage = () => {
  // Limpiar referencias a elementos DOM eliminados
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.removedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Limpiar referencias a elementos eliminados
          const element = node as Element;
          const eventListeners = (element as any).__eventListeners;
          
          if (eventListeners) {
            Object.keys(eventListeners).forEach(eventType => {
              eventListeners[eventType].forEach((listener: EventListener) => {
                element.removeEventListener(eventType, listener);
              });
            });
          }
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

// Optimización de animaciones
export const optimizeAnimations = () => {
  // Usar requestAnimationFrame para animaciones suaves
  const originalSetTimeout = window.setTimeout;
  const originalSetInterval = window.setInterval;

  // Optimizar animaciones CSS
  const style = document.createElement('style');
  style.textContent = `
    * {
      will-change: auto;
    }
    
    .animated {
      will-change: transform, opacity;
    }
    
    .no-animate {
      animation: none !important;
      transition: none !important;
    }
  `;
  document.head.appendChild(style);
};

// Reducción de reflows y repaints
export const minimizeReflows = <T extends (...args: any[]) => void>(
  func: T
): ((...args: Parameters<T>) => void) => {
  return (...args: Parameters<T>) => {
    // Agrupar cambios DOM para minimizar reflows
    requestAnimationFrame(() => {
      func(...args);
    });
  };
};

// Optimización de red
export const optimizeNetworkRequests = () => {
  // Implementar request pooling
  const requestQueue: Array<() => Promise<any>> = [];
  let isProcessing = false;

  const processQueue = async () => {
    if (isProcessing || requestQueue.length === 0) return;
    
    isProcessing = true;
    const batch = requestQueue.splice(0, 5); // Procesar máximo 5 requests simultáneos
    
    try {
      await Promise.all(batch.map(request => request()));
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Batch request failed:', error);
      }
    } finally {
      isProcessing = false;
      setTimeout(processQueue, 100); // Esperar 100ms antes del siguiente batch
    }
  };

  return (request: () => Promise<any>) => {
    requestQueue.push(request);
    processQueue();
  };
};

// Monitoreo de rendimiento
export const monitorPerformance = () => {
  if (typeof window !== 'undefined' && window.performance) {
    // Medir tiempo de carga de la página
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      if (process.env.NODE_ENV === 'development') {
        console.log(`Page load time: ${loadTime}ms`);
      }
      
      // Hook opcional para analytics si está disponible
      try {
        // @ts-ignore
        if (typeof (window as any).gtag !== 'undefined') {
          // @ts-ignore
          (window as any).gtag('event', 'page_load_time', { value: loadTime });
        }
      } catch {}
    });

    // Medir tiempo de first paint
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-paint') {
            if (process.env.NODE_ENV === 'development') {
              console.log(`First paint: ${entry.startTime}ms`);
            }
          } else if (entry.name === 'first-contentful-paint') {
            if (process.env.NODE_ENV === 'development') {
              console.log(`First contentful paint: ${entry.startTime}ms`);
            }
          }
        }
      });
      
      observer.observe({ entryTypes: ['paint'] });
    }
  }
};
