import { Button } from "./ui/button";
import { Search, Heart, ShoppingBag, User, Leaf } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Leaf className="h-8 w-8 text-green-600" />
          <span className="text-2xl text-gray-800">EcoThreads</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex space-x-6">
            <a href="#browse" className="text-gray-700 hover:text-green-600 transition-colors">Browse</a>
            <a href="#sell" className="text-gray-700 hover:text-green-600 transition-colors">Sell</a>
            <a href="#donate" className="text-gray-700 hover:text-green-600 transition-colors">Donate</a>
            <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors">About</a>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search for clothes..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
            />
          </div>
          
          <Button variant="ghost" size="sm" className="p-2">
            <Heart className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="sm" className="p-2">
            <ShoppingBag className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="sm" className="p-2">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}