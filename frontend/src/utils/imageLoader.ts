// Optimización de carga de imágenes
export interface ImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpg' | 'png';
}

// Loader personalizado para Next.js Image
export function imageLoader({ src, width, quality = 75, format = 'webp' }: ImageLoaderProps): string {
  // Si es una URL externa, usarla tal cual
  if (src.startsWith('http')) {
    return src;
  }
  
  // Construir URL optimizada
  const params = new URLSearchParams();
  params.set('url', src);
  params.set('w', width.toString());
  params.set('q', quality.toString());
  params.set('f', format);
  
  return `/api/image?${params.toString()}`;
}

// Generar srcset para imágenes responsivas
export function generateSrcSet(src: string, widths: number[], quality = 75): string {
  return widths
    .map(width => `${imageLoader({ src, width, quality })} ${width}w`)
    .join(', ');
}

// Tamaños de imagen predefinidos
export const IMAGE_SIZES = {
  thumbnail: 150,
  small: 300,
  medium: 600,
  large: 1200,
  extraLarge: 1920,
} as const;

// Optimización de imágenes con lazy loading
export function optimizeImage(element: HTMLImageElement): void {
  if ('loading' in HTMLImageElement.prototype) {
    // Navegador soporta lazy loading nativo
    element.loading = 'lazy';
  } else {
    // Implementación personalizada de lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });
    
    imageObserver.observe(element);
  }
}

// Pre-cargar imágenes críticas
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
  });
}

// Generar placeholder SVG
export function generatePlaceholderSVG(width: number, height: number, text?: string): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af" text-anchor="middle" dy=".3em">
        ${text || 'Loading...'}
      </text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// Detectar soporte de formatos modernos
export async function getSupportedFormats(): Promise<Array<'webp' | 'avif'>> {
  const formats: Array<'webp' | 'avif'> = [];
  
  // Detectar WebP
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  const webPDataURL = canvas.toDataURL('image/webp');
  if (webPDataURL.indexOf('data:image/webp') === 0) {
    formats.push('webp');
  }
  
  // Detectar AVIF (método más complejo)
  if ('createImageBitmap' in window) {
    const avifData = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAQAAAAEAAAAEGF2MUOBAAAAAAAAFWF2MUOCAAAACQYBAAEAAAAAABhhdmNCAAAA';
    const img = new Image();
    img.src = avifData;
    
    await new Promise<void>((resolve) => {
      img.onload = () => {
        formats.push('avif');
        resolve();
      };
      img.onerror = () => {
        resolve();
      };
    });
  }
  
  return formats;
}

// Comprimir imágenes antes de subirlas
export async function compressImage(file: File, maxWidth = 1920, maxHeight = 1080, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }
        
        // Calcular dimensiones manteniendo proporción
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Dibujar imagen comprimida
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir a blob con calidad especificada
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        }, 'image/webp', quality);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

// Medir el rendimiento de carga de imágenes
export function measureImageLoadPerformance(img: HTMLImageElement): Promise<PerformanceEntry> {
  return new Promise((resolve, reject) => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const imgEntry = entries.find(entry => 
        entry.name.includes(img.src) || 
        (entry as any).element === img
      );
      
      if (imgEntry) {
        resolve(imgEntry);
      } else {
        reject(new Error('Image load performance not found'));
      }
      
      observer.disconnect();
    });
    
    observer.observe({ entryTypes: ['resource', 'element'] });
    
    // Timeout por si no se encuentra la entrada
    setTimeout(() => {
      observer.disconnect();
      reject(new Error('Image load performance measurement timeout'));
    }, 10000);
  });
}

// Interfaz para configuración de optimización
export interface ImageOptimizationConfig {
  quality: number;
  format: 'webp' | 'avif' | 'jpg' | 'png';
  sizes: readonly number[];
  lazyLoad: boolean;
  preload: boolean;
  placeholder: 'blur' | 'empty' | 'svg';
}

// Configuración por defecto
export const defaultImageConfig: ImageOptimizationConfig = {
  quality: 75,
  format: 'webp',
  sizes: [640, 768, 1024, 1280, 1920],
  lazyLoad: true,
  preload: false,
  placeholder: 'blur',
};

// Función auxiliar para obtener configuración optimizada según el tipo de imagen
export function getOptimizedConfig(type: 'hero' | 'product' | 'thumbnail' | 'gallery'): ImageOptimizationConfig {
  const configs = {
    hero: {
      quality: 85,
      format: 'webp',
      sizes: [768, 1024, 1280, 1920],
      lazyLoad: false,
      preload: true,
      placeholder: 'blur',
    },
    product: {
      quality: 80,
      format: 'webp',
      sizes: [300, 600, 900],
      lazyLoad: true,
      preload: false,
      placeholder: 'blur',
    },
    thumbnail: {
      quality: 70,
      format: 'webp',
      sizes: [150, 300],
      lazyLoad: true,
      preload: false,
      placeholder: 'empty',
    },
    gallery: {
      quality: 75,
      format: 'webp',
      sizes: [400, 800, 1200],
      lazyLoad: true,
      preload: false,
      placeholder: 'blur',
    },
  } as const;
  
  return configs[type] || defaultImageConfig;
}
