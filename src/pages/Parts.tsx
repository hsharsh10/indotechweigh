import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Phone,
  Cpu,
  Battery,
  Cable,
  CircleDot,
  Settings
} from "lucide-react";
import { parts } from "@/data/parts";
import loadCellImage from "@/assets/load-cell.jpg";
import indicatorImage from "@/assets/weighing-indicator.jpg";
import batteryImage from "@/assets/battery.jpg";
import cableImage from "@/assets/cable-5amp.jpg";

const partIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "load-cells": CircleDot,
  "weighing-indicators": Cpu,
  "batteries": Battery,
  "cable-5amp": Cable
};

const partImages: Record<string, string> = {
  "load-cells": loadCellImage,
  "weighing-indicators": indicatorImage,
  "batteries": batteryImage,
  "cable-5amp": cableImage
};

export default function Parts() {
  const [expandedPart, setExpandedPart] = useState<string | null>(null);

  const togglePart = (id: string) => {
    setExpandedPart(expandedPart === id ? null : id);
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

      {/* Parts Overview */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-4 mb-12">
            {parts.map((part) => {
              const Icon = partIcons[part.id] || Settings;
              return (
                <button
                  key={part.id}
                  onClick={() => {
                    setExpandedPart(part.id);
                    document.getElementById(part.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="flex flex-col items-center p-6 rounded-lg bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all text-center"
                >
                  <Icon className="h-8 w-8 text-primary mb-3" />
                  <span className="text-sm font-medium text-foreground">{part.name}</span>
                </button>
              );
            })}
          </div>

          {/* Parts Details */}
          <div className="space-y-8">
            {parts.map((part) => {
              const Icon = partIcons[part.id] || Settings;
              const isExpanded = expandedPart === part.id;
              const hasImage = partImages[part.id];

              return (
                <Card key={part.id} id={part.id} className="overflow-hidden">
                  <CardHeader 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => togglePart(part.id)}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        {part.name}
                      </CardTitle>
                      <ChevronDown 
                        className={`h-5 w-5 text-muted-foreground transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                    <p className="text-muted-foreground mt-2 pl-13">{part.description}</p>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="border-t border-border pt-6">
                      <div className="grid lg:grid-cols-3 gap-8">
                        {/* Types & Image */}
                        <div>
                          {hasImage && (
                            <div className="aspect-square rounded-lg overflow-hidden mb-6 bg-muted">
                              <img 
                                src={partImages[part.id]} 
                                alt={part.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>

                        {/* Specifications */}
                        <div>
                          <h4 className="font-semibold text-foreground mb-3">Key Specifications</h4>
                          <dl className="space-y-3">
                            {Object.entries(part.specifications).map(([key, value]) => (
                              <div key={key} className="border-b border-border pb-2 last:border-0">
                                <dt className="text-sm font-medium text-foreground">{key}</dt>
                                <dd className="text-sm text-muted-foreground">{value}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>

                        {/* Applications & Importance */}
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-semibold text-foreground mb-3">Applications</h4>
                            <div className="flex flex-wrap gap-2">
                              {part.applications.map((app, index) => (
                                <Badge key={index} variant="outline" className="py-1">
                                  {app}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                            <h4 className="font-semibold text-foreground mb-2">
                              Role in Weighing Systems
                            </h4>
                            <p className="text-sm text-muted-foreground">{part.importance}</p>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-foreground mb-2">
                              Compatible With
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {part.compatibleProducts.map((product, index) => (
                                <Badge key={index} variant="secondary" className="py-1">
                                  {product}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Genuine Parts */}
      <section className="py-16 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose Genuine Parts?
            </h2>
            <p className="text-muted-foreground">
              Using authentic spare parts ensures optimal performance, accuracy, and longevity 
              of your weighing systems.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: "Guaranteed Quality", desc: "Factory-tested for accuracy and durability" },
              { title: "Perfect Fit", desc: "Designed specifically for your equipment" },
              { title: "Warranty Support", desc: "Full warranty on all genuine parts" },
              { title: "Technical Backup", desc: "Expert installation and support available" }
            ].map((item) => (
              <div key={item.title} className="text-center p-6">
                <CheckCircle2 className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
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
                Need Spare Parts?
              </h3>
              <p className="text-secondary-foreground/80">
                Contact us with your requirements for quick quotation and delivery.
              </p>
            </div>
            <Button size="lg" asChild>
              <Link to="/contact">
                <Phone className="mr-2 h-5 w-5" />
                Request Parts Quote
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
