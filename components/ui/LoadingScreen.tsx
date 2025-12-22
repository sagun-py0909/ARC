'use client';

import React, { useState, useEffect } from 'react';

export const LoadingScreen: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2000); // Hide after 2 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-500 ${!visible ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="text-center">
        <div className="text-4xl font-bold text-white tracking-tighter mb-4">ARC</div>
        <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-white animate-pulse"></div>
        </div>
        <div className="mt-2 text-xs text-gray-500 font-mono">INITIALIZING RECOVERY ENGINE</div>
      </div>
    </div>
  );
};