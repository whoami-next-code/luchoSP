// Configuración y utilidades de accesibilidad

export interface AccessibilityConfig {
  colorContrast: {
    normal: string;
    large: string;
    ratio: number;
  };
  keyboardNavigation: {
    tabOrder: string[];
    skipLinks: boolean;
    focusIndicators: boolean;
  };
  screenReader: {
    announcements: boolean;
    liveRegions: boolean;
    semanticMarkup: boolean;
  };
  visual: {
    fontSize: string;
    lineHeight: string;
    letterSpacing: string;
    wordSpacing: string;
  };
}

export const accessibilityConfig: AccessibilityConfig = {
  colorContrast: {
    normal: '#000000',
    large: '#000000',
    ratio: 4.5,
  },
  keyboardNavigation: {
    tabOrder: ['header', 'main', 'footer'],
    skipLinks: true,
    focusIndicators: true,
  },
  screenReader: {
    announcements: true,
    liveRegions: true,
    semanticMarkup: true,
  },
  visual: {
    fontSize: '16px',
    lineHeight: '1.5',
    letterSpacing: '0.02em',
    wordSpacing: '0.1em',
  },
};

// Funciones de utilidad para accesibilidad

export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  if (typeof window === 'undefined') return;

  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };

  element.addEventListener('keydown', handleKeyDown);
  firstElement?.focus();

  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
};

export const skipToContent = (contentId = 'main-content') => {
  if (typeof window === 'undefined') return;

  const skipLink = document.createElement('a');
  skipLink.href = `#${contentId}`;
  skipLink.textContent = 'Saltar al contenido principal';
  skipLink.className = 'skip-link sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 z-50';
  
  document.body.insertBefore(skipLink, document.body.firstChild);
};

export const addKeyboardNavigation = (element: HTMLElement, options: {
  arrowKeys?: boolean;
  homeEnd?: boolean;
  pageUpDown?: boolean;
  onSelect?: (index: number) => void;
}) => {
  const items = element.querySelectorAll('[role="option"], [role="menuitem"]');
  let currentIndex = -1;

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (options.arrowKeys) {
          currentIndex = Math.min(currentIndex + 1, items.length - 1);
          (items[currentIndex] as HTMLElement)?.focus();
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (options.arrowKeys) {
          currentIndex = Math.max(currentIndex - 1, 0);
          (items[currentIndex] as HTMLElement)?.focus();
        }
        break;
      case 'Home':
        e.preventDefault();
        if (options.homeEnd) {
          currentIndex = 0;
          (items[currentIndex] as HTMLElement)?.focus();
        }
        break;
      case 'End':
        e.preventDefault();
        if (options.homeEnd) {
          currentIndex = items.length - 1;
          (items[currentIndex] as HTMLElement)?.focus();
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (options.onSelect && currentIndex >= 0) {
          options.onSelect(currentIndex);
        }
        break;
    }
  };

  element.addEventListener('keydown', handleKeyDown);
  
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
};

export const validateColorContrast = (foreground: string, background: string): number => {
  // Convertir colores a RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  };

  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);
  
  if (!fg || !bg) return 0;

  const fgLuminance = getLuminance(fg.r, fg.g, fg.b);
  const bgLuminance = getLuminance(bg.r, bg.g, bg.b);

  const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) / (Math.min(fgLuminance, bgLuminance) + 0.05);
  
  return ratio;
};

export const isValidContrast = (foreground: string, background: string, level: 'AA' | 'AAA' = 'AA'): boolean => {
  const ratio = validateColorContrast(foreground, background);
  const requiredRatio = level === 'AA' ? 4.5 : 7;
  return ratio >= requiredRatio;
};

// Hook personalizado para manejar el estado de accesibilidad
export const useAccessibility = () => {
  const [highContrast, setHighContrast] = React.useState(false);
  const [largeText, setLargeText] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    // Detectar preferencias del sistema
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    document.documentElement.classList.toggle('high-contrast');
  };

  const toggleLargeText = () => {
    setLargeText(!largeText);
    document.documentElement.classList.toggle('large-text');
  };

  return {
    highContrast,
    largeText,
    reducedMotion,
    toggleHighContrast,
    toggleLargeText,
  };
};

// Utilidades ARIA
export const generateAriaLabel = (text: string, context?: string): string => {
  return context ? `${text} - ${context}` : text;
};

export const generateAriaDescribedBy = (id: string, description?: string): string => {
  return description ? `${id}-description` : '';
};

// Estilos CSS para accesibilidad
export const accessibilityStyles = `
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: #000;
    color: #fff;
    padding: 8px;
    text-decoration: none;
    z-index: 100;
    transition: top 0.3s;
  }

  .skip-link:focus {
    top: 6px;
  }

  .high-contrast {
    filter: contrast(2);
  }

  .large-text {
    font-size: 120% !important;
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  :focus {
    outline: 2px solid #0066cc;
    outline-offset: 2px;
  }

  [role="button"]:focus,
  button:focus,
  a:focus {
    outline: 2px solid #0066cc;
    outline-offset: 2px;
  }
`;

import React from 'react';