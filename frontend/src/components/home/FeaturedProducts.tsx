'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Eye, Star, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  badge?: string;
}

const featuredProducts: Product[] = [
  {
    id: 1,
    name: "Bomba Centrífuga Industrial",
    description: "Alta eficiencia para procesos industriales de fluidos",
    price: 2850,
    originalPrice: 3200,
    image: "/brand/kadhavu/images/logo.png",
    category: "Bombas",
    rating: 4.8,
    reviews: 24,
    badge: "Destacado"
  },
  {
    id: 2,
    name: "Motor Eléctrico 15HP",
    description: "Motor trifásico de alta eficiencia energética",
    price: 1850,
    image: "/brand/kadhavu/images/logo.png",
    category: "Motores",
    rating: 4.9,
    reviews: 18,
    badge: "Nuevo"
  },
  {
    id: 3,
    name: "Válvula de Control Neumática",
    description: "Control preciso de flujo en sistemas automatizados",
    price: 450,
    originalPrice: 520,
    image: "/brand/kadhavu/images/logo.png",
    category: "Válvulas",
    rating: 4.7,
    reviews: 31,
    badge: "Oferta"
  },
  {
    id: 4,
    name: "Compresor de Aire Industrial",
    description: "Alta capacidad para aplicaciones industriales",
    price: 4200,
    image: "/brand/kadhavu/images/logo.png",
    category: "Compresores",
    rating: 4.6,
    reviews: 42
  },
  {
    id: 5,
    name: "Sistema de Filtración",
    description: "Filtración industrial de alta precisión",
    price: 1200,
    originalPrice: 1350,
    image: "/brand/kadhavu/images/logo.png",
    category: "Filtración",
    rating: 4.8,
    reviews: 15,
    badge: "Popular"
  },
  {
    id: 6,
    name: "Panel de Control Automatizado",
    description: "Control avanzado para procesos industriales",
    price: 2800,
    image: "/brand/kadhavu/images/logo.png",
    category: "Automatización",
    rating: 4.9,
    reviews: 28,
    badge: "Premium"
  }
];

export default function FeaturedProducts() {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Productos destacados
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Selección rápida de nuestro catálogo de productos industriales de alta calidad
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Badge */}
              {product.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    product.badge === 'Nuevo' ? 'bg-green-100 text-green-800' :
                    product.badge === 'Oferta' ? 'bg-red-100 text-red-800' :
                    product.badge === 'Destacado' ? 'bg-blue-100 text-blue-800' :
                    product.badge === 'Popular' ? 'bg-purple-100 text-purple-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {product.badge}
                  </span>
                </div>
              )}

              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Overlay on hover */}
                <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${
                  hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="flex space-x-3">
                    <Link
                      href={`/catalogo/${product.id}`}
                      className="bg-white text-gray-900 p-3 rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                    <button className="bg-orange-500 text-white p-3 rounded-full hover:bg-orange-600 transition-all duration-300">
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category */}
                <div className="text-sm text-orange-500 font-medium mb-2">
                  {product.category}
                </div>

                {/* Name */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                  {product.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900">
                      ${product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        ${product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Link
                    href={`/catalogo/${product.id}`}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 py-2 px-4 rounded-lg font-medium transition-colors text-center"
                  >
                    Ver detalles
                  </Link>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/catalogo"
            className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            Ver catálogo completo
            <ChevronRight className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}