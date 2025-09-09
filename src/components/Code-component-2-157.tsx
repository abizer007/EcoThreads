import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { IndianRupee, Heart, Star, User, Calendar } from "lucide-react";
import { api, Item } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface ItemBrowserProps {
  category?: string;
  title?: string;
}

export function ItemBrowser({ category, title }: ItemBrowserProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, [category]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (category) {
        response = await api.getItemsByCategory(category);
      } else {
        response = await api.getAllItems();
      }
      
      setItems(response.items);
    } catch (err: any) {
      console.error("Error fetching items:", err);
      setError(err.message || "Failed to load items");
      toast.error("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'excellent':
        return 'bg-blue-100 text-blue-800';
      case 'good':
        return 'bg-yellow-100 text-yellow-800';
      case 'fair':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Loading items...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchItems} className="bg-green-600 hover:bg-green-700">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl text-gray-800 mb-4">
            {title || (category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Fashion` : "All Items")}
          </h2>
          <p className="text-gray-600">
            {items.length} {items.length === 1 ? 'item' : 'items'} available
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl text-gray-800 mb-2">No items found</h3>
              <p className="text-gray-600">
                {category 
                  ? `No items available in ${category} category yet.`
                  : "No items have been listed yet."
                }
              </p>
              <p className="text-gray-600 mt-2">
                Be the first to list an item and help build our sustainable fashion community!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
                <div className="aspect-square relative overflow-hidden">
                  {item.images && item.images.length > 0 ? (
                    <ImageWithFallback
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Heart className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="absolute top-2 left-2">
                    <Badge className={getConditionColor(item.condition)}>
                      {item.condition}
                    </Badge>
                  </div>
                  
                  <div className="absolute top-2 right-2">
                    {item.listingType === 'donate' ? (
                      <Badge className="bg-red-100 text-red-800">FREE</Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-800">
                        {formatPrice(item.price)}
                      </Badge>
                    )}
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-800 truncate" title={item.title}>
                      {item.title}
                    </h3>
                    
                    {item.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>Seller</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(item.created_at)}</span>
                      </div>
                    </div>

                    {item.size && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Size:</span>
                        <Badge variant="outline" className="text-xs">
                          {item.size}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
                      {item.listingType === 'donate' ? 'Request Item' : 'Buy Now'}
                    </Button>
                    <Button variant="outline" size="sm" className="p-2">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}