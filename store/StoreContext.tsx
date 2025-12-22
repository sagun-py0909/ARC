'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/data/products';

interface CartItem extends Product {
  qty: number;
}

interface StoreContextType {
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const value: StoreContextType = {
    cart,
    setCart,
    addToCart,
    removeFromCart,
    isMenuOpen,
    setIsMenuOpen,
    isCartOpen,
    setIsCartOpen,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};