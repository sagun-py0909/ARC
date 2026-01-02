'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';

interface ChillPodModelProps {
  hovered?: boolean;
  scale?: number;
  productType?: 'pod' | 'sauna' | 'redlight';
}

export const ChillPodModel: React.FC<ChillPodModelProps> = ({
  hovered = false,
  scale = 1,
  productType = 'pod',
}) => {
  const modelRef = useRef<THREE.Group>(null);

  // Map productType to a model variant in public/
  const variant = productType === 'pod' ? 'pbr' : 'shaded';
  const modelPath = variant === 'shaded' ? '/base_basic_shaded.glb' : '/base_basic_pbr.glb';

  // Load the GLTF model
  const gltf = useGLTF(modelPath);

  // Animate gently
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (modelRef.current) {
      if (hovered) {
        modelRef.current.rotation.y += 0.01;
      } else {
        modelRef.current.rotation.y = Math.sin(t * 0.1) * 0.2;
      }
      modelRef.current.position.y = Math.sin(t * 0.75) * 0.03;
    }
  });

  // Preload both variants to avoid hitching
  useGLTF.preload('/base_basic_pbr.glb');
  useGLTF.preload('/base_basic_shaded.glb');

  return (
    <group ref={modelRef} scale={scale} dispose={null}>
      <primitive object={gltf.scene} />
    </group>
  );
};