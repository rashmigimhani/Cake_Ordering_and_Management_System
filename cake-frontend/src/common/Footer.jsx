import {
  Facebook,
  Instagram,
  Twitter,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold text-pink-400 mb-4">
              Sweet Bliss Cakes
            </h2>
            <p className="text-gray-300 mb-4">
              Creating delicious memories with our freshly baked cakes. From
              custom designs to classic flavors, we make every celebration
              sweeter.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-pink-400 transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-pink-400 transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-pink-400 transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-gray-300 hover:text-pink-400 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/cakes"
                  className="text-gray-300 hover:text-pink-400 transition-colors"
                >
                  Our Cakes
                </a>
              </li>
              <li>
                <a
                  href="/custom"
                  className="text-gray-300 hover:text-pink-400 transition-colors"
                >
                  Custom Orders
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-300 hover:text-pink-400 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-300 hover:text-pink-400 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-pink-400 mr-3 flex-shrink-0" />
                <p className="text-gray-300 text-sm">
                  123 Sweet Street, Cake City, CC 12345
                </p>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-pink-400 mr-3 flex-shrink-0" />
                <p className="text-gray-300 text-sm">(555) 123-CAKE</p>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-pink-400 mr-3 flex-shrink-0" />
                <p className="text-gray-300 text-sm">hello@sweetcakes.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm mb-4 md:mb-0">
              © 2023 Sweet Bliss Cakes. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="/privacy"
                className="text-gray-300 hover:text-pink-400 text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-gray-300 hover:text-pink-400 text-sm transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/cookies"
                className="text-gray-300 hover:text-pink-400 text-sm transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
