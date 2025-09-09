import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Search, Heart, ShoppingBag, User, Leaf, LogOut, Settings } from "lucide-react";
import { AuthModal } from "./AuthModal";
import { UserDashboard } from "./UserDashboard";
import { supabase } from "../utils/supabase/client";
import { api } from "../utils/api";
import { toast } from "sonner@2.0.3";

export function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        api.setAuthToken(session.access_token);
      }
    };
    
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
          api.setAuthToken(session.access_token);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          api.clearAuthToken();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  };
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
          
          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 hidden sm:block">
                Hello, {user.user_metadata?.name || user.email}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2"
                onClick={() => setIsDashboardOpen(true)}
                title="Dashboard"
              >
                <Settings className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2"
                onClick={handleSignOut}
                title="Sign Out"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2"
              onClick={() => setIsAuthModalOpen(true)}
              title="Sign In / Sign Up"
            >
              <User className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setUser(user);
        }}
      />

      <UserDashboard
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
      />
    </header>
  );
}