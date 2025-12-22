'use client';

import React, { ReactNode } from 'react';
import { PerspectiveCamera } from '@react-three/drei';

interface SceneProps {
  children: ReactNode;
  intensity?: number;
}

export const Scene: React.FC<SceneProps> = ({ children, intensity = 1 }) => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1, 4]} fov={45} />
      <ambientLight intensity={0.5 * intensity} />
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={1 * intensity} 
        castShadow 
      />
      <pointLight position={[-10, -10, -10]} intensity={1 * intensity} color="#3b82f6" />
      {children}
    </>
  );
};