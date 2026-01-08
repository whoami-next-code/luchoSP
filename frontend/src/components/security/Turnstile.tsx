'use client';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: any;
  }
}

export function Turnstile({
  siteKey,
  onVerify,
  theme = 'auto',
}: {
  siteKey: string;
  onVerify: (token: string) => void;
  theme?: 'light' | 'dark' | 'auto';
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!siteKey && process.env.NODE_ENV !== 'production') {
      onVerify('dev-captcha');
      if (ref.current) {
        ref.current.innerHTML =
          '<div class="text-xs text-gray-500">Captcha deshabilitado en desarrollo</div>';
      }
      return;
    }
    const scriptId = 'cf-turnstile';
    if (!document.getElementById(scriptId)) {
      const s = document.createElement('script');
      s.id = scriptId;
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      s.async = true;
      document.head.appendChild(s);
    }
    const render = () => {
      if (window.turnstile && ref.current) {
        window.turnstile.render(ref.current, {
          sitekey: siteKey,
          callback: (token: string) => onVerify(token),
          theme,
        });
      }
    };
    const iv = setInterval(() => {
      if (window.turnstile) {
        clearInterval(iv);
        render();
      }
    }, 100);
    return () => clearInterval(iv);
  }, [siteKey, onVerify, theme]);
  return <div ref={ref} />;
}
