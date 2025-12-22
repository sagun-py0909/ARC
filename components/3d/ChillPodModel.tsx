'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ChillPodModelProps {
  hovered?: boolean;
  scale?: number;
  productType?: 'pod' | 'sauna' | 'redlight';
}

export const ChillPodModel: React.FC<ChillPodModelProps> = ({ 
  hovered = false, 
  scale = 1, 
  productType = 'pod' 
}) => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    if (hovered) {
      meshRef.current.rotation.y += 0.01;
    } else {
      meshRef.current.rotation.y = Math.sin(t * 0.1) * 0.2;
    }
  });

  const isWood = productType === 'sauna';
  const isRedlight = productType === 'redlight';
  const mainColor = isWood ? '#5d4037' : isRedlight ? '#7f1d1d' : '#111111';
  const rimColor = isWood ? '#3e2723' : isRedlight ? '#b91c1c' : '#333333';

  return (
    <group ref={meshRef} scale={scale} dispose={null}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 0.9, 1.2, 64]} />
        <meshStandardMaterial 
          color={mainColor} 
          roughness={isWood ? 0.8 : isRedlight ? 0.4 : 0.15} 
          metalness={isWood ? 0.0 : isRedlight ? 0.2 : 0.8} 
        />
      </mesh>

      <mesh position={[0, 1.1, 0]} castShadow>
        <torusGeometry args={[1, 0.05, 16, 100]} />
        <meshStandardMaterial color={rimColor} roughness={0.2} metalness={0.5} />
      </mesh>

      {/* Redlight panel */}
      {isRedlight && (
        <mesh position={[0, 0.9, 1.01]}>
          <boxGeometry args={[0.9, 0.6, 0.05]} />
          <meshStandardMaterial color="#b91c1c" emissive="#ef4444" emissiveIntensity={1.2} />
        </mesh>
      )}

      {!isWood && !isRedlight && (
        <mesh position={[0, 0.95, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.9, 64]} />
          <meshPhysicalMaterial
            transmission={0.9}
            roughness={0.1}
            thickness={0.5}
            ior={1.33}
            color="#a5f3fc"
            metalness={0.1}
          />
        </mesh>
      )}

      <mesh position={[0, 0.5, 1.01]}>
        <boxGeometry args={[0.4, 0.15, 0.05]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
};