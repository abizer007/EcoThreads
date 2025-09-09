import { useState } from "react";
import { toast } from "sonner@2.0.3";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Upload, IndianRupee, Heart, Camera } from "lucide-react";
import { api } from "../utils/api";
import { supabase } from "../utils/supabase/client";

export function SellDonateSection() {
  const [listingType, setListingType] = useState("sell");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    size: "",
    condition: "",
    price: "",
    images: [] as File[]
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length > 5) {
        toast.error("You can upload a maximum of 5 images");
        return;
      }
      setFormData({ ...formData, images: files });
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.category || !formData.condition) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (listingType === "sell" && (!formData.price || parseFloat(formData.price) <= 0)) {
      toast.error("Please enter a valid price for selling");
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to list an item");
        setIsSubmitting(false);
        return;
      }

      // Set auth token for API calls
      api.setAuthToken(session.access_token);

      // Upload images first
      let imageUrls: string[] = [];
      if (formData.images.length > 0) {
        const uploadPromises = formData.images.map(file => api.uploadImage(file));
        try {
          const uploadResults = await Promise.all(uploadPromises);
          imageUrls = uploadResults.map(result => result.url);
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          toast.error("Failed to upload images. Please try again.");
          setIsSubmitting(false);
          return;
        }
      }

      // Create item listing
      await api.createItem({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        size: formData.size,
        condition: formData.condition,
        price: listingType === "sell" ? parseFloat(formData.price) : 0,
        listingType: listingType as 'sell' | 'donate',
        images: imageUrls
      });

      toast.success(
        listingType === "sell" 
          ? "Item listed for sale successfully!" 
          : "Item listed for donation successfully!"
      );

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        size: "",
        condition: "",
        price: "",
        images: []
      });

    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error("Failed to create listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="sell" className="py-16 bg-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl text-gray-800 mb-4">Give Your Clothes a Second Life</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Whether you want to earn some money or help others, listing your clothes is easy and rewarding.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-green-600" />
                List Your Item
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sell or Donate Toggle */}
              <div className="space-y-3">
                <Label>What would you like to do?</Label>
                <RadioGroup value={listingType} onValueChange={setListingType} className="flex gap-8">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sell" id="sell" />
                    <Label htmlFor="sell" className="flex items-center gap-2 cursor-pointer">
                      <IndianRupee className="h-4 w-4 text-green-600" />
                      Sell for Money
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="donate" id="donate" />
                    <Label htmlFor="donate" className="flex items-center gap-2 cursor-pointer">
                      <Heart className="h-4 w-4 text-red-500" />
                      Donate for Free
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Item Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Vintage Denim Jacket"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mens">Men's Fashion</SelectItem>
                        <SelectItem value="womens">Women's Fashion</SelectItem>
                        <SelectItem value="kids">Kids' Clothing</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="size">Size</Label>
                      <Input
                        id="size"
                        placeholder="e.g., M, L, XL"
                        value={formData.size}
                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="condition">Condition</Label>
                      <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Like New</SelectItem>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {listingType === "sell" && (
                    <div>
                      <Label htmlFor="price">Price (₹)</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="500"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your item, its condition, and any special details..."
                      className="h-32"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="images">Photos (up to 5)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                      <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">PNG, JPG up to 10MB each</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      />
                    </div>
                    {formData.images.length > 0 && (
                      <p className="text-sm text-green-600 mt-2">
                        {formData.images.length} image(s) selected
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  className="bg-green-600 hover:bg-green-700 px-8"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? "Creating Listing..." 
                    : listingType === "sell" ? "List for Sale" : "List for Donation"
                  }
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}