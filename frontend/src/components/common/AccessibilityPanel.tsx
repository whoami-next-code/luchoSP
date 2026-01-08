import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Volume2, VolumeX, Maximize2, Minimize2, Palette, Settings } from 'lucide-react';
import { useAccessibility } from '@/utils/accessibility';

interface AccessibilityPanelProps {
  className?: string;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [wordSpacing, setWordSpacing] = useState(0);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [animations, setAnimations] = useState(true);

  const { highContrast: systemHighContrast, largeText: systemLargeText, reducedMotion } = useAccessibility();

  useEffect(() => {
    // Aplicar configuraciones al documento
    document.documentElement.style.setProperty('--font-size', `${fontSize}%`);
    document.documentElement.style.setProperty('--line-height', `${lineHeight}`);
    document.documentElement.style.setProperty('--letter-spacing', `${letterSpacing}px`);
    document.documentElement.style.setProperty('--word-spacing', `${wordSpacing}px`);

    if (highContrast || systemHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    if (largeText || systemLargeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }

    if (reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }

    if (!animations) {
      document.documentElement.classList.add('no-animations');
    } else {
      document.documentElement.classList.remove('no-animations');
    }
  }, [fontSize, lineHeight, letterSpacing, wordSpacing, highContrast, largeText, screenReader, animations, systemHighContrast, systemLargeText, reducedMotion]);

  const resetSettings = () => {
    setFontSize(100);
    setLineHeight(1.5);
    setLetterSpacing(0);
    setWordSpacing(0);
    setHighContrast(false);
    setLargeText(false);
    setScreenReader(false);
    setAnimations(true);
  };

  const toggleScreenReader = () => {
    setScreenReader(!screenReader);
    if (!screenReader) {
      // Activar modo lector de pantalla
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = 'Modo lector de pantalla activado';
      document.body.appendChild(announcement);
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Botón de accesibilidad */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
        aria-label="Abrir panel de accesibilidad"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Panel de accesibilidad */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-6 w-80 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Opciones de Accesibilidad</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Cerrar panel de accesibilidad"
            >
              <span className="sr-only">Cerrar</span>
              ×
            </button>
          </div>

          {/* Contraste alto */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <label htmlFor="high-contrast" className="text-sm font-medium text-gray-700">
                Contraste alto
              </label>
              <button
                id="high-contrast"
                onClick={() => setHighContrast(!highContrast)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  highContrast ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                aria-pressed={highContrast}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    highContrast ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Texto grande */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <label htmlFor="large-text" className="text-sm font-medium text-gray-700">
                Texto grande
              </label>
              <button
                id="large-text"
                onClick={() => setLargeText(!largeText)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  largeText ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                aria-pressed={largeText}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    largeText ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Animaciones */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <label htmlFor="animations" className="text-sm font-medium text-gray-700">
                Animaciones
              </label>
              <button
                id="animations"
                onClick={() => setAnimations(!animations)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  animations ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                aria-pressed={animations}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    animations ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Tamaño de fuente */}
          <div className="mb-4">
            <label htmlFor="font-size" className="block text-sm font-medium text-gray-700 mb-2">
              Tamaño de fuente: {fontSize}%
            </label>
            <input
              id="font-size"
              type="range"
              min="75"
              max="200"
              step="5"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full"
              aria-valuemin={75}
              aria-valuemax={200}
              aria-valuenow={fontSize}
              aria-label="Tamaño de fuente"
            />
          </div>

          {/* Interlineado */}
          <div className="mb-4">
            <label htmlFor="line-height" className="block text-sm font-medium text-gray-700 mb-2">
              Interlineado: {lineHeight}
            </label>
            <input
              id="line-height"
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={lineHeight}
              onChange={(e) => setLineHeight(Number(e.target.value))}
              className="w-full"
              aria-valuemin={1}
              aria-valuemax={3}
              aria-valuenow={lineHeight}
              aria-label="Interlineado"
            />
          </div>

          {/* Espaciado entre letras */}
          <div className="mb-4">
            <label htmlFor="letter-spacing" className="block text-sm font-medium text-gray-700 mb-2">
              Espaciado entre letras: {letterSpacing}px
            </label>
            <input
              id="letter-spacing"
              type="range"
              min="-0.1"
              max="0.5"
              step="0.01"
              value={letterSpacing}
              onChange={(e) => setLetterSpacing(Number(e.target.value))}
              className="w-full"
              aria-valuemin={-0.1}
              aria-valuemax={0.5}
              aria-valuenow={letterSpacing}
              aria-label="Espaciado entre letras"
            />
          </div>

          {/* Espaciado entre palabras */}
          <div className="mb-4">
            <label htmlFor="word-spacing" className="block text-sm font-medium text-gray-700 mb-2">
              Espaciado entre palabras: {wordSpacing}px
            </label>
            <input
              id="word-spacing"
              type="range"
              min="-0.1"
              max="0.5"
              step="0.01"
              value={wordSpacing}
              onChange={(e) => setWordSpacing(Number(e.target.value))}
              className="w-full"
              aria-valuemin={-0.1}
              aria-valuemax={0.5}
              aria-valuenow={wordSpacing}
              aria-label="Espaciado entre palabras"
            />
          </div>

          {/* Botones de acción rápida */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={toggleScreenReader}
              className={`flex items-center justify-center px-3 py-2 text-sm rounded-md transition-colors ${
                screenReader
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-pressed={screenReader}
            >
              {screenReader ? <Volume2 className="w-4 h-4 mr-1" /> : <VolumeX className="w-4 h-4 mr-1" />}
              Lector
            </button>

            <button
              onClick={resetSettings}
              className="flex items-center justify-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              <Palette className="w-4 h-4 mr-1" />
              Restablecer
            </button>
          </div>

          {/* Información adicional */}
          <div className="text-xs text-gray-500 border-t border-gray-200 pt-3">
            <p className="mb-2">
              <strong>Atajos de teclado:</strong>
            </p>
            <ul className="space-y-1">
              <li>• Tab: Navegar entre elementos</li>
              <li>• Enter: Activar botones/enlaces</li>
              <li>• Esc: Cerrar este panel</li>
              <li>• Flechas: Navegar en menús</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityPanel;