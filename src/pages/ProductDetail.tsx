import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ChevronLeft, 
  ChevronRight,
  Scale, 
  CheckCircle2, 
  Wrench, 
  Phone,
  Settings,
  Target,
  Package,
  ShoppingCart,
  Minus,
  Plus,
  Tag
} from "lucide-react";
import { fetchProductById, fetchProducts, formatPrice, type Product, type ProductVariant } from "@/data/products";
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

function StockBadge({ status }: { status: string }) {
  if (status === "in_stock") return <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">In Stock</Badge>;
  if (status === "made_to_order") return <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">Made to Order</Badge>;
  return <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">Out of Stock</Badge>;
}

function getProductImage(product: Product) {
  if (product.image?.startsWith("http://") || product.image?.startsWith("https://")) return product.image;
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
  return map[product.id] || null;
}

function resolveImageUrl(url: string | null | undefined, product: Product): string | null {
  if (url && (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:"))) {
    return url;
  }
  return getProductImage(product);
}

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const { addToCart, isInCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!productId) return;
      setLoading(true);
      const prod = await fetchProductById(productId);
      if (prod) {
        setProduct(prod);
        const imagesList = prod.images && prod.images.length > 0 ? prod.images : (prod.image ? [prod.image] : []);
        if (imagesList.length > 0) {
          setActiveImage(imagesList[0]);
        }
      } else {
        setProduct(null);
      }
      const allProducts = await fetchProducts();
      setRelatedProducts(allProducts.filter(p => p.id !== productId).slice(0, 3));
      setLoading(false);
    }
    loadData();
  }, [productId]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return <Navigate to="/products" replace />;
  }

  const currentPrice = product.price;
  const currentOriginalPrice = product.originalPrice;
  const displayImgSrc = resolveImageUrl(activeImage, product);
  
  const rawImages = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);
  const allImages = rawImages.map(img => resolveImageUrl(img, product)).filter((img): img is string => Boolean(img));
  const uniqueImages = [...new Set(allImages)];

  const alreadyInCart = isInCart(product.id);

  const handleAddToCart = () => {
    setAdding(true);
    addToCart({
      productId: product.id,
      name: product.name,
      price: 0,
      originalPrice: 0,
      quantity,
      image: displayImgSrc || "/placeholder.svg",
      type: "product",
    });
    toast.success(`${product.name} added to enquiry list!`);
    setTimeout(() => setAdding(false), 800);
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <section className="bg-muted py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/products" className="text-primary hover:underline flex items-center">
              <ChevronLeft className="h-4 w-4" />
              Back to Products
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </section>

      {/* Product Header */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image Column */}
            <div className="space-y-4">
              <div className="aspect-square bg-card rounded-2xl border border-border flex items-center justify-center overflow-hidden relative">
                {product.discount > 0 && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-red-500 text-white text-sm font-bold px-3 py-1">
                      <Tag className="h-4 w-4 mr-1" />
                      {product.discount}% OFF
                    </Badge>
                  </div>
                )}
                {displayImgSrc ? (
                  <img src={displayImgSrc} alt={product.name} className="w-full h-full object-contain p-8 transition-all duration-300" />
                ) : (
                  <div className="h-48 w-48 rounded-full bg-primary/10 flex items-center justify-center">
                    <Scale className="h-24 w-24 text-primary" />
                  </div>
                )}
              </div>

              {/* Multiple Images Thumbnail Strip */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {allImages.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(url)}
                      className={`h-16 w-16 rounded-xl border-2 overflow-hidden flex-shrink-0 bg-card p-1 transition-all ${
                        displayImgSrc === url ? "border-primary ring-2 ring-primary/20 scale-105" : "border-border opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={url} alt={`${product.name} ${i + 1}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary">{product.category || "Electronic Weighing"}</Badge>
                <StockBadge status={product.stockStatus} />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>

              {/* Price Section */}
              <div className="mb-6">
                <Badge variant="outline" className="text-sm px-3 py-1 font-semibold text-primary border-primary/30">
                  Price on Request
                </Badge>
              </div>

              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Specifications Pills */}
              <div className="flex flex-wrap gap-4 mb-8">
                {product.specifications?.capacity && (
                  <div className="flex items-center gap-2 text-sm bg-muted px-3 py-1.5 rounded-lg">
                    <Settings className="h-4 w-4 text-primary" />
                    <span className="text-foreground">Capacity: {product.specifications.capacity}</span>
                  </div>
                )}
                {product.specifications?.accuracy && (
                  <div className="flex items-center gap-2 text-sm bg-muted px-3 py-1.5 rounded-lg">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="text-foreground">Accuracy: {product.specifications.accuracy}</span>
                  </div>
                )}
              </div>

              {/* Add to Enquiry Actions */}
              <div className="space-y-4 mb-8 pt-2">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="flex-1 text-base py-6"
                    onClick={handleAddToCart}
                    disabled={adding}
                  >
                    <ShoppingCart className={`mr-2 h-5 w-5 ${adding ? "animate-bounce" : ""}`} />
                    {adding ? "Adding to list..." : alreadyInCart ? "Add More to Enquiry List" : "Add to Enquiry List"}
                  </Button>
                  <Button size="lg" variant="outline" asChild className="py-6">
                    <Link to="/checkout">
                      <ChevronRight className="mr-2 h-5 w-5" />
                      Proceed to Enquiry
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Product Details Tabs / Sections */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Applications */}
            {product.applications && product.applications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {product.applications.map((app, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground">{app}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).filter(k => k !== "_gallery").length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Technical Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-3">
                    {Object.entries(product.specifications)
                      .filter(([key]) => key !== "_gallery")
                      .map(([key, value]) => (
                        <div key={key} className="border-b border-border pb-2 last:border-0">
                          <dt className="text-sm font-medium text-foreground capitalize">{key}</dt>
                          <dd className="text-sm text-muted-foreground">{String(value)}</dd>
                        </div>
                      ))}
                  </dl>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Key Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* AMC Support Section */}
      <section className="py-12 lg:py-16 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
              <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" />
                AMC & Service Support
              </h3>
              <p className="text-muted-foreground mb-4">
                Comprehensive Annual Maintenance Contract (AMC) available for all our products. 
                Our Delhi NCR service network ensures prompt support and minimal downtime.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Regular preventive maintenance
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Priority breakdown support
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Genuine spare parts supply
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-secondary-foreground mb-2">
                Interested in {product.name}?
              </h3>
              <p className="text-secondary-foreground/80">
                Contact us for pricing, specifications, and customization options.
              </p>
            </div>
            <Button size="lg" asChild>
              <Link to="/contact">
                <Phone className="mr-2 h-5 w-5" />
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
