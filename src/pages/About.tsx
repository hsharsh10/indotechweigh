import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Target, 
  Eye, 
  Award, 
  CheckCircle2, 
  Shield, 
  Lightbulb, 
  Users,
  Wrench,
  Star
} from "lucide-react";

const coreValues = [
  {
    icon: Target,
    title: "Accuracy",
    description: "Precision in every measurement, ensuring reliable results for critical operations"
  },
  {
    icon: Shield,
    title: "Reliability",
    description: "Robust systems built to perform consistently in demanding industrial environments"
  },
  {
    icon: Wrench,
    title: "Service",
    description: "Dedicated support and maintenance ensuring maximum uptime for your operations"
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Continuous improvement in technology and solutions to meet evolving industry needs"
  }
];

const expertise = [
  "Manufacturing of electronic weighing systems",
  "Installation and commissioning",
  "Calibration and certification",
  "Annual Maintenance Contracts (AMC)",
  "Repair and refurbishment services",
  "Custom weighing solutions design",
  "Software integration and automation",
  "Training and technical support"
];

const achievements = [
  { number: "25+", label: "Years of Experience" },
  { number: "5000+", label: "Installations Completed" },
  { number: "1000+", label: "Satisfied Clients" },
  { number: "50+", label: "Service Engineers" }
];

export default function About() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-secondary py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-foreground mb-6">
              About Indotech
            </h1>
            <p className="text-xl text-secondary-foreground/90">
              India's trusted name in electronic weighing systems, delivering precision and 
              reliability for over 25 years.
            </p>
          </div>
        </div>
      </section>

      {/* Company Background */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Journey
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Established in the late 1990s, Indotech Electronic Weighing Systems began with a 
                  simple mission: to provide accurate, reliable, and affordable weighing solutions 
                  to Indian industries. What started as a small workshop has grown into one of 
                  India's most trusted names in electronic weighing systems.
                </p>
                <p>
                  Over the years, we have served thousands of clients across diverse sectors - 
                  from small businesses to large industrial corporations. Our commitment to quality, 
                  innovation, and customer satisfaction has made us the preferred choice for 
                  weighing solutions nationwide.
                </p>
                <p>
                  Today, we offer a comprehensive range of products including electronic weighbridges, 
                  platform scales, industrial scales, and precision instruments, all backed by our 
                  extensive service network spanning across India.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((item) => (
                <Card key={item.label} className="text-center">
                  <CardContent className="p-6">
                    <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                      {item.number}
                    </div>
                    <div className="text-sm text-muted-foreground">{item.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 lg:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-primary/20">
              <CardContent className="p-8">
                <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To provide innovative, accurate, and reliable weighing solutions that empower 
                  businesses to operate efficiently. We are committed to delivering exceptional 
                  value through quality products, technical expertise, and responsive customer service.
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardContent className="p-8">
                <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Eye className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To be India's most trusted partner in precision weighing, recognized for our 
                  innovation, quality, and commitment to customer success. We strive to set 
                  industry standards in accuracy, reliability, and service excellence.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value) => (
              <Card key={value.title} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="py-16 lg:py-24 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
                Our Expertise
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8">
                With decades of experience, we offer comprehensive solutions covering every 
                aspect of weighing systems - from manufacturing to ongoing support.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {expertise.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary-foreground flex-shrink-0" />
                    <span className="text-primary-foreground/90">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-primary-foreground/10 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Star className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary-foreground">Quality Assurance</h3>
                  <p className="text-primary-foreground/70">ISO Standards Compliant</p>
                </div>
              </div>
              <p className="text-primary-foreground/80 leading-relaxed">
                Every product undergoes rigorous quality testing to ensure accuracy and durability. 
                Our quality management system follows international standards, and our calibration 
                processes are traceable to national standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Focus */}
      <section className="py-16 lg:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Customer-First Approach
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              At Indotech, customer satisfaction is not just a goal - it's our foundation. We 
              believe in building long-term relationships through transparent communication, 
              honest dealings, and unwavering support. Our dedicated team is always ready to 
              understand your unique requirements and deliver solutions that exceed expectations.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                "24/7 Technical Support",
                "Pan-India Service Network",
                "Genuine Spare Parts",
                "Expert Consultation"
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 bg-background px-4 py-2 rounded-full border border-border">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
