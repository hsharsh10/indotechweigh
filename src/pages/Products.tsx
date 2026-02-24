import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Scale } from "lucide-react";
import { products } from "@/data/products";
import tableTopScale from "@/assets/table-top-scale.png";
import platformScale from "@/assets/platform-scale.png";
import industrialScale from "@/assets/industrial-weighing-scale.png";
import craneScale from "@/assets/crane-scale.png";
import electronicWeighbridge from "@/assets/electronic-weighbridge.png";
import personalScale from "@/assets/personal-scale-new.jpg";
import jewelleryScale from "@/assets/jewellery-scale.jpg";
import customWeighingSolutions from "@/assets/custom-weighing-solutions.png";

export default function Products() {
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
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card 
                key={product.id} 
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border hover:border-primary/30"
              >
                <div className="aspect-[4/3] bg-muted flex items-center justify-center overflow-hidden">
                  {product.id === "table-top-scale" ? (
                    <img src={tableTopScale} alt={product.name} className="w-full h-full object-contain p-4" />
                  ) : product.id === "platform-scale" ? (
                    <img src={platformScale} alt={product.name} className="w-full h-full object-contain p-4" />
                  ) : product.id === "industrial-weighing-scale" ? (
                    <img src={industrialScale} alt={product.name} className="w-full h-full object-contain p-4" />
                  ) : product.id === "crane-scale" ? (
                    <img src={craneScale} alt={product.name} className="w-full h-full object-contain p-4" />
                  ) : product.id === "electronic-weighbridge" ? (
                    <img src={electronicWeighbridge} alt={product.name} className="w-full h-full object-contain p-4" />
                  ) : product.id === "personal-scale" ? (
                    <img src={personalScale} alt={product.name} className="w-full h-full object-contain p-4" />
                  ) : product.id === "jewellery-scale" ? (
                    <img src={jewelleryScale} alt={product.name} className="w-full h-full object-contain p-4" />
                  ) : product.id === "custom-weighing-solutions" ? (
                    <img src={customWeighingSolutions} alt={product.name} className="w-full h-full object-contain p-4" />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Scale className="h-12 w-12 text-primary" />
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {product.shortDescription}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Capacity: {product.specifications.capacity.split(" to ")[0]}+
                    </span>
                    <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary">
                      <Link to={`/products/${product.id}`}>
                        View Details
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
