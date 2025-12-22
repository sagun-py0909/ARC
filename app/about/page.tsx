'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold tracking-tighter mb-6">The Science</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
            <h2 className="text-2xl font-bold">Cold Exposure</h2>
            <p>
              Cold thermogenesis activates brown adipose tissue (BAT), increasing mitochondrial activity and norepinephrine levels. This cascade enhances metabolic rate, reduces inflammation, and improves resilience.
            </p>
            <h2 className="text-2xl font-bold">Infrared Heat</h2>
            <p>
              Full-spectrum infrared penetrates tissues to stimulate circulation and heat shock proteins (HSPs), assisting in cellular repair and detoxification.
            </p>
            <h2 className="text-2xl font-bold">Contrast Therapy</h2>
            <p>
              Alternating hot and cold creates powerful vasodilation/vasoconstriction cycles that improve vascular health and accelerate recovery.
            </p>
          </div>
          <div className="space-y-6">
            <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5 p-4">
              <img src="/cold-thermo.svg" alt="Cold Thermogenesis" className="w-32 h-32" />
            </div>
            <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5 p-4">
              <img src="/globe.svg" alt="Infrared" className="w-32 h-32" />
            </div>
            <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5 p-4">
              <img src="/window.svg" alt="Contrast Therapy" className="w-32 h-32" />
            </div>
          </div>
        </div>
        <div className="mt-12">
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}