'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { X, Plus, Minus, ShoppingCart as ShoppingCartIcon, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ShoppingCart() {
  const { state, toggleCart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { items, isOpen } = state;

  const cartVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/50 z-50"
            onClick={toggleCart}
            aria-hidden="true"
          />

          {/* Cart Sidebar */}
          <motion.div
            variants={cartVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <ShoppingCartIcon className="w-6 h-6 text-blue-600" />
                <h2 id="cart-title" className="text-xl font-semibold text-gray-900">
                  Carrito de Compras ({items.length})
                </h2>
              </div>
              <button
                onClick={toggleCart}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                aria-label="Cerrar carrito"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-4">Tu carrito está vacío</p>
                  <button
                    onClick={toggleCart}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    Seguir comprando
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      {/* Product Image */}
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                          quality={75}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          ${item.product.price.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Subtotal: ${(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="p-1 text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                          aria-label={`Disminuir cantidad de ${item.product.name}`}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                          aria-label={`Aumentar cantidad de ${item.product.name}`}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1 text-red-500 hover:text-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                        aria-label={`Eliminar ${item.product.name} del carrito`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-6 space-y-4">
                {/* Total */}
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-blue-600">${getTotalPrice().toLocaleString()}</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link
                    href="/checkout"
                    onClick={toggleCart}
                    className="w-full flex items-center justify-center bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                  >
                    Proceder al Pago
                  </Link>
                  <button
                    onClick={clearCart}
                    className="w-full text-gray-600 hover:text-gray-800 py-2 px-4 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-lg"
                  >
                    Vaciar Carrito
                  </button>
                </div>

                {/* Continue Shopping */}
                <button
                  onClick={toggleCart}
                  className="w-full text-blue-600 hover:text-blue-700 py-2 px-4 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                >
                  Seguir Comprando
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
