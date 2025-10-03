import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Instagram } from "lucide-react";
import logo from "@/assets/sicopack-logo.png";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src={logo} alt="Sicopack Logo" className="h-10 w-10" />
              <h3 className="text-2xl font-bold font-playfair">Sicopack</h3>
            </div>
            <p className="text-background/80 mb-4">
              Premium packaging solutions for your products
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-background/80 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/80 hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-background/80 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/company" className="text-background/80 hover:text-primary transition-colors">
                  Company
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-background/80 hover:text-primary transition-colors">
                  Catalog
                </Link>
              </li>
              <li>
                <Link to="/sustainability" className="text-background/80 hover:text-primary transition-colors">
                  Sustainability
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Products</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/catalog/cosmetics" className="text-background/80 hover:text-primary transition-colors">
                  Cosmetics
                </Link>
              </li>
              <li>
                <Link to="/catalog/pharma" className="text-background/80 hover:text-primary transition-colors">
                  Pharmaceuticals
                </Link>
              </li>
              <li>
                <Link to="/catalog/food" className="text-background/80 hover:text-primary transition-colors">
                  Food Packaging
                </Link>
              </li>
              <li>
                <Link to="/catalog/professional" className="text-background/80 hover:text-primary transition-colors">
                  Professional
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-background/80">info@packaging.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-background/80">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-background/80">123 Packaging Street, Industrial Zone</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 text-center text-background/60">
          <p>&copy; {new Date().getFullYear()} Sicopack. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
