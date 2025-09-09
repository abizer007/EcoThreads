import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Star, ThumbsUp, Flag, MessageCircle } from "lucide-react";

const reviews = [
  {
    id: 1,
    user: {
      name: "Sarah Johnson",
      avatar: "/placeholder-avatar.jpg",
      rating: 4.9,
      transactions: 47
    },
    rating: 5,
    date: "2 days ago",
    item: "Vintage Denim Jacket",
    comment: "Perfect condition! Exactly as described. Fast shipping and great communication from the seller. Highly recommend!",
    helpful: 12,
    type: "buyer"
  },
  {
    id: 2,
    user: {
      name: "Mike Chen",
      avatar: "/placeholder-avatar.jpg",
      rating: 4.8,
      transactions: 23
    },
    rating: 5,
    date: "1 week ago",
    item: "Nike Running Shoes",
    comment: "Great buyer! Quick payment and excellent communication. Would definitely sell to again.",
    helpful: 8,
    type: "seller"
  },
  {
    id: 3,
    user: {
      name: "Emma Wilson",
      avatar: "/placeholder-avatar.jpg",
      rating: 4.7,
      transactions: 31
    },
    rating: 4,
    date: "2 weeks ago",
    item: "Summer Dress Collection",
    comment: "Good quality items, though one dress had a small stain not mentioned in the description. Overall happy with the purchase.",
    helpful: 5,
    type: "buyer"
  }
];

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const starSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${starSize} ${
            star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

export function ReviewsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl text-gray-800 mb-4">Community Reviews & Trust</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our community-driven review system helps build trust between buyers and sellers, 
            ensuring safe and reliable transactions for everyone.
          </p>
        </div>

        {/* Trust Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center p-4">
            <div className="text-2xl text-green-600 mb-2">4.9</div>
            <div className="flex justify-center mb-1">
              <StarRating rating={5} />
            </div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </Card>
          
          <Card className="text-center p-4">
            <div className="text-2xl text-green-600 mb-2">15,847</div>
            <div className="text-sm text-gray-600">Total Reviews</div>
          </Card>
          
          <Card className="text-center p-4">
            <div className="text-2xl text-green-600 mb-2">98%</div>
            <div className="text-sm text-gray-600">Positive Feedback</div>
          </Card>
          
          <Card className="text-center p-4">
            <div className="text-2xl text-green-600 mb-2">24h</div>
            <div className="text-sm text-gray-600">Avg Response Time</div>
          </Card>
        </div>

        {/* Recent Reviews */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl text-gray-800 mb-6">Recent Reviews</h3>
          <div className="space-y-6">
            {reviews.map((review) => (
              <Card key={review.id} className="shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={review.user.avatar} alt={review.user.name} />
                      <AvatarFallback>{review.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <h4 className="text-sm">{review.user.name}</h4>
                          <Badge variant={review.type === "buyer" ? "default" : "secondary"}>
                            {review.type}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            {review.user.rating} ({review.user.transactions} transactions)
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">{review.date}</div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <StarRating rating={review.rating} />
                        <span className="text-sm text-gray-600">for "{review.item}"</span>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{review.comment}</p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-600">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Helpful ({review.helpful})
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Reply
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600">
                          <Flag className="h-4 w-4 mr-1" />
                          Report
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
              Load More Reviews
            </Button>
          </div>
        </div>

        {/* Review Guidelines */}
        <Card className="max-w-4xl mx-auto mt-12 bg-green-50">
          <CardHeader>
            <CardTitle className="text-lg">Review Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="mb-2 text-green-700">For Buyers:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Rate item condition and description accuracy</li>
                  <li>• Comment on seller communication and shipping</li>
                  <li>• Be honest and constructive in your feedback</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 text-green-700">For Sellers:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Rate buyer payment speed and communication</li>
                  <li>• Note any issues or positive experiences</li>
                  <li>• Help build trust within our community</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}