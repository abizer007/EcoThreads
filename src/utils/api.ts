import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c04af404`;

export interface User {
  id: string;
  email: string;
  name: string;
  rating?: number;
  total_reviews?: number;
  created_at: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  size: string;
  condition: string;
  price: number;
  listingType: 'sell' | 'donate';
  sellerId: string;
  images: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  sellerId: string;
  buyerId: string;
  itemId?: string;
  rating: number;
  comment: string;
  created_at: string;
  buyerName?: string;
}

class ApiClient {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  clearAuthToken() {
    this.authToken = null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authToken || publicAnonKey}`,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(`API Error (${response.status}): ${errorData.error || 'Request failed'}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Auth methods
  async signup(email: string, password: string, name: string): Promise<{ user: User; message: string }> {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  // User methods
  async getUserProfile(userId: string): Promise<{ user: User }> {
    return this.request(`/user/${userId}`);
  }

  // Item methods
  async createItem(itemData: {
    title: string;
    description: string;
    category: string;
    size?: string;
    condition: string;
    price?: number;
    listingType: 'sell' | 'donate';
    images?: string[];
  }): Promise<{ item: Item }> {
    return this.request('/items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  }

  async getItemsByCategory(category: string): Promise<{ items: Item[] }> {
    return this.request(`/items/category/${category}`);
  }

  async getAllItems(): Promise<{ items: Item[] }> {
    return this.request('/items');
  }

  // File upload
  async uploadImage(file: File): Promise<{ path: string; url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.authToken || publicAnonKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`Upload Error (${response.status}): ${errorData.error || 'Upload failed'}`);
    }

    return await response.json();
  }

  // Review methods
  async createReview(reviewData: {
    sellerId: string;
    rating: number;
    comment?: string;
    itemId?: string;
  }): Promise<{ review: Review }> {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async getSellerReviews(sellerId: string): Promise<{ reviews: Review[] }> {
    return this.request(`/reviews/seller/${sellerId}`);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request('/health');
  }
}

// Export singleton instance
export const api = new ApiClient();

// Helper functions for working with Supabase auth
export const authHelpers = {
  // These would typically use the Supabase client directly
  async signIn(email: string, password: string) {
    // This is handled by Supabase auth, not our custom API
    console.log('Sign in would be handled by Supabase auth');
  },

  async signOut() {
    // This is handled by Supabase auth, not our custom API
    console.log('Sign out would be handled by Supabase auth');
    api.clearAuthToken();
  },

  async getSession() {
    // This is handled by Supabase auth, not our custom API
    console.log('Get session would be handled by Supabase auth');
    return null;
  },
};