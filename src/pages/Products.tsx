import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Scale, ShoppingCart, Tag } from "lucide-react";
import { fetchProducts, formatPrice, type Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import tableTopScale from "@/assets/table-top-scale.png";
import platformScale from "@/assets/platform-scale.png";
import industrialScale from "@/assets/industrial-weighing-scale.png";
import craneScale from "@/assets/crane-scale.png";
import electronicWeighbridge from "@/assets/electronic-weighbridge.png";
import personalScale from "@/assets/personal-scale-new.jpg";
import jewelleryScale from "@/assets/jewellery-scale.jpg";
import customWeighingSolutions from "@/assets/custom-weighing-solutions.png";

function getProductImage(productId: string) {
  const map: Record<string, string> = {
    "table-top-scale": tableTopScale,
    "platform-scale": platformScale,
    "industrial-weighing-scale": industrialScale,
    "crane-scale": craneScale,
    "electronic-weighbridge": electronicWeighbridge,
    "personal-scale": personalScale,
    "jewellery-scale": jewelleryScale,
    "custom-weighing-solutions": customWeighingSolutions,
  };
  return map[productId] || null;
}

function StockBadge({ status }: { status: string }) {
  if (status === "in_stock") return <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">In Stock</Badge>;
  if (status === "made_to_order") return <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">Made to Order</Badge>;
  return <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">Out of Stock</Badge>;
}

export default function Products() {
  const { addToCart, isInCart } = useCart();
  const [addingId, setAddingId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const handleAddToCart = (product: Product) => {
    if (!product.price) return;
    setAddingId(product.id);
    const baseVariant = product.variants[0];
    addToCart({
      productId: product.id,
      name: product.name,
      price: baseVariant ? baseVariant.price : product.price,
      originalPrice: baseVariant ? baseVariant.originalPrice : (product.originalPrice ?? product.price),
      quantity: 1,
      variant: baseVariant ? baseVariant.label : undefined,
      variantId: baseVariant ? baseVariant.id : undefined,
      image: product.image,
      type: "product",
    });
    toast.success(`${product.name} added to cart!`, {
      description: baseVariant ? `Variant: ${baseVariant.label}` : "Select variant on product page for other sizes",
    });
    setTimeout(() => setAddingId(null), 800);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-secondary py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-foreground mb-6">
              Our Products
            </h1>
            <p className="text-xl text-secondary-foreground/90">
              Comprehensive range of electronic weighing systems designed for accuracy,
              durability, and reliability across all industries.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 lg:py-24 min-h-[50vh]">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
              const imgSrc = product.image?.startsWith("http") ? product.image : getProductImage(product.id);
              const alreadyInCart = product.price ? isInCart(product.id, product.variants[0]?.id) : false;

              return (
                <Card
                  key={product.id}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border hover:border-primary/30 hover:-translate-y-1"
                >
                  {/* Image + Discount badge */}
                  <div className="relative aspect-[4/3] bg-muted flex items-center justify-center overflow-hidden">
                    {product.discount > 0 && (
                      <div className="absolute top-3 left-3 z-10">
                        <Badge className={`text-xs font-bold px-2 py-1 ${product.discount >= 20 ? "bg-red-500 text-white animate-pulse" : "bg-primary text-primary-foreground"}`}>
                          <Tag className="h-3 w-3 mr-1" />
                          {product.discount}% OFF
                        </Badge>
                      </div>
                    )}
                    {imgSrc ? (
                      <img src={imgSrc} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Scale className="h-12 w-12 text-primary" />
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    {/* Stock + name */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <StockBadge status={product.stockStatus} />
                    </div>

                    <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                      {product.shortDescription}
                    </p>

                    {/* Price */}
                    <div className="mb-4">
                      {product.price ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-primary">
                            {formatPrice(product.variants[0]?.price ?? product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(product.variants[0]?.originalPrice ?? product.originalPrice)}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-muted-foreground italic">Price on Request</span>
                      )}
                      {product.variants.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Starting from · {product.variants.length} variants available
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {product.price ? (
                        <Button
                          size="sm"
                          className="flex-1 transition-all duration-200"
                          onClick={() => handleAddToCart(product)}
                          disabled={addingId === product.id}
                        >
                          <ShoppingCart className={`h-4 w-4 mr-1.5 ${addingId === product.id ? "animate-bounce" : ""}`} />
                          {addingId === product.id ? "Added!" : alreadyInCart ? "In Cart" : "Add to Cart"}
                        </Button>
                      ) : (
                        <Button size="sm" className="flex-1" asChild>
                          <Link to="/contact">Get Quote</Link>
                        </Button>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/products/${product.id}`}>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Need a Custom Solution?
            </h2>
            <p className="text-muted-foreground mb-6">
              Our engineering team can design weighing systems tailored to your specific requirements.
            </p>
            <Button size="lg" asChild>
              <Link to="/contact">
                Contact Our Experts
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
