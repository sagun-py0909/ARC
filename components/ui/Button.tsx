'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  primary?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  primary = false, 
  onClick, 
  className = "" 
}) => {
  return (
    <button 
      onClick={onClick}
      className={`
        px-8 py-4 rounded-full font-medium tracking-wide transition-all duration-300
        flex items-center justify-center gap-2 group
        ${primary 
          ? "bg-white text-black hover:bg-gray-200 hover:scale-105" 
          : "bg-white/10 text-white backdrop-blur-sm border border-white/10 hover:bg-white/20"}
        ${className}
      `}
    >
      {children}
      {primary && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
    </button>
  );
};