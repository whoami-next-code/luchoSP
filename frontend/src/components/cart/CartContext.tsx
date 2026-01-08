"use client";
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  thumbnailUrl?: string;
};

type CartContextType = {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
  isHydrated: boolean;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "industriasp_cart";

// Función para cargar desde localStorage de manera segura
function loadFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (stored) {
      const parsed = JSON.parse(stored);
      
      const validItems = parsed.filter((item: any) => 
        item && 
        typeof item.productId === 'number' && 
        typeof item.name === 'string' && 
        typeof item.price === 'number' && 
        typeof item.quantity === 'number' && 
        item.quantity > 0
      );
      
      return validItems;
    }
  } catch (error) {
    // Silently handle localStorage errors
    if (process.env.NODE_ENV === 'development') {
      console.error('Error loading cart from localStorage:', error);
    }
  }
  
  return [];
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Inicializar con array vacío para evitar problemas de SSR
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Hidratar desde localStorage después del montaje
  useEffect(() => {
    const storedItems = loadFromStorage();
    setItems(storedItems);
    setIsHydrated(true);
  }, []);

  const addItem = (item: CartItem) => {
    const existingIndex = items.findIndex(i => i.productId === item.productId);
    let newItems: CartItem[];
    
    if (existingIndex >= 0) {
      newItems = [...items];
      newItems[existingIndex].quantity += item.quantity;
    } else {
      newItems = [...items, item];
    }
    
    setItems(newItems);
    
    // Guardar en localStorage solo después de la hidratación
    if (isHydrated && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error saving to localStorage:', error);
        }
      }
    }
  };

  const removeItem = (productId: number) => {
    const newItems = items.filter(item => item.productId !== productId);
    setItems(newItems);
    
    if (isHydrated && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error saving to localStorage:', error);
        }
      }
    }
  };

  const setQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    const newItems = items.map(item => 
      item.productId === productId ? { ...item, quantity } : item
    );
    setItems(newItems);
    
    if (isHydrated && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error saving to localStorage:', error);
        }
      }
    }
  };

  const clear = () => {
    setItems([]);
    
    if (isHydrated && typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error clearing localStorage:', error);
        }
      }
    }
  };

  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items]);

  const value: CartContextType = { items, total, addItem, removeItem, setQuantity, clear, isHydrated };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
