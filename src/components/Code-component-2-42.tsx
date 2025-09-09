import { Leaf, Facebook, Twitter, Instagram, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="h-8 w-8 text-green-400" />
              <span className="text-2xl">EcoThreads</span>
            </div>
            <p className="text-gray-300 mb-4">
              Building a sustainable fashion community through buying, selling, and donating pre-loved clothing.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-300 hover:text-green-400 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-300 hover:text-green-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-300 hover:text-green-400 cursor-pointer transition-colors" />
              <Mail className="h-5 w-5 text-gray-300 hover:text-green-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="mb-4">Shop</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-green-400 transition-colors">Men's Fashion</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Women's Fashion</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Kids' Clothing</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Accessories</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">New Arrivals</a></li>
            </ul>
          </div>

          {/* Sell/Donate Links */}
          <div>
            <h3 className="mb-4">Sell & Donate</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-green-400 transition-colors">How to Sell</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Donation Program</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Pricing Guide</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Seller Protection</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Success Stories</a></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="mb-4">Support</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-green-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Safety Guidelines</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © 2025 EcoThreads. All rights reserved. Making fashion sustainable, one thread at a time.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0 text-sm text-gray-300">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>15,847 items saved from waste</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}