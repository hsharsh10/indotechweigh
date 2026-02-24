import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Scale,
  Award,
  Wrench,
  Clock,
  Truck,
  Building2,
  Factory,
  ShoppingBag,
  Zap,
  ChevronRight,
  CheckCircle2 } from
"lucide-react";
import heroImage from "@/assets/hero-weighbridge.jpg";

const offerings = [
{
  icon: Scale,
  title: "Weighbridges",
  description: "Pit type and pitless weighbridges for heavy vehicle weighing",
  link: "/products/electronic-weighbridge"
},
{
  icon: Building2,
  title: "Platform Scales",
  description: "Industrial platform scales for medium to heavy capacity",
  link: "/products/platform-scale"
},
{
  icon: Factory,
  title: "Industrial Scales",
  description: "Heavy-duty scales for factory and manufacturing use",
  link: "/products/industrial-weighing-scale"
},
{
  icon: Wrench,
  title: "Spare Parts",
  description: "Load cells, indicators, batteries and accessories",
  link: "/parts"
}];


const whyChooseUs = [
{
  icon: Clock,
  title: "25+ Years Experience",
  description: "Trusted by industries across India for over two decades"
},
{
  icon: Award,
  title: "Accurate & Reliable",
  description: "Precision-engineered solutions meeting international standards"
},
{
  icon: Wrench,
  title: "After-Sales Support",
  description: "Comprehensive AMC and service support nationwide"
}];


const industries = [
{ icon: Truck, name: "Transport & Logistics" },
{ icon: Factory, name: "Manufacturing" },
{ icon: ShoppingBag, name: "Retail & Commercial" },
{ icon: Zap, name: "Power Plants" },
{ icon: Building2, name: "Construction" },
{ icon: Scale, name: "Mining & Quarries" }];


export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}>

          <div className="absolute inset-0 bg-secondary/85" />
        </div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-foreground leading-tight mb-6">
              Precision Weighing Solutions for Every Industry
            </h1>
            <p className="text-lg md:text-xl text-secondary-foreground/90 mb-8 max-w-2xl">
              India's trusted manufacturer of electronic weighbridges, platform scales, and industrial weighing systems. 
              25+ years of delivering accuracy you can count on.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="text-base">
                <Link to="/products">
                  View Products
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base bg-transparent border-secondary-foreground text-secondary-foreground hover:bg-secondary-foreground/10">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Introduction */}
      <section className="py-16 lg:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Your Partner in Precision Weighing
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Indotech Electronic Weighing Systems is a leading manufacturer and supplier of 
              electronic weighing solutions in India. From heavy-duty weighbridges to precision 
              jewellery scales, we provide comprehensive weighing systems backed by exceptional 
              service and support.
            </p>
          </div>
        </div>
      </section>

      {/* Key Offerings */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Key Offerings
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complete range of weighing solutions for industrial, commercial, and retail applications
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offerings.map((item) =>
            <Card key={item.title} className="group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/30">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground mb-4 font-sans">{item.description}</p>
                  <Link
                  to={item.link}
                  className="inline-flex items-center text-primary font-medium hover:underline">

                    Learn More
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24 bg-primary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Why Choose Indotech?
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Trusted by leading industries for quality, reliability, and service excellence
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyChooseUs.map((item) =>
            <div key={item.title} className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-primary-foreground mb-2">{item.title}</h3>
                <p className="text-primary-foreground/80">{item.description}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Industries Served */}
      <section className="py-16 lg:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Industries We Serve
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our weighing solutions power operations across diverse sectors
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {industries.map((industry) =>
            <div
              key={industry.name}
              className="flex flex-col items-center p-6 rounded-lg bg-background border border-border hover:border-primary/30 hover:shadow-md transition-all">

                <industry.icon className="h-8 w-8 text-primary mb-3" />
                <span className="text-sm font-medium text-foreground text-center">{industry.name}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-foreground mb-6">
              Ready to Upgrade Your Weighing Systems?
            </h2>
            <p className="text-lg text-secondary-foreground/80 mb-8">
              Get in touch with our experts for a customized solution that meets your specific requirements.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild className="text-base">
                <Link to="/contact">
                  Get a Free Quote
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base bg-transparent border-secondary-foreground text-secondary-foreground hover:bg-secondary-foreground/10">
                <Link to="/products">Browse Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="py-8 bg-muted">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
            {[
            "Free Installation Support",
            "1-Year Warranty",
            "AMC Available",
            "Pan-India Service"].
            map((feature) =>
            <div key={feature} className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">{feature}</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>);

}