'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingCart, User, ChevronDown, Phone, Mail, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const services = [
  { name: 'Mantenimiento Industrial', href: '/mantenimiento' },
  { name: 'Soporte Técnico', href: '/soporte' },
  { name: 'Instalación', href: '/instalacion' },
  { name: 'Capacitación', href: '/capacitacion' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(1); // Simulated cart count
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-900 text-white py-2 px-4 text-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              +51 987 654 321
            </span>
            <span className="flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              info@industriasp.com
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/cotizacion" className="bg-orange-500 hover:bg-orange-600 px-4 py-1 rounded text-white font-medium transition-colors">
              Solicitar cotización
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="text-2xl font-bold text-gray-900">
                <span className="text-orange-500">Industria</span>SP
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/catalogo" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
                Catálogo
              </Link>
              
              {/* Services Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-orange-500 font-medium transition-colors"
                >
                  <span>Servicios</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isServicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border py-2 z-50"
                    >
                      {services.map((service) => (
                        <Link
                          key={service.href}
                          href={service.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                          onClick={() => setIsServicesOpen(false)}
                        >
                          {service.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <Link href="/nosotros" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
                Nosotros
              </Link>
              <Link href="/contacto" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
                Contacto
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link href="/carrito" className="relative p-2 text-gray-700 hover:text-orange-500 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>

              {/* User */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <Link href="/perfil" className="p-2 text-gray-700 hover:text-orange-500 transition-colors">
                    <User className="w-6 h-6" />
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="p-2 text-gray-700 hover:text-red-500 transition-colors"
                    title="Cerrar sesión"
                  >
                    <LogOut className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                <Link href="/auth/login" className="p-2 text-gray-700 hover:text-orange-500 transition-colors">
                  <User className="w-6 h-6" />
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-orange-500 transition-colors"
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90 }}
                      animate={{ rotate: 0 }}
                      exit={{ rotate: 90 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90 }}
                      animate={{ rotate: 0 }}
                      exit={{ rotate: -90 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-white border-t overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4">
                <nav className="flex flex-col space-y-4">
                  <Link href="/catalogo" className="text-gray-700 hover:text-orange-500 font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                    Catálogo
                  </Link>
                  <div className="border-b pb-4">
                    <div className="font-medium text-gray-700 mb-2">Servicios</div>
                    <div className="pl-4 space-y-2">
                      {services.map((service) => (
                        <Link
                          key={service.href}
                          href={service.href}
                          className="block text-gray-600 hover:text-orange-500 py-1"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {service.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <Link href="/nosotros" className="text-gray-700 hover:text-orange-500 font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                    Nosotros
                  </Link>
                  <Link href="/contacto" className="text-gray-700 hover:text-orange-500 font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                    Contacto
                  </Link>
                  <div className="pt-4 border-t space-y-4">
                    <Link href="/cotizacion" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-medium inline-block transition-colors w-full text-center">
                      Solicitar cotización
                    </Link>
                    {user ? (
                      <button
                        onClick={handleSignOut}
                        className="flex items-center justify-center space-x-2 w-full px-6 py-2 border border-red-200 text-red-600 rounded font-medium hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Cerrar sesión</span>
                      </button>
                    ) : (
                      <Link
                        href="/auth/login"
                        className="flex items-center justify-center space-x-2 w-full px-6 py-2 border border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-50 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="w-5 h-5" />
                        <span>Iniciar Sesión</span>
                      </Link>
                    )}
                  </div>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}