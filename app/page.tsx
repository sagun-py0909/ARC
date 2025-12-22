'use client';

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ChillPodModel } from '@/components/3d/ChillPodModel';
import { Scene } from '@/components/3d/Scene';
import useMounted from '@/hooks/useMounted';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const mounted = useMounted();
  const [productType, setProductType] = useState<'pod' | 'sauna' | 'redlight'>('pod');
  
  return (
    <>
      <div className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          {mounted && (
            <Canvas>
              <Scene>
                <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
                  <ChillPodModel scale={1.8} productType={productType} />
                </Float>
              </Scene>
            </Canvas>
          )}
        </div>

        <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-24 max-w-7xl mx-auto pointer-events-none">
          <div className="pointer-events-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold tracking-wider mb-6 animate-fade-in-up">
              <Zap size={12} />
              NEXT GEN RECOVERY
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white mb-6 leading-[0.9] mix-blend-difference animate-slide-up">
              RECOVER<br />LIKE A PRO
            </h1>
            <p className="text-gray-400 max-w-md text-lg mb-8 leading-relaxed animate-fade-in delay-100">
              Precision engineered cold therapy for peak athletic performance. 
              Designed for the elite, available for your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-200">
              <Link href="/products">
                <Button primary>Shop Collection</Button>
              </Link>
              <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-full p-1">
                <button
                  onClick={() => setProductType('pod')}
                  className={`px-4 py-2 rounded-full text-sm ${productType === 'pod' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
                >Cold Pod</button>
                <button
                  onClick={() => setProductType('sauna')}
                  className={`px-4 py-2 rounded-full text-sm ${productType === 'sauna' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
                >Sauna</button>
                <button
                  onClick={() => setProductType('redlight')}
                  className={`px-4 py-2 rounded-full text-sm ${productType === 'redlight' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
                >Redlight</button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/30 animate-bounce">
          <div className="w-1 h-12 rounded-full border border-current flex justify-center pt-2">
            <div className="w-0.5 h-2 bg-current rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Modern Science section below hero */}
      <section className="bg-black text-white py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-24">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Modern Science, Real Results</h2>
          <p className="text-gray-400 max-w-3xl text-lg mb-10">Cold exposure and infrared heat have decades of peer-reviewed research behind them. From reduced inflammation to improved mitochondrial function, our tech brings lab-grade protocols home.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="w-16 h-16 mb-4">
                <img src="/cold-thermo.svg" alt="Cold Thermogenesis" width="64" height="64" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Cold Thermogenesis</h3>
              <p className="text-gray-400">Activates brown adipose tissue and boosts norepinephrine, driving metabolic and recovery benefits in minutes.</p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="w-16 h-16 mb-4">
                <img src="/globe.svg" alt="Infrared" width="64" height="64" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Infrared Heat</h3>
              <p className="text-gray-400">Full-spectrum IR penetrates deeply to increase circulation, mobilize heat shock proteins, and enhance recovery.</p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="w-16 h-16 mb-4">
                <img src="/window.svg" alt="Contrast Therapy" width="64" height="64" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Contrast Therapy</h3>
              <p className="text-gray-400">Alternating hot and cold increases vascular flexibility and accelerates muscle repair.</p>
            </div>
          </div>
          <div className="mt-10">
            <Link href="/science">
              <Button>The Science</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}