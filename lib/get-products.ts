import { medusa } from "./medusa";
import { Product } from "@/data/products";

// Helper to map Medusa product to Frontend Product interface
function mapMedusaProduct(product: any): Product {
  // Determine type based on handle or category
  let type: 'pod' | 'sauna' | 'redlight' = 'pod';

  // Safe access to categories
  const categories = product.categories || [];
  const handle = product.handle || "";

  if (categories.some((c: any) => c.handle?.includes('sauna') || c.name?.toLowerCase().includes('sauna')) || handle.includes('sauna')) {
    type = 'sauna';
  } else if (categories.some((c: any) => c.handle?.includes('red-light') || c.name?.toLowerCase().includes('light')) || handle.includes('light')) {
    type = 'redlight';
  }

  // Extract price
  let price = 0;
  if (product.variants && product.variants.length > 0) {
      // Find lowest price
      const prices = product.variants.flatMap((v: any) => v.calculated_price?.calculated_amount || v.prices?.[0]?.amount || 0);
      if (prices.length > 0) price = Math.min(...prices);
  }

  return {
    id: product.id,
    name: product.title,
    price: price,
    tagline: extractTagline(product.description),
    description: stripHtml(product.description),
    features: extractFeatures(product.description),
    specs: { temp: "Standard", capacity: "Standard", material: "Standard" },
    color: "#1a1a1a",
    type: type
  };
}

function stripHtml(html: string) {
   if (!html) return "";
   return html.replace(/<[^>]*>?/gm, '');
}

function extractTagline(html: string) {
    if (!html) return "Premium Recovery Gear";
    const match = html.match(/Tagline:<\/strong>\s*([^<]+)/);
    return match ? match[1].trim() : "Premium Recovery Gear";
}

function extractFeatures(html: string) {
    if (!html) return ["Premium Build", "High Performance", "Durable"];
    const matches = html.match(/<li>(.*?)<\/li>/g);
    if (matches) {
        return matches.map(m => m.replace(/<\/?li>/g, '').replace(/<\/?strong>/g, ''));
    }
    return ["Premium Build", "High Performance", "Durable"];
}

export async function getProducts() {
  try {
    const { products } = await medusa.store.product.list({
        fields: "*categories,*variants,*variants.prices"
    });
    return products.map(mapMedusaProduct);
  } catch (error) {
    console.error("Failed to fetch products from Medusa:", error);
    return [];
  }
}

export async function getProduct(id: string) {
  try {
    const { product } = await medusa.store.product.retrieve(id, {
        fields: "*categories,*variants,*variants.prices"
    });
    return mapMedusaProduct(product);
  } catch (error) {
    console.error(`Failed to fetch product ${id} from Medusa:`, error);
    return null;
  }
}
