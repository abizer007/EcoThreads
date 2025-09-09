import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Configure CORS and logging
app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['*'],
}));
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Create storage buckets on startup
const ITEMS_BUCKET = 'make-c04af404-items';

async function initializeStorage() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === ITEMS_BUCKET);
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(ITEMS_BUCKET, {
        public: false,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
      });
      if (error) {
        console.log(`Error creating bucket: ${error.message}`);
      } else {
        console.log(`Created bucket: ${ITEMS_BUCKET}`);
      }
    }
  } catch (error) {
    console.log(`Storage initialization error: ${error}`);
  }
}

// Initialize storage on startup
initializeStorage();

// User signup route
app.post('/make-server-c04af404/auth/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured
      email_confirm: true
    });

    if (error) {
      console.log(`User signup error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Store user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email: data.user.email,
      name,
      created_at: new Date().toISOString(),
      rating: 0,
      total_reviews: 0
    });

    return c.json({ 
      message: 'User created successfully',
      user: { id: data.user.id, email: data.user.email, name }
    });
  } catch (error) {
    console.log(`Signup error: ${error}`);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Get user profile
app.get('/make-server-c04af404/user/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401);
    }

    const { data: authUser, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !authUser.user) {
      return c.json({ error: 'Invalid authorization token' }, 401);
    }

    const userId = c.req.param('id');
    const user = await kv.get(`user:${userId}`);

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ user });
  } catch (error) {
    console.log(`Get user profile error: ${error}`);
    return c.json({ error: 'Internal server error while fetching user profile' }, 500);
  }
});

// Create item listing
app.post('/make-server-c04af404/items', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401);
    }

    const { data: authUser, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !authUser.user) {
      return c.json({ error: 'Invalid authorization token' }, 401);
    }

    const body = await c.req.json();
    const { title, description, category, size, condition, price, listingType, images } = body;

    if (!title || !category || !condition || !listingType) {
      return c.json({ error: 'Title, category, condition, and listing type are required' }, 400);
    }

    const itemId = crypto.randomUUID();
    const item = {
      id: itemId,
      title,
      description: description || '',
      category,
      size: size || '',
      condition,
      price: listingType === 'sell' ? (price || 0) : 0,
      listingType,
      sellerId: authUser.user.id,
      images: images || [],
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await kv.set(`item:${itemId}`, item);
    await kv.set(`seller:${authUser.user.id}:item:${itemId}`, itemId);

    return c.json({ item });
  } catch (error) {
    console.log(`Create item error: ${error}`);
    return c.json({ error: 'Internal server error while creating item' }, 500);
  }
});

// Get items by category
app.get('/make-server-c04af404/items/category/:category', async (c) => {
  try {
    const category = c.req.param('category');
    const items = await kv.getByPrefix(`item:`);
    
    const categoryItems = items
      .filter(item => item.category.toLowerCase() === category.toLowerCase() && item.status === 'active')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return c.json({ items: categoryItems });
  } catch (error) {
    console.log(`Get items by category error: ${error}`);
    return c.json({ error: 'Internal server error while fetching items' }, 500);
  }
});

// Get all items
app.get('/make-server-c04af404/items', async (c) => {
  try {
    const items = await kv.getByPrefix(`item:`);
    
    const activeItems = items
      .filter(item => item.status === 'active')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return c.json({ items: activeItems });
  } catch (error) {
    console.log(`Get all items error: ${error}`);
    return c.json({ error: 'Internal server error while fetching items' }, 500);
  }
});

// Upload image
app.post('/make-server-c04af404/upload', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401);
    }

    const { data: authUser, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !authUser.user) {
      return c.json({ error: 'Invalid authorization token' }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${authUser.user.id}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(ITEMS_BUCKET)
      .upload(filePath, file);

    if (error) {
      console.log(`File upload error: ${error.message}`);
      return c.json({ error: 'Failed to upload file' }, 500);
    }

    const { data: signedUrl } = await supabase.storage
      .from(ITEMS_BUCKET)
      .createSignedUrl(data.path, 60 * 60 * 24 * 365); // 1 year

    return c.json({ 
      path: data.path,
      url: signedUrl?.signedUrl 
    });
  } catch (error) {
    console.log(`Upload error: ${error}`);
    return c.json({ error: 'Internal server error during file upload' }, 500);
  }
});

// Create review
app.post('/make-server-c04af404/reviews', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401);
    }

    const { data: authUser, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !authUser.user) {
      return c.json({ error: 'Invalid authorization token' }, 401);
    }

    const body = await c.req.json();
    const { sellerId, rating, comment, itemId } = body;

    if (!sellerId || !rating || rating < 1 || rating > 5) {
      return c.json({ error: 'Seller ID and valid rating (1-5) are required' }, 400);
    }

    const reviewId = crypto.randomUUID();
    const review = {
      id: reviewId,
      sellerId,
      buyerId: authUser.user.id,
      itemId: itemId || null,
      rating,
      comment: comment || '',
      created_at: new Date().toISOString()
    };

    await kv.set(`review:${reviewId}`, review);
    await kv.set(`seller:${sellerId}:review:${reviewId}`, reviewId);

    // Update seller's average rating
    const sellerReviews = await kv.getByPrefix(`seller:${sellerId}:review:`);
    const totalRating = sellerReviews.reduce((sum, reviewId) => {
      const review = kv.get(`review:${reviewId}`);
      return sum + (review?.rating || 0);
    }, rating);
    const avgRating = totalRating / (sellerReviews.length + 1);

    const seller = await kv.get(`user:${sellerId}`);
    if (seller) {
      seller.rating = Math.round(avgRating * 10) / 10;
      seller.total_reviews = sellerReviews.length + 1;
      await kv.set(`user:${sellerId}`, seller);
    }

    return c.json({ review });
  } catch (error) {
    console.log(`Create review error: ${error}`);
    return c.json({ error: 'Internal server error while creating review' }, 500);
  }
});

// Get reviews for a seller
app.get('/make-server-c04af404/reviews/seller/:sellerId', async (c) => {
  try {
    const sellerId = c.req.param('sellerId');
    const reviewIds = await kv.getByPrefix(`seller:${sellerId}:review:`);
    
    const reviews = await Promise.all(
      reviewIds.map(async (reviewId) => {
        const review = await kv.get(`review:${reviewId}`);
        if (review) {
          const buyer = await kv.get(`user:${review.buyerId}`);
          return {
            ...review,
            buyerName: buyer?.name || 'Anonymous'
          };
        }
        return null;
      })
    );

    const validReviews = reviews.filter(review => review !== null);

    return c.json({ reviews: validReviews });
  } catch (error) {
    console.log(`Get seller reviews error: ${error}`);
    return c.json({ error: 'Internal server error while fetching reviews' }, 500);
  }
});

// Health check
app.get('/make-server-c04af404/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);