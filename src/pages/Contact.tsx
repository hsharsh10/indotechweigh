import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Send,
  CheckCircle2,
  MessageCircle
} from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeEvcT-x7UIY1VxsuDiQoQVEO9nKxiM8TrozEgy3l4ppdQNEQ/formResponse";

    const formBody = new URLSearchParams({
      "entry.2005620554": formData.name.trim(),
      "entry.2041622693": formData.company.trim(),
      "entry.1045781291": formData.email.trim(),
      "entry.1065046570": formData.address.trim(),
      "entry.1166974658": formData.phone.trim(),
      "entry.839337160": formData.message.trim(),
    });

    try {
      await fetch(GOOGLE_FORM_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody.toString(),
      });

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        address: "",
        message: ""
      });
    } catch {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us via WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-secondary py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-foreground mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-secondary-foreground/90">
              Get in touch with our team for inquiries, quotations, or support. 
              We're here to help you find the perfect weighing solution.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Get In Touch
                </h2>
                <p className="text-muted-foreground mb-8">
                  Have questions about our products or services? Our team is ready 
                  to assist you. Reach out through any of the channels below.
                </p>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Office Address</h3>
                      <p className="text-sm text-muted-foreground">
                        Indotech Electronic Weighing Systems<br />
                        Sant Nagar, Burari<br />
                        Delhi, India - 110084
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                      <p className="text-sm text-muted-foreground">
                        <a href="tel:+919811262055" className="hover:text-primary transition-colors">
                          +91 98112 62055
                        </a>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email</h3>
                      <p className="text-sm text-muted-foreground">
                        <a href="mailto:indotechweigh@gmail.com" className="hover:text-primary transition-colors">
                          indotechweigh@gmail.com
                        </a><br />
                        <a href="mailto:indotechweigh@yahoo.co.in" className="hover:text-primary transition-colors">
                          indotechweigh@yahoo.co.in
                        </a>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Business Hours</h3>
                      <p className="text-sm text-muted-foreground">
                        Monday - Saturday: 9:00 AM - 6:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Organization Name</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Your organization name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Your full address"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message (Requirements) *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please describe your requirements in detail..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" disabled={isSubmitting} className="w-full md:w-auto">
                    {isSubmitting ? (
                      <>Sending...</>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>

                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">or</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      asChild
                    >
                      <a
                        href={`https://wa.me/919811262055?text=${encodeURIComponent(
                          `Hi, I'm ${formData.name || "[Name]"}.\nOrganization: ${formData.company || "N/A"}\nEmail: ${formData.email || "N/A"}\nPhone: ${formData.phone || "N/A"}\nAddress: ${formData.address || "N/A"}\n\n${formData.message || "I'd like to know more about your products."}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="mr-2 h-5 w-5" />
                        Chat on WhatsApp
                      </a>
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Our Location
          </h2>
          <div className="aspect-[16/6] rounded-lg overflow-hidden bg-muted border border-border">
            <iframe
              title="Indotech Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3498.123456789!2d77.1925!3d28.7495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d01a0a0a0a0a1%3A0x1234567890abcdef!2sSant%20Nagar%2C%20Burari%2C%20Delhi%20110084!5e0!3m2!1sen!2sin!4v1707000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* Quick Contact Strip */}
      <section className="py-8 bg-primary">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
            {[
              { icon: CheckCircle2, text: "Quick Response" },
              { icon: CheckCircle2, text: "Expert Consultation" },
              { icon: CheckCircle2, text: "Free Site Survey" },
              { icon: CheckCircle2, text: "Custom Solutions" }
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2">
                <item.icon className="h-5 w-5 text-primary-foreground" />
                <span className="text-sm font-medium text-primary-foreground">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
