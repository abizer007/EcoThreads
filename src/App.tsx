import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { CategoryBrowse } from "./components/CategoryBrowse";
import { SellDonateSection } from "./components/SellDonateSection";
import { PaymentSection } from "./components/PaymentSection";
import { ReviewsSection } from "./components/ReviewsSection";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <CategoryBrowse />
      <SellDonateSection />
      <PaymentSection />
      <ReviewsSection />
      <Footer />
      <Toaster />
    </div>
  );
}