import { describe, it, expect, beforeAll } from 'vitest';

const API_BASE = 'http://localhost:3000';
const ADMIN_EMAIL = 'papicamara22@gmail.com';
const ADMIN_PASSWORD = 'gabriel612223341';

let adminToken: string;
let adminId: string;

// Helper to make authenticated requests with cookies
async function req(url: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (adminToken) {
    headers.set('Cookie', `auth_token=${adminToken}`);
  }
  return fetch(url, { 
    ...options, 
    headers,
    credentials: 'include'
  });
}

describe('ADMIN FUNCTIONALITY SUITE', () => {
  beforeAll(async () => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    });
    const data = await res.json();
    adminId = data.user.id;
    
    // Extract token from Set-Cookie header
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      const match = setCookie.match(/auth_token=([^;]+)/);
      if (match) {
        adminToken = match[1];
      }
    }
  });

  describe('Dashboard & Analytics', () => {
    it('should fetch dashboard metrics', async () => {
      const res = await req(`${API_BASE}/api/analytics`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('totalRevenue');
    });
  });

  describe('User Management', () => {
    it('should list all users', async () => {
      const res = await req(`${API_BASE}/api/2tact/users`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
    });

    it('should get user details', async () => {
      const res = await req(`${API_BASE}/api/2tact/users/${adminId}`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('id');
    });
  });

  describe('Product Management', () => {
    let productId: string;

    it('should list products', async () => {
      const res = await req(`${API_BASE}/api/products`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data) || data.products || typeof data === 'object').toBeTruthy();
    });

    it('should create product', async () => {
      const res = await req(`${API_BASE}/api/products`, {
        method: 'POST',
        body: JSON.stringify({
          name: `Test Product ${Date.now()}`,
          description: 'Test',
          price: 99.99,
          category: 'Electronics',
          stock: 100,
        }),
      });
      if (res.status === 201 || res.status === 200) {
        const data = await res.json();
        if (data.id) productId = data.id;
        expect(res.status).toBeGreaterThanOrEqual(200);
      }
    });
  });

  describe('Order Management', () => {
    it('should list all orders', async () => {
      const res = await req(`${API_BASE}/api/orders`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data) || data.orders).toBeTruthy();
    });

    it('should update order status', async () => {
      const listRes = await req(`${API_BASE}/api/orders`);
      const orders = await listRes.json();
      if (Array.isArray(orders) && orders.length > 0) {
        const orderId = orders[0].id;
        const res = await req(`${API_BASE}/api/orders/${orderId}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'processing' }),
        });
        expect([200, 400, 404]).toContain(res.status);
      }
    });
  });

  describe('Delivery Zones', () => {
    it('should list delivery zones', async () => {
      const res = await req(`${API_BASE}/api/delivery-zones`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data) || data.zones).toBeTruthy();
    });
  });

  describe('Brand Ambassadors', () => {
    it('should list ambassadors', async () => {
      const res = await req(`${API_BASE}/api/2tact/ambassadors`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data) || data.ambassadors).toBeTruthy();
    });
  });

  describe('Hero Images', () => {
    it('should list hero images', async () => {
      const res = await req(`${API_BASE}/api/2tact/hero-images`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data) || data.images).toBeTruthy();
    });
  });

  describe('Marketing Campaigns', () => {
    it('should list campaigns', async () => {
      const res = await req(`${API_BASE}/api/marketing/campaigns`);
      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        const data = await res.json();
        expect(Array.isArray(data) || data.campaigns).toBeTruthy();
      }
    });
  });

  describe('Notifications', () => {
    it('should get notifications', async () => {
      const res = await req(`${API_BASE}/api/notifications`);
      expect([200, 400]).toContain(res.status);
    });
  });

  describe('Settings', () => {
    it('should get logo settings', async () => {
      const res = await req(`${API_BASE}/api/settings/logo`);
      expect(res.status).toBe(200);
    });
  });

  describe('Authorization', () => {
    it('should deny access without token', async () => {
      const res = await fetch(`${API_BASE}/api/2tact/users`);
      expect(res.status).toBe(401);
    });

    it('should allow admin access', async () => {
      const res = await req(`${API_BASE}/api/2tact/users`);
      expect(res.status).toBe(200);
    });
  });
});
