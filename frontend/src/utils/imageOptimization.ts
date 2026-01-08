// Utilidades para optimización de imágenes
export const getOptimizedImageUrl = (
  src: string,
  width: number,
  height?: number,
  quality: number = 75,
  format: 'webp' | 'avif' | 'jpg' = 'webp'
): string => {
  if (!src) return '';
  
  // Si es una URL externa, devolverla tal cual
  if (src.startsWith('http')) {
    return src;
  }

  // Si es una imagen local, usar Next.js Image optimization
  return `${src}?w=${width}${height ? `&h=${height}` : ''}&q=${quality}&f=${format}`;
};

// Generar srcSet para imágenes responsivas
export const generateSrcSet = (
  src: string,
  sizes: number[],
  height?: number,
  quality: number = 75
): string => {
  return sizes
    .map(size => `${getOptimizedImageUrl(src, size, height, quality)} ${size}w`)
    .join(', ');
};

// Tamaños de imagen recomendados para diferentes breakpoints
export const IMAGE_SIZES = {
  hero: {
    mobile: { width: 640, height: 360 },
    tablet: { width: 1024, height: 576 },
    desktop: { width: 1920, height: 1080 },
  },
  product: {
    thumbnail: { width: 200, height: 200 },
    card: { width: 400, height: 300 },
    detail: { width: 800, height: 600 },
  },
  testimonial: {
    avatar: { width: 80, height: 80 },
  },
  logo: {
    header: { width: 200, height: 60 },
    footer: { width: 150, height: 45 },
  },
};

// Lazy loading con Intersection Observer
export const lazyLoadImage = (
  element: HTMLImageElement,
  src: string,
  placeholder?: string
): void => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = src;
            img.classList.remove('opacity-0');
            img.classList.add('opacity-100');
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01,
      }
    );

    imageObserver.observe(element);
  } else {
    // Fallback para navegadores que no soportan Intersection Observer
    element.src = src;
  }
};

// Preload de imágenes críticas
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

// Generar placeholder SVG para imágenes
export const generatePlaceholderSVG = (
  width: number,
  height: number,
  color: string = '#e5e7eb'
): string => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'%3E%3Crect width='${width}' height='${height}' fill='${encodeURIComponent(color)}'/%3E%3C/svg%3E`;
};

// Optimización de imágenes para diferentes navegadores
export const getImageFormat = (): 'webp' | 'avif' | 'jpg' => {
  if (typeof window === 'undefined') return 'webp';
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  // Verificar soporte para AVIF
  const avifData = canvas.toDataURL('image/avif');
  if (avifData.indexOf('data:image/avif') === 0) {
    return 'avif';
  }
  
  // Verificar soporte para WebP
  const webpData = canvas.toDataURL('image/webp');
  if (webpData.indexOf('data:image/webp') === 0) {
    return 'webp';
  }
  
  return 'jpg';
};

// Métricas de rendimiento de imágenes
export const measureImagePerformance = (
  imageUrl: string
): Promise<{ loadTime: number; size: number }> => {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    const img = new Image();
    
    img.onload = () => {
      const loadTime = performance.now() - startTime;
      
      // Obtener tamaño de la imagen si es posible
      fetch(imageUrl, { method: 'HEAD' })
        .then(response => {
          const size = parseInt(response.headers.get('content-length') || '0');
          resolve({ loadTime, size });
        })
        .catch(() => {
          resolve({ loadTime, size: 0 });
        });
    };
    
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${imageUrl}`));
    };
    
    img.src = imageUrl;
  });
};