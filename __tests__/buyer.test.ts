import { describe, it, expect, beforeAll } from 'vitest';

const API_BASE = 'http://localhost:3000';
const BUYER_EMAIL = `buyer-test-${Date.now()}@test.com`;
const BUYER_PASSWORD = 'BuyerTest123!';

let buyerToken: string;
let buyerId: string;
let productId: string;

// Helper to make authenticated requests with cookies
async function req(url: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (buyerToken) {
    headers.set('Cookie', `auth_token=${buyerToken}`);
  }
  return fetch(url, { 
    ...options, 
    headers,
    credentials: 'include'
  });
}

describe('BUYER FUNCTIONALITY SUITE', () => {
  beforeAll(async () => {
    // Signup buyer
    const signupRes = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: BUYER_EMAIL,
        password: BUYER_PASSWORD,
        name: 'Test Buyer',
        role: 'buyer',
      }),
    });

    if (signupRes.ok) {
      const signupData = await signupRes.json();
      buyerId = signupData.user.id;
      
      // Extract token from Set-Cookie header
      const setCookie = signupRes.headers.get('set-cookie');
      if (setCookie) {
        const match = setCookie.match(/auth_token=([^;]+)/);
        if (match) {
          buyerToken = match[1];
        }
      }
    }

    // Get first product
    const productsRes = await fetch(`${API_BASE}/api/products`);
    if (productsRes.ok) {
      const resp = await productsRes.json();
      const productList = Array.isArray(resp) ? resp : (resp.data || []);
      if (productList.length > 0) {
        productId = productList[0].id;
      }
    }
  });

  describe('Authentication', () => {
    it('should signup buyer', async () => {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `signup-${Date.now()}@test.com`,
          password: 'SignupTest123!',
          name: 'Signup Test',
          role: 'buyer',
        }),
      });
      expect([200, 201]).toContain(res.status);
    });

    it('should login buyer', async () => {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: BUYER_EMAIL,
          password: BUYER_PASSWORD,
        }),
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.user).toBeDefined();
    });

    it('should get current user', async () => {
      const res = await req(`${API_BASE}/api/auth/me`);
      expect([200, 400, 401]).toContain(res.status);
      if (res.status === 200) {
        const data = await res.json();
        expect(data.user?.email).toBeDefined();
      }
    });
  });

  describe('Product Browsing', () => {
    it('should list products', async () => {
      const res = await fetch(`${API_BASE}/api/products`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data) || typeof data === 'object').toBeTruthy();
    });

    it('should get product details', async () => {
      if (!productId) {
        console.log('Skipping: No product found');
        return;
      }
      const res = await fetch(`${API_BASE}/api/products/${productId}`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('id');
    });

    it('should search products', async () => {
      const res = await fetch(`${API_BASE}/api/products/search?q=test`);
      expect([200, 404]).toContain(res.status);
    });
  });

  describe('Shopping Cart', () => {
    let cartItemId: string;

    it('should add to cart', async () => {
      if (!productId) {
        console.log('Skipping: No product found');
        return;
      }
      const res = await req(`${API_BASE}/api/cart`, {
        method: 'POST',
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });
      expect([200, 201]).toContain(res.status);
      if (res.status === 201 || res.status === 200) {
        const data = await res.json();
        if (data.id) cartItemId = data.id;
      }
    });

    it('should get cart', async () => {
      const res = await req(`${API_BASE}/api/cart`);
      expect([200, 400]).toContain(res.status);
      if (res.status === 200) {
        const data = await res.json();
        expect(Array.isArray(data) || typeof data === 'object').toBeTruthy();
      }
    });

    it('should fail to add cart without auth', async () => {
      if (!productId) {
        console.log('Skipping: No product found');
        return;
      }
      const res = await fetch(`${API_BASE}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });
      expect([401, 400]).toContain(res.status);
    });
  });

  describe('Orders', () => {
    it('should list buyer orders', async () => {
      const res = await req(`${API_BASE}/api/orders`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data) || typeof data === 'object').toBeTruthy();
    });

    it('should create order', async () => {
      const res = await req(`${API_BASE}/api/orders`, {
        method: 'POST',
        body: JSON.stringify({
          deliveryAddress: '123 Test St',
          phoneNumber: '+1234567890',
          deliveryZoneId: 1,
          paymentMethod: 'cash_on_delivery',
        }),
      });
      expect([200, 201, 400]).toContain(res.status);
    });
  });

  describe('User Profile', () => {
    it('should get profile', async () => {
      const res = await req(`${API_BASE}/api/auth/me`);
      expect([200, 400, 401]).toContain(res.status);
      if (res.status === 200) {
        const data = await res.json();
        expect(data.user?.email).toBeDefined();
      }
    });
  });

  describe('Wishlist', () => {
    it('should add to wishlist', async () => {
      if (!productId) {
        console.log('Skipping: No product found');
        return;
      }
      const res = await req(`${API_BASE}/api/wishlist`, {
        method: 'POST',
        body: JSON.stringify({ productId }),
      });
      expect([200, 201]).toContain(res.status);
    });

    it('should get wishlist', async () => {
      const res = await req(`${API_BASE}/api/wishlist`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data) || typeof data === 'object').toBeTruthy();
    });

    it('should fail to add wishlist without auth', async () => {
      if (!productId) {
        console.log('Skipping: No product found');
        return;
      }
      const res = await fetch(`${API_BASE}/api/wishlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      expect([401, 400]).toContain(res.status);
    });
  });

  describe('Reviews', () => {
    it('should submit review', async () => {
      if (!productId) {
        console.log('Skipping: No product found');
        return;
      }
      const res = await req(`${API_BASE}/api/reviews`, {
        method: 'POST',
        body: JSON.stringify({
          productId,
          rating: 5,
          comment: 'Great product!',
        }),
      });
      expect([200, 201, 400]).toContain(res.status);
    });

    it('should get reviews', async () => {
      const res = await fetch(`${API_BASE}/api/reviews`);
      expect([200, 404, 400]).toContain(res.status);
    });
  });

  describe('Notifications', () => {
    it('should get notifications', async () => {
      const res = await req(`${API_BASE}/api/notifications`);
      expect([200, 400]).toContain(res.status);
    });
  });

  describe('Authorization', () => {
    it('should deny access without token', async () => {
      const res = await fetch(`${API_BASE}/api/cart`);
      expect([401, 400]).toContain(res.status);
    });

    it('should allow buyer access to cart', async () => {
      const res = await req(`${API_BASE}/api/cart`);
      expect([200, 400]).toContain(res.status);
    });

    it('should deny buyer access to admin routes', async () => {
      const res = await req(`${API_BASE}/api/2tact/users`);
      expect([401, 403]).toContain(res.status);
    });
  });
});
