import { createClient } from "@supabase/supabase-js";
import { products } from "../data/products";
import { parts } from "../data/parts";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log("Starting catalog migration...");

  // 1. Migrate Products
  for (const product of products) {
    console.log(`Migrating product: ${product.name}`);
    const { error } = await supabase.from("products").upsert({
      id: product.id,
      name: product.name,
      short_description: product.shortDescription,
      description: product.description,
      applications: product.applications,
      specifications: product.specifications,
      features: product.features,
      image: product.image,
      category: product.category,
      price: product.price,
      original_price: product.originalPrice,
      discount: product.discount,
      in_stock: product.inStock,
      stock_status: product.stockStatus,
      variants: product.variants,
    });
    if (error) console.error("Error migrating product:", error);
  }

  // 2. Migrate Parts
  for (const part of parts) {
    console.log(`Migrating part: ${part.name}`);
    const { error } = await supabase.from("parts").upsert({
      id: part.id,
      name: part.name,
      description: part.description,
      types: part.types || [],
      specifications: part.specifications,
      applications: part.applications,
      importance: part.importance,
      compatible_products: part.compatibleProducts,
      image: part.image,
      price: part.price,
      original_price: part.originalPrice,
      discount: part.discount,
      in_stock: part.inStock,
      stock_status: part.stockStatus,
    });
    if (error) console.error("Error migrating part:", error);
  }

  console.log("Migration complete!");
}

migrate();
