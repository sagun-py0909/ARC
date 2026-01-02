'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { getProducts } from '@/lib/get-products';
import { Product } from '@/data/products';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
      return (
        <div className="min-h-screen bg-black text-white pt-24">
          <div className="max-w-7xl mx-auto px-6 py-12 text-center">
            <h1 className="text-2xl">Loading Collection...</h1>
          </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold tracking-tighter mb-12 text-center">Our Collection</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => (
            <div key={product.id} className="bg-gray-900/50 rounded-lg overflow-hidden border border-gray-800 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1">
              <div className="h-64 bg-gray-800 flex items-center justify-center">
                {/* Placeholder for product image */}
                <span className="text-gray-500">{product.name}</span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-400 mb-4 line-clamp-3">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold">${product.price.toLocaleString()}</span>
                  <Link href={`/products/${product.id}`}>
                    <Button>View Details</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
