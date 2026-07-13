import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  CheckCircle2,
  Phone,
  Cpu,
  Battery,
  Cable,
  CircleDot,
  Settings,
  ShoppingCart,
  Tag,
} from "lucide-react";
import { formatPrice } from "@/data/products";
import { fetchParts, type Part } from "@/data/parts";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { ScrollReveal } from "@/components/ScrollReveal";
import loadCellImage from "@/assets/load-cell.jpg";
import indicatorImage from "@/assets/weighing-indicator.jpg";
import batteryImage from "@/assets/battery.jpg";
import cableImage from "@/assets/cable-5amp.jpg";

const partImages: Record<string, string> = {
  "load-cells": loadCellImage,
  "weighing-indicators": indicatorImage,
  "batteries": batteryImage,
  "cable-5amp": cableImage,
};

function getPartImage(part: Part) {
  if (part.image?.startsWith("http")) return part.image;
  return partImages[part.id] || null;
}

function StockBadge({ status }: { status: string }) {
  if (status === "in_stock") return <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">In Stock</Badge>;
  if (status === "made_to_order") return <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">Made to Order</Badge>;
  return <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">Out of Stock</Badge>;
}

export default function Parts() {
  const { addToCart, isInCart } = useCart();
  const [addingId, setAddingId] = useState<string | null>(null);
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParts().then(data => {
      setParts(data);
      setLoading(false);
    });
  }, []);

  const handleAddToCart = (part: Part) => {
    setAddingId(part.id);
    addToCart({
      productId: part.id,
      name: part.name,
      price: part.price,
      originalPrice: part.originalPrice,
      quantity: 1,
      image: getPartImage(part) || "/placeholder.svg",
      type: "part",
    });
    toast.success(`${part.name} added to cart!`);
    setTimeout(() => setAddingId(null), 800);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-secondary py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-foreground mb-6">
              Parts & Components
            </h1>
            <p className="text-xl text-secondary-foreground/90">
              Genuine spare parts and components for all types of electronic weighing systems.
              Keep your equipment running at peak performance.
            </p>
          </div>
        </div>
      </section>

      {/* Parts Grid */}
      <section className="py-16 lg:py-24 min-h-[50vh]">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parts.map((part, index) => {
                const imgSrc = getPartImage(part);
                const alreadyInCart = isInCart(part.id);

                return (
                  <ScrollReveal key={part.id} animation="slide-up" delay={(index % 3) * 100}>
                    <Card
                      className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border hover:border-primary/30 hover:-translate-y-1 h-full"
                    >
                      {/* Image + Discount badge */}
                      <div className="relative aspect-[4/3] bg-muted flex items-center justify-center overflow-hidden">
                        {part.discount > 0 && (
                          <div className="absolute top-3 left-3 z-10">
                            <Badge className={`text-xs font-bold px-2 py-1 ${part.discount >= 20 ? "bg-red-500 text-white animate-pulse" : "bg-primary text-primary-foreground"}`}>
                              <Tag className="h-3 w-3 mr-1" />
                              {part.discount}% OFF
                            </Badge>
                          </div>
                        )}
                        {imgSrc ? (
                          <img src={imgSrc} alt={part.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Settings className="h-12 w-12 text-primary" />
                          </div>
                        )}
                      </div>

                      <CardContent className="p-6">
                        {/* Stock + name */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                            {part.name}
                          </h3>
                          <StockBadge status={part.stockStatus} />
                        </div>

                        {/* Price */}
                        <div className="mb-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-primary">
                              {formatPrice(part.price)}
                            </span>
                            {part.originalPrice > part.price && (
                              <span className="text-sm text-muted-foreground line-through">
                                {formatPrice(part.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            className="flex-1 transition-all duration-200"
                            onClick={() => handleAddToCart(part)}
                            disabled={addingId === part.id}
                          >
                            <ShoppingCart className={`h-4 w-4 mr-1.5 ${addingId === part.id ? "animate-bounce" : ""}`} />
                            {addingId === part.id ? "Added!" : alreadyInCart ? "In Cart" : "Add to Cart"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Why Genuine Parts */}
      <section className="py-16 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fade">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Why Choose Genuine Parts?
              </h2>
              <p className="text-muted-foreground">
                Using authentic spare parts ensures optimal performance, accuracy, and longevity
                of your weighing systems.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: "Guaranteed Quality", desc: "Factory-tested for accuracy and durability" },
              { title: "Perfect Fit", desc: "Designed specifically for your equipment" },
              { title: "Warranty Support", desc: "Full warranty on all genuine parts" },
              { title: "Technical Backup", desc: "Expert installation and support available" }
            ].map((item, index) => (
              <ScrollReveal key={item.title} animation="slide-up" delay={index * 100}>
                <div className="text-center p-6 h-full">
                  <CheckCircle2 className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="slide-up">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Need Spare Parts?
              </h2>
              <p className="text-muted-foreground mb-6">
                Contact us with your requirements for quick quotation and delivery.
              </p>
              <Button size="lg" asChild>
                <Link to="/contact">
                  <Phone className="mr-2 h-5 w-5" />
                  Request Parts Quote
                </Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
}
