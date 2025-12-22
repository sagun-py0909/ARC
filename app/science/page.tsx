'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function SciencePage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold tracking-tighter mb-6">The Science</h1>
        <p className="text-gray-400 text-lg mb-10">Explore how cold exposure, infrared heat, and redlight therapy drive recovery at the cellular level. Below are simplified visuals and references to help you dive deeper.</p>

        <section className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="w-16 h-16 mb-4">
              <Image src="/mitochondria.svg" alt="Mitochondrial Function" width={64} height={64} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Mitochondria</h3>
            <p className="text-gray-400">Red/NIR light can interact with mitochondrial chromophores (e.g., cytochrome c oxidase), affecting ATP production and redox signaling pathways.</p>
            <p className="text-xs text-gray-500 mt-3">See references below.</p>
          </div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="w-16 h-16 mb-4">
              <Image src="/norepinephrine.svg" alt="Norepinephrine Spikes" width={64} height={64} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Norepinephrine</h3>
            <p className="text-gray-400">Cold exposure rapidly elevates norepinephrine, contributing to analgesia, mood, and metabolic activation.</p>
            <p className="text-xs text-gray-500 mt-3">See references below.</p>
          </div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="w-16 h-16 mb-4">
              <Image src="/hsp.svg" alt="Heat Shock Proteins" width={64} height={64} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Heat Shock Proteins</h3>
            <p className="text-gray-400">Infrared heat can mobilize HSPs that assist in protein folding, cellular protection, and recovery signaling.</p>
            <p className="text-xs text-gray-500 mt-3">See references below.</p>
          </div>
        </section>

        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-3">References</h2>
            <ul className="text-gray-400 space-y-3 text-sm">
              <li>
                Photobiomodulation mechanisms: cytochrome c oxidase and beyond
                <a className="text-blue-400 hover:underline ml-2" href="https://onlinelibrary.wiley.com/doi/pdf/10.1111/php.12864" target="_blank" rel="noopener noreferrer">[1]</a>
                <a className="text-blue-400 hover:underline ml-2" href="https://www.liebertpub.com/doi/10.1089/photob.2021.0119" target="_blank" rel="noopener noreferrer">[4]</a>
              </li>
              <li>
                Different wavelength mechanisms (810 nm vs 980 nm) impacting mitochondria and ion channels
                <a className="text-blue-400 hover:underline ml-2" href="https://journals.sagepub.com/doi/10.1089/photob.2021.0119?icid=int.sj-abstract.similar-articles.2" target="_blank" rel="noopener noreferrer">[3]</a>
                <a className="text-blue-400 hover:underline ml-2" href="https://pubmed.ncbi.nlm.nih.gov/34818111/" target="_blank" rel="noopener noreferrer">[2]</a>
              </li>
            </ul>
          </div>
        </section>

        <div className="mt-12">
          <Link href="/products">
            <Button>Explore Products</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}