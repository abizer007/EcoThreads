import { Button } from "./ui/button";
import { Recycle, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Hero() {
  return (
    <section className="bg-gradient-to-r from-green-50 to-blue-50 py-16">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 mb-8 lg:mb-0">
          <h1 className="text-4xl md:text-5xl mb-6 text-gray-800">
            Sustainable Fashion for a 
            <span className="text-green-600"> Better Tomorrow</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Give your clothes a second life. Buy, sell, or donate pre-loved fashion 
            and help reduce textile waste while building a sustainable community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-green-600 hover:bg-green-700 px-8 py-3">
              Start Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3">
              <Recycle className="mr-2 h-4 w-4" />
              Sell or Donate
            </Button>
          </div>
          
          <div className="flex items-center mt-8 text-sm text-gray-500">
            <div className="flex -space-x-2 mr-4">
              <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-yellow-500 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs">+</span>
              </div>
            </div>
            <span>Join 1,00,000+ eco-conscious fashion lovers across India</span>
          </div>
        </div>
        
        <div className="lg:w-1/2 flex justify-center">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1655252205273-844a139fd348?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGZhc2hpb24lMjBjbG90aGVzJTIwaGFuZ2luZ3xlbnwxfHx8fDE3NTc0MzI1OTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Sustainable fashion clothes hanging"
            className="rounded-lg shadow-lg max-w-md w-full"
          />
        </div>
      </div>
    </section>
  );
}