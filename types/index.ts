export interface Product {
  id: number;
  name: string;
  price: number;
  tagline: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  color: string;
}

export interface CartItem extends Product {
  qty: number;
}

export type ViewType = 'home' | 'products' | 'product' | 'about' | 'cart';

export interface ChillPodModelProps {
  hovered?: boolean;
  scale?: number;
  productType?: 'pod' | 'sauna';
}