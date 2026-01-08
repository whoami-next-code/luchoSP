import Home2Hero from '@/components/home/Home2Hero';
import Home2FeaturedProducts from '@/components/home/Home2FeaturedProducts';
import AboutSection from '@/components/home/AboutSection';
import ServicesSection from '@/components/home/ServicesSection';
import ContactSection from '@/components/home/ContactSection';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Industrias SP - Soluciones Industriales | Equipos y Maquinaria Industrial",
  description: "Soluciones industriales integrales con más de 15 años de experiencia. Especialistas en equipamiento y servicios para la industria peruana. Compresores, soldadoras, generadores y más.",
  keywords: ["equipos industriales", "maquinaria industrial", "compresores", "soldadoras", "generadores", "industria peruana", "soluciones industriales"],
  authors: [{ name: "Industrias SP" }],
  openGraph: { 
    title: "Industrias SP - Soluciones Industriales", 
    description: "Soluciones industriales integrales con más de 15 años de experiencia. Especialistas en equipamiento y servicios para la industria peruana.",
    url: "https://industriasp.com", 
    siteName: "Industrias SP",
    type: "website",
    locale: "es_PE",
    images: [
      {
        url: "/brand/kadhavu/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Industrias SP - Soluciones Industriales"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Industrias SP - Soluciones Industriales",
    description: "Soluciones industriales integrales con más de 15 años de experiencia.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://industriasp.com",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <Home2Hero />
        <Home2FeaturedProducts />
        <AboutSection />
        <ServicesSection />
        <ContactSection />
      </main>
    </div>
  );
}
