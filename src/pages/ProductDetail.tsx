import { useParams, Link, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronLeft, 
  Scale, 
  CheckCircle2, 
  Wrench, 
  Phone,
  Settings,
  Target,
  Package
} from "lucide-react";
import { getProductById, products } from "@/data/products";
import tableTopScale from "@/assets/table-top-scale.png";
import platformScale from "@/assets/platform-scale.png";
import industrialScale from "@/assets/industrial-weighing-scale.png";
import craneScale from "@/assets/crane-scale.png";
import electronicWeighbridge from "@/assets/electronic-weighbridge.png";
import personalScale from "@/assets/personal-scale-new.jpg";
import jewelleryScale from "@/assets/jewellery-scale.jpg";
import customWeighingSolutions from "@/assets/custom-weighing-solutions.png";

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const product = productId ? getProductById(productId) : undefined;

  if (!product) {
    return <Navigate to="/products" replace />;
  }

  const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 3);

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
            {/* Product Image */}
            <div className="aspect-square bg-card rounded-2xl border border-border flex items-center justify-center overflow-hidden">
              {product.id === "table-top-scale" ? (
                <img src={tableTopScale} alt={product.name} className="w-full h-full object-contain p-8" />
              ) : product.id === "platform-scale" ? (
                <img src={platformScale} alt={product.name} className="w-full h-full object-contain p-8" />
              ) : product.id === "industrial-weighing-scale" ? (
                <img src={industrialScale} alt={product.name} className="w-full h-full object-contain p-8" />
              ) : product.id === "crane-scale" ? (
                <img src={craneScale} alt={product.name} className="w-full h-full object-contain p-8" />
              ) : product.id === "electronic-weighbridge" ? (
                <img src={electronicWeighbridge} alt={product.name} className="w-full h-full object-contain p-8" />
              ) : product.id === "personal-scale" ? (
                <img src={personalScale} alt={product.name} className="w-full h-full object-contain p-8" />
              ) : product.id === "jewellery-scale" ? (
                <img src={jewelleryScale} alt={product.name} className="w-full h-full object-contain p-8" />
              ) : product.id === "custom-weighing-solutions" ? (
                <img src={customWeighingSolutions} alt={product.name} className="w-full h-full object-contain p-8" />
              ) : (
                <div className="h-48 w-48 rounded-full bg-primary/10 flex items-center justify-center">
                  <Scale className="h-24 w-24 text-primary" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <Badge variant="secondary" className="mb-4">Electronic Weighing</Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {product.description}
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm">
                  <Settings className="h-4 w-4 text-primary" />
                  <span className="text-foreground">Capacity: {product.specifications.capacity}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-foreground">Accuracy: {product.specifications.accuracy}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link to="/contact">
                    <Phone className="mr-2 h-5 w-5" />
                    Request a Quote
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/parts">View Spare Parts</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Product Details */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Applications */}
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

            {/* Technical Specifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Technical Specifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key}>
                      <dt className="text-sm font-medium text-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </dt>
                      <dd className="text-sm text-muted-foreground">{value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Features & Benefits
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
          </div>
        </div>
      </section>

      {/* Accessories & Support */}
      <section className="py-12 lg:py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            {/* AMC Support */}
            <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
              <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" />
                AMC & Service Support
              </h3>
              <p className="text-muted-foreground mb-4">
                Comprehensive Annual Maintenance Contract (AMC) available for all our products. 
                Our pan-India service network ensures prompt support and minimal downtime.
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
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Calibration and certification
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-8">Related Products</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="group hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Scale className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {relatedProduct.shortDescription}
                  </p>
                  <Button variant="ghost" size="sm" asChild className="p-0 h-auto text-primary hover:text-primary">
                    <Link to={`/products/${relatedProduct.id}`}>
                      View Details →
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
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
