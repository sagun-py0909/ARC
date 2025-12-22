'use client';

import React from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Product } from '@/data/products';

interface CartItem extends Product {
  qty: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  removeFromCart: (id: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  cart, 
  removeFromCart 
}) => {
  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950 border-l border-white/10 z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Your Cart</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <ShoppingBag size={48} className="mb-4 opacity-20" />
                <p>Your cart is empty.</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex gap-4 p-4 bg-zinc-900 rounded-lg border border-white/5">
                  <div className="w-20 h-20 bg-zinc-800 rounded-md flex items-center justify-center overflow-hidden">
                    <div className="w-10 h-16 bg-zinc-700 rounded-sm"></div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-white">{item.name}</h4>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-400">
                        <X size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">${item.price}</p>
                    <div className="text-xs text-gray-500 font-mono">QTY: {item.qty}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="pt-6 border-t border-white/10">
              <div className="flex justify-between text-white text-lg font-bold mb-6">
                <span>Total</span>
                <span>${total}</span>
              </div>
              <Button primary className="w-full" onClick={() => alert("Checkout Simulator: Proceeding to Stripe...")}>
                Checkout
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};