import { supabase } from "@/lib/supabase";

export interface Part {
  id: string;
  name: string;
  description: string;
  types?: string[];
  specifications: Record<string, string>;
  applications: string[];
  importance: string;
  compatibleProducts: string[];
  image: string;
  price: number;
  originalPrice: number;
  discount: number;
  inStock: boolean;
  stockStatus: "in_stock" | "out_of_stock" | "made_to_order";
}

export const fetchParts = async (): Promise<Part[]> => {
  const { data, error } = await supabase.from('parts').select('*').order('created_at', { ascending: true });
  if (error) {
    console.error("Error fetching parts:", error);
    return [];
  }
  
  return data.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    types: p.types,
    specifications: p.specifications,
    applications: p.applications,
    importance: p.importance,
    compatibleProducts: p.compatible_products,
    image: p.image,
    price: p.price,
    originalPrice: p.original_price,
    discount: p.discount,
    inStock: p.in_stock,
    stockStatus: p.stock_status,
  }));
};

export const fetchPartById = async (id: string): Promise<Part | undefined> => {
  const { data, error } = await supabase.from('parts').select('*').eq('id', id).single();
  if (error || !data) return undefined;
  
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    types: data.types,
    specifications: data.specifications,
    applications: data.applications,
    importance: data.importance,
    compatibleProducts: data.compatible_products,
    image: data.image,
    price: data.price,
    originalPrice: data.original_price,
    discount: data.discount,
    inStock: data.in_stock,
    stockStatus: data.stock_status,
  };
};
