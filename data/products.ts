export interface Product {
  id: number;
  name: string;
  price: number;
  tagline: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  color: string;
  type: 'pod' | 'sauna' | 'redlight';
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "ARC Chill Pod Pro",
    price: 3499,
    tagline: "The gold standard in cold therapy.",
    description: "Military-grade cooling technology meets sleek industrial design. The ARC Chill Pod Pro maintains 3°C water temperature efficiently, allowing for instant recovery after intense performance.",
    features: ["Temp Control to 3°C", "Self-Cleaning Ozone", "24/7 Cooling", "Indoor/Outdoor"],
    specs: { temp: "3°C - 40°C", capacity: "350L", material: "Stainless Steel & Teak" },
    color: "#1a1a1a",
    type: 'pod'
  },
  {
    id: 2,
    name: "ARC Recovery Barrel",
    price: 1299,
    tagline: "Portable performance.",
    description: "Designed for the traveling athlete. Inflatable drop-stitch durability with the same thermal insulation properties as our pro models.",
    features: ["Portable Design", "Thermal Cover", "5-min Setup", "Durable PVC Layer"],
    specs: { temp: "Passive Cooling", capacity: "280L", material: "Military Grade PVC" },
    color: "#e2e8f0",
    type: 'pod'
  },
  {
    id: 3,
    name: "ARC Sauna Shell",
    price: 4500,
    tagline: "Heat contrast therapy.",
    description: "Infrared heat technology in a compact, architectural shell. Perfect for contrast therapy when paired with the Chill Pod.",
    features: ["Full Spectrum IR", "Hemlock Wood", "Chromotherapy", "Bluetooth Audio"],
    specs: { temp: "Up to 75°C", capacity: "2 Person", material: "Canadian Hemlock" },
    color: "#7c2d12",
    type: 'sauna'
  },
  // new products
  {
    id: 4,
    name: "ARC Redlight Sauna",
    price: 3999,
    tagline: "Photobiomodulation meets heat.",
    description: "Combines near-infrared redlight arrays with precision heat control for enhanced cellular recovery and performance.",
    features: ["660nm & 850nm LEDs", "Low-EMF Design", "App Control", "Tempered Glass"],
    specs: { temp: "45°C - 65°C", capacity: "1-2 Person", material: "Birch & Tempered Glass" },
    color: "#b91c1c",
    type: 'redlight'
  },
  {
    id: 5,
    name: "ARC Cryo Barrel Pro",
    price: 2899,
    tagline: "Rapid cooling protocol.",
    description: "Active cooling system with rapid cooldown modes for contrast sessions and performance priming.",
    features: ["Active Cooling", "Rapid Mode", "Microfilter", "Indoor/Outdoor"],
    specs: { temp: "2°C - 20°C", capacity: "300L", material: "Stainless Steel" },
    color: "#0ea5e9",
    type: 'pod'
  }
];