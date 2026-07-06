import { supabase } from "@/lib/supabase";

export interface ProductVariant {
  id: string;
  label: string;
  price: number;
  originalPrice: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  applications: string[];
  specifications: Record<string, string>;
  features: string[];
  image: string;
  images?: string[];
  category: string;
  price: number | null;
  originalPrice: number | null;
  discount: number;
  inStock: boolean;
  stockStatus: "in_stock" | "out_of_stock" | "made_to_order";
  variants: ProductVariant[];
}

export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: true });
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  
  return data.map(p => ({
    id: p.id,
    name: p.name,
    shortDescription: p.short_description,
    description: p.description,
    applications: p.applications,
    specifications: p.specifications,
    features: p.features,
    image: p.image,
    images: (p.images && p.images.length > 0) 
      ? p.images 
      : (p.specifications && Array.isArray(p.specifications._gallery) && p.specifications._gallery.length > 0)
      ? p.specifications._gallery
      : (p.image ? [p.image] : []),
    category: p.category,
    price: p.price,
    originalPrice: p.original_price,
    discount: p.discount,
    inStock: p.in_stock,
    stockStatus: p.stock_status,
    variants: p.variants,
  }));
};

export const fetchProductById = async (id: string): Promise<Product | undefined> => {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error || !data) return undefined;
  
  return {
    id: data.id,
    name: data.name,
    shortDescription: data.short_description,
    description: data.description,
    applications: data.applications,
    specifications: data.specifications,
    features: data.features,
    image: data.image,
    images: (data.images && data.images.length > 0) 
      ? data.images 
      : (data.specifications && Array.isArray(data.specifications._gallery) && data.specifications._gallery.length > 0)
      ? data.specifications._gallery
      : (data.image ? [data.image] : []),
    category: data.category,
    price: data.price,
    originalPrice: data.original_price,
    discount: data.discount,
    inStock: data.in_stock,
    stockStatus: data.stock_status,
    variants: data.variants,
  };
};

export const fetchProductCategories = async (): Promise<string[]> => {
  const products = await fetchProducts();
  return [...new Set(products.map(p => p.category))];
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};
