import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import { HeaderChrome, FooterChrome } from "@/components/layout/Chrome";
import { PublicSocketProvider } from "@/lib/PublicSocketProvider";
import { CartProvider } from "@/components/cart/CartContext";
import { CartUIProvider } from "@/components/cart/CartUIContext";
import { ToastProvider } from "@/components/ui/Toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import CartSidebar from "@/components/cart/CartSidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: {
    default: "Industrias SP - Soluciones Industriales",
    template: "%s | Industrias SP"
  },
  description: "Soluciones industriales integrales con más de 15 años de experiencia. Especialistas en equipamiento y servicios para la industria peruana.",
  keywords: ["equipos industriales", "maquinaria industrial", "compresores", "soldadoras", "generadores", "industria peruana"],
  authors: [{ name: "Industrias SP" }],
  creator: "Industrias SP",
  publisher: "Industrias SP",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://industriasp.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "/",
    siteName: "Industrias SP",
    title: "Industrias SP - Soluciones Industriales",
    description: "Soluciones industriales integrales con más de 15 años de experiencia.",
    images: [
      {
        url: "/brand/kadhavu/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Industrias SP - Soluciones Industriales",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Industrias SP - Soluciones Industriales",
    description: "Soluciones industriales integrales con más de 15 años de experiencia.",
    images: ["/brand/kadhavu/images/og-image.jpg"],
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
  icons: {
    icon: "/brand/kadhavu/images/favicon.png",
    shortcut: "/brand/kadhavu/images/favicon.png",
    apple: "/brand/kadhavu/images/favicon.png",
  },
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${roboto.variable} antialiased`}
      >
        <AuthProvider>
          <PublicSocketProvider>
            <CartProvider>
              <CartUIProvider>
                <ToastProvider>
                  <HeaderChrome />
                  {children}
                  <CartSidebar />
                  <FooterChrome />
                </ToastProvider>
              </CartUIProvider>
            </CartProvider>
          </PublicSocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
