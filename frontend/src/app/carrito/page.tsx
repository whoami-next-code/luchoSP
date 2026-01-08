"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ShoppingCart, Trash2, CreditCard } from "lucide-react";
import CartView from "@/components/cart/CartView";
import { useCart } from "@/components/cart/CartContext";

export default function CarritoPage() {
  const { items, total, clear, isHydrated } = useCart();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [validSelection, setValidSelection] = useState<boolean>(true);

  const selectedTotal = useMemo(
    () => items
      .filter(i => selectedIds.includes(i.productId))
      .reduce((s, i) => s + i.price * i.quantity, 0),
    [items, selectedIds]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingCart className="h-6 w-6 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Tu Carrito</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Productos ({items.length})
              </h2>
            </div>
            <div className="p-6">
              <CartView
                onValidate={(ok) => setValidSelection(ok)}
                onSelectionChange={(ids) => setSelectedIds(ids)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Resumen</h3>
            </div>
            <div className="p-6 space-y-4">
              {!isHydrated ? (
                <div className="text-sm text-zinc-600">Cargando carrito…</div>
              ) : items.length === 0 ? (
                <div className="text-center text-sm text-zinc-600">
                  <ShoppingCart className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                  <p>No tienes productos en el carrito</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Seleccionado:</span>
                    <span className={`font-medium ${validSelection ? 'text-gray-900' : 'text-red-600'}`}>
                      ${selectedTotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-2 space-y-3">
                    <Link
                      href="/pasarela"
                      className={`w-full inline-flex items-center justify-center gap-2 rounded-md px-4 py-3 text-white ${validSelection && selectedIds.length > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                      aria-disabled={!validSelection || selectedIds.length === 0}
                    >
                      <CreditCard className="h-5 w-5" />
                      Proceder al pago
                    </Link>
                    <button
                      onClick={clear}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-md px-4 py-3 border text-gray-700 hover:bg-gray-50"
                    >
                      <Trash2 className="h-5 w-5" />
                      Vaciar carrito
                    </button>
                    <Link href="/catalogo" className="block text-center text-blue-700 hover:underline">
                      Continuar comprando
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

