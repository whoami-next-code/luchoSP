'use client';

import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react';
import { useCart } from '@/components/cart/CartContext';
import { useState } from 'react';

interface ProductsSectionProps {
  products: Product[];
}

export default function ProductsSection({ products }: ProductsSectionProps) {
  const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.1 });
  const { addItem } = useCart();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as any,
      },
    },
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: Number(product.id),
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: (product as any).image,
    });
  };

  return (
    <section
      ref={ref as any}
      className="py-20 bg-white"
      aria-labelledby="products-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2
            id="products-heading"
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Productos Destacados
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre nuestra selección de productos industriales de alta calidad, diseñados para optimizar tus procesos productivos.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isIntersecting ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="group relative"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    quality={85}
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 space-y-2">
                    {product.originalPrice && (
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </div>
                    )}
                    {product.inStock && (
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        En Stock
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 space-y-2">
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className={`p-2 rounded-full backdrop-blur-sm transition-colors duration-200 ${
                        favorites.has(product.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white/80 text-gray-600 hover:bg-white'
                      }`}
                      aria-label={favorites.has(product.id) ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
                    >
                      <Heart className={`w-4 h-4 ${favorites.has(product.id) ? 'fill-current' : ''}`} />
                    </button>
                    <Link
                      href={`/productos/${product.slug}`}
                      className="p-2 bg-white/80 text-gray-600 rounded-full backdrop-blur-sm hover:bg-white transition-colors duration-200"
                      aria-label={`Ver detalles de ${product.name}`}
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Category */}
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      <Link
                        href={`/productos/${product.slug}`}
                        className="hover:text-blue-600 transition-colors duration-200"
                      >
                        {product.name}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-gray-900">
                        ${product.price.toLocaleString()}
                      </div>
                      {product.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          ${product.originalPrice.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={!product.inStock}
                    aria-label={`Agregar ${product.name} al carrito`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>{product.inStock ? 'Agregar al Carrito' : 'Agotado'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <Link
            href="/productos"
            className="inline-flex items-center px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500/50"
          >
            Ver Todos los Productos
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
