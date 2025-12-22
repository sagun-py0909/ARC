'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PRODUCTS, Product } from '@/data/products';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/store/StoreContext';
import Link from 'next/link';
import { Canvas } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { ChillPodModel } from '@/components/3d/ChillPodModel';
import { Scene } from '@/components/3d/Scene';
import useMounted from '@/hooks/useMounted';

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useStore();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const mounted = useMounted();

  useEffect(() => {
    if (params.id) {
      const foundProduct = PRODUCTS.find(p => p.id === parseInt(params.id as string));
      setProduct(foundProduct);
    }
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
        <div className="min-h-screen bg-black text-white pt-24">
            <div className="max-w-4xl mx-auto px-6 py-12 text-center">
                <h1 className="text-4xl font-bold mb-4">Loading...</h1>
            </div>
        </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white pt-24">
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Product not found</h1>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-96 bg-gray-800 flex items-center justify-center rounded-lg overflow-hidden">
            {mounted && product ? (
              <Canvas>
                <Scene intensity={1.2}>
                  <Float speed={1.2} rotationIntensity={0.6} floatIntensity={0.6}>
                    <ChillPodModel scale={1.4} productType={product.type} />
                  </Float>
                </Scene>
              </Canvas>
            ) : (
              <span className="text-gray-500">{product?.name ?? 'Loading...'}</span>
            )}
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tighter mb-4">{product.name}</h1>
            <p className="text-gray-400 text-lg mb-6">{product.description}</p>
            <span className="text-4xl font-bold mb-6 block">${product.price.toLocaleString()}</span>
            <div className="flex gap-4">
              <Button primary onClick={() => addToCart(product)}>Add to Cart</Button>
              <Link href="/products">
                <Button>Back to Products</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}