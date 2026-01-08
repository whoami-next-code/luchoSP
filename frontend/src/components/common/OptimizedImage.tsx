import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  quality?: number;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: 'blur' | 'empty' | 'data:image/';
  blurDataURL?: string;
  format?: 'webp' | 'avif' | 'auto';
  fallbackFormat?: 'jpg' | 'png';
  enableLazyLoading?: boolean;
  enableSrcSet?: boolean;
  enableWebP?: boolean;
  enableAVIF?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  fill?: boolean;
}

// Componente de imagen optimizada con lazy loading y formatos modernos
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  sizes = '100vw',
  priority = false,
  loading = 'lazy',
  quality = 75,
  className = '',
  style,
  onLoad,
  onError,
  placeholder = 'blur',
  blurDataURL,
  format = 'auto',
  fallbackFormat = 'jpg',
  enableLazyLoading = true,
  enableSrcSet = true,
  enableWebP = true,
  enableAVIF = true,
  objectFit = 'cover',
  objectPosition = 'center',
  fill = false,
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(priority);
  const imageRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Detectar soporte de formatos modernos
  const supportsWebP = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('webp') > -1;
  }, []);

  const supportsAVIF = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/avif').indexOf('avif') > -1;
  }, []);

  // Generar URL optimizada
  const getOptimizedUrl = useCallback((url: string, format: string) => {
    if (!url) return url;
    
    // Mantener URLs de datos o externas sin cambios
    if (url.startsWith('data:') || url.startsWith('http')) {
      return url;
    }

    // Construir URL con parámetros de optimización
    const urlObj = new URL(url, window.location.origin);
    
    // Agregar parámetros de optimización
    if (format === 'webp' && enableWebP) {
      urlObj.searchParams.set('format', 'webp');
    } else if (format === 'avif' && enableAVIF) {
      urlObj.searchParams.set('format', 'avif');
    }
    
    urlObj.searchParams.set('quality', quality.toString());
    
    if (width) {
      urlObj.searchParams.set('width', width.toString());
    }
    
    if (height) {
      urlObj.searchParams.set('height', height.toString());
    }

    return urlObj.toString();
  }, [width, height, quality, enableWebP, enableAVIF]);

  // Generar srcset para imágenes responsivas
  const generateSrcSet = useCallback(() => {
    if (!enableSrcSet || !src) return undefined;

    const widths = [320, 640, 768, 1024, 1280, 1536, 1920];
    const srcSet: string[] = [];

    widths.forEach(w => {
      if (width && w > width) return; // No generar imágenes más grandes que el original
      
      const url = getOptimizedUrl(src, format === 'auto' ? 'webp' : format);
      srcSet.push(`${url} ${w}w`);
    });

    return srcSet.join(', ');
  }, [src, format, width, enableSrcSet, getOptimizedUrl]);

  // Lazy loading con IntersectionObserver
  useEffect(() => {
    if (priority || !enableLazyLoading) {
      setIsVisible(true);
      return;
    }

    if (!imageRef.current || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (observerRef.current) {
              observerRef.current.disconnect();
              observerRef.current = null;
            }
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
      }
    );

    observerRef.current.observe(imageRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [priority, enableLazyLoading]);

  // Manejar carga de imagen
  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    if (onLoad) onLoad();
  }, [onLoad]);

  // Manejar error de imagen
  const handleImageError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
    
    // Intentar con formato de respaldo
    if (format !== 'auto') {
      const fallbackUrl = getOptimizedUrl(src, fallbackFormat);
      setImageSrc(fallbackUrl);
    } else {
      if (onError) onError();
    }
  }, [format, fallbackFormat, src, getOptimizedUrl, onError]);

  // Generar placeholder SVG
  const generatePlaceholderSVG = useCallback(() => {
    const svg = `
      <svg width="${width || 100}" height="${height || 100}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="sans-serif" font-size="14">
          ${alt}
        </text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }, [width, height, alt]);

  // No renderizar si no es visible y no es prioritaria
  if (!isVisible && !priority) {
    return (
      <div
        ref={imageRef}
        className={`relative bg-gray-100 animate-pulse ${className}`}
        style={{ ...style, width, height }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  // Renderizar imagen con error
  if (hasError) {
    return (
      <div
        className={`relative bg-gray-100 flex items-center justify-center ${className}`}
        style={{ ...style, width, height }}
      >
        <div className="text-center text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">Imagen no disponible</p>
        </div>
      </div>
    );
  }

  // Determinar formato final
  const finalFormat = format === 'auto' 
    ? (supportsAVIF() && enableAVIF ? 'avif' : supportsWebP() && enableWebP ? 'webp' : fallbackFormat)
    : format;

  // URL optimizada
  const optimizedSrc = getOptimizedUrl(imageSrc, finalFormat);
  const srcSet = generateSrcSet();

  return (
    <div className={`relative ${className}`} style={style}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg" />
      )}
      
      <Image
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        loading={loading}
        quality={quality}
        className={`${objectFit ? `object-${objectFit}` : ''} ${objectPosition ? `object-[${objectPosition}]` : ''} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}
        onLoad={handleImageLoad}
        onError={handleImageError}
        placeholder={placeholder}
        blurDataURL={blurDataURL || generatePlaceholderSVG()}
        fill={fill}
        {...(srcSet && { srcSet })}
      />
    </div>
  );
};

// Componente de galería de imágenes optimizada
interface OptimizedImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }>;
  className?: string;
  columns?: number;
  gap?: string;
  onImageClick?: (index: number) => void;
}

export const OptimizedImageGallery: React.FC<OptimizedImageGalleryProps> = ({
  images,
  className = '',
  columns = 3,
  gap = '1rem',
  onImageClick,
}) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
    if (onImageClick) {
      onImageClick(index);
    }
  };

  const gridColumns = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[columns] || 'grid-cols-3';

  return (
    <div className={`grid ${gridColumns} gap-${gap} ${className}`}>
      {images.map((image, index) => (
        <div
          key={index}
          className="relative cursor-pointer group overflow-hidden rounded-lg"
          onClick={() => handleImageClick(index)}
        >
          <OptimizedImage
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="w-full h-64 transition-transform duration-300 group-hover:scale-105"
            objectFit="cover"
            enableLazyLoading={index > 0} // Cargar la primera imagen inmediatamente
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
        </div>
      ))}
    </div>
  );
};

export default OptimizedImage;
