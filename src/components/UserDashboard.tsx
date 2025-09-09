import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ReviewForm } from "./ReviewForm";
import { Package, Star, Heart, Calendar, IndianRupee } from "lucide-react";
import { api, Item, Review } from "../utils/api";
import { supabase } from "../utils/supabase/client";
import { toast } from "sonner@2.0.3";

interface UserDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserDashboard({ isOpen, onClose }: UserDashboardProps) {
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      loadUserData();
    }
  }, [isOpen]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to view dashboard");
        onClose();
        return;
      }

      setUser(session.user);
      api.setAuthToken(session.access_token);

      // Load user's items and reviews
      const [itemsResponse, reviewsResponse] = await Promise.all([
        api.getAllItems(),
        api.getSellerReviews(session.user.id)
      ]);

      // Filter items by current user
      const myItems = itemsResponse.items.filter(item => item.sellerId === session.user.id);
      setUserItems(myItems);
      setUserReviews(reviewsResponse.reviews);

    } catch (error: any) {
      console.error("Error loading user data:", error);
      toast.error("Failed to load dashboard data");
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

  const averageRating = userReviews.length > 0 
    ? userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length
    : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl text-gray-800">Your Dashboard</h2>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-600">Loading your data...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="text-center p-4">
                    <Package className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl text-green-600">{userItems.length}</div>
                    <div className="text-sm text-gray-600">Items Listed</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="text-center p-4">
                    <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <div className="text-2xl text-green-600">{averageRating.toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="text-center p-4">
                    <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <div className="text-2xl text-green-600">{userReviews.length}</div>
                    <div className="text-sm text-gray-600">Reviews Received</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="text-center p-4">
                    <IndianRupee className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl text-green-600">
                      {userItems.filter(item => item.listingType === 'sell').length}
                    </div>
                    <div className="text-sm text-gray-600">Items for Sale</div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="items" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="items">My Listings</TabsTrigger>
                  <TabsTrigger value="reviews">My Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="items" className="space-y-4">
                  {userItems.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg text-gray-800 mb-2">No items listed yet</h3>
                      <p className="text-gray-600">Start by listing your first item!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {userItems.map((item) => (
                        <Card key={item.id}>
                          <div className="aspect-square relative overflow-hidden">
                            {item.images && item.images.length > 0 ? (
                              <ImageWithFallback
                                src={item.images[0]}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <Package className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
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
                            <h3 className="font-semibold text-gray-800 truncate mb-2">
                              {item.title}
                            </h3>
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                              <Badge variant="outline">{item.condition}</Badge>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(item.created_at)}</span>
                              </div>
                            </div>
                            <Badge 
                              className={item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                            >
                              {item.status}
                            </Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="reviews" className="space-y-4">
                  {userReviews.length === 0 ? (
                    <div className="text-center py-8">
                      <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg text-gray-800 mb-2">No reviews yet</h3>
                      <p className="text-gray-600">Start selling to receive reviews from buyers!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userReviews.map((review) => (
                        <Card key={review.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${
                                        star <= review.rating
                                          ? "text-yellow-400 fill-current"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600">
                                  by {review.buyerName}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500">
                                {formatDate(review.created_at)}
                              </span>
                            </div>
                            {review.comment && (
                              <p className="text-gray-700 text-sm">{review.comment}</p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}