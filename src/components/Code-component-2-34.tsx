import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { CreditCard, Shield, Lock, CheckCircle } from "lucide-react";

export function PaymentSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl text-gray-800 mb-4">Secure & Easy Payments</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our secure payment system protects both buyers and sellers with encrypted transactions and buyer protection.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Payment Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  className="font-mono"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    className="font-mono"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    className="font-mono"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="applepay">Apple Pay</SelectItem>
                    <SelectItem value="googlepay">Google Pay</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Lock className="h-4 w-4 mr-2" />
                Complete Secure Payment
              </Button>
            </CardContent>
          </Card>

          {/* Security Features */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Payment Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm">256-bit SSL Encryption</h4>
                      <p className="text-xs text-gray-600">Your payment information is encrypted and secure</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm">Buyer Protection</h4>
                      <p className="text-xs text-gray-600">Get your money back if items don't match description</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm">Secure Escrow</h4>
                      <p className="text-xs text-gray-600">Payments held securely until delivery confirmed</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm">Fraud Prevention</h4>
                      <p className="text-xs text-gray-600">Advanced fraud detection and prevention systems</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-green-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="flex justify-center space-x-4 mb-4">
                    <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs">VISA</span>
                    </div>
                    <div className="w-12 h-8 bg-red-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs">MC</span>
                    </div>
                    <div className="w-12 h-8 bg-blue-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs">AMEX</span>
                    </div>
                    <div className="w-12 h-8 bg-blue-700 rounded flex items-center justify-center">
                      <span className="text-white text-xs">PP</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    We accept all major payment methods
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}