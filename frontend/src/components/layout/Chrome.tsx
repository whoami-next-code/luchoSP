'use client';

import { usePathname } from 'next/navigation';
import Home2Header from '@/components/home/Home2Header';
import SiteFooter from '@/components/layout/SiteFooter';

export function HeaderChrome() {
  const pathname = usePathname();
  return <Home2Header />;
}

export function FooterChrome() {
  const pathname = usePathname();
  return <SiteFooter />;
}
