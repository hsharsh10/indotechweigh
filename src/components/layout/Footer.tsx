import { Link } from "react-router-dom";
import { Scale, Phone, Mail, MapPin } from "lucide-react";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Products", href: "/products" },
  { name: "Parts & Components", href: "/parts" },
  { name: "Contact Us", href: "/contact" },
];

const products = [
  { name: "Electronic Weighbridge", href: "/products/electronic-weighbridge" },
  { name: "Platform Scale", href: "/products/platform-scale" },
  { name: "Industrial Weighing Scale", href: "/products/industrial-weighing-scale" },
  { name: "Crane Scale", href: "/products/crane-scale" },
  { name: "Custom Solutions", href: "/products/custom-weighing-solutions" },
];

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Scale className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight">Indotech</span>
                <span className="text-xs opacity-80 leading-tight">Electronic Weighing Systems</span>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Leading manufacturer and supplier of electronic weighing systems in India. 
              Trusted by industries for 25+ years.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Products</h4>
            <ul className="space-y-2">
              {products.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 opacity-80 flex-shrink-0" />
                <span className="text-sm opacity-80">
                  Sant Nagar, Burari,<br />
                  Delhi, India - 110084
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 opacity-80 flex-shrink-0" />
                <a href="tel:+919811262055" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  +91 98112 62055
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 opacity-80 flex-shrink-0" />
                <a href="mailto:indotechweigh@gmail.com" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  indotechweigh@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm opacity-70">
              © {new Date().getFullYear()} Indotech Electronic Weighing Systems. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-sm opacity-70 hover:opacity-100 transition-opacity">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm opacity-70 hover:opacity-100 transition-opacity">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
