'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, Activity } from 'lucide-react';

interface NavBarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenMenu: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({ 
  cartCount, 
  onOpenCart, 
  onOpenMenu, 
}) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-6 md:px-12 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-[2px]">
      <Link href="/">
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Activity size={18} className="text-black" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">ARC</span>
        </div>
      </Link>

      <div className="hidden md:flex items-center gap-8 bg-white/10 px-6 py-2 rounded-full border border-white/5 backdrop-blur-md">
        <Link href="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Home</Link>
        <Link href="/products" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Shop</Link>
        <Link href="/science" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Science</Link>
      </div>

      <div className="flex items-center gap-6">
        <button onClick={onOpenCart} className="relative text-white hover:text-gray-300 transition-colors">
          <ShoppingBag size={24} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold">
              {cartCount}
            </span>
          )}
        </button>
        <button onClick={onOpenMenu} className="md:hidden text-white">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
};