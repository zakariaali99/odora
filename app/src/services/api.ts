/**
 * Odora Mobile API Client
 * Connects to the shared Django + DRF backend (http://localhost:8000/api/v1)
 * Mirroring frontend/src/services/api.js with guest session and offline safety.
 */

// Default to localhost for emulator/simulator; can be customized for physical devices via EXPO_PUBLIC_API_URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// In-memory guest session ID for mobile
let cachedSessionId: string = '';

export const getSessionId = (): string => {
  if (!cachedSessionId) {
    cachedSessionId = 'mobile_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
  }
  return cachedSessionId;
};

interface RequestOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Session-ID': getSessionId(),
    'X-Device-Origin': 'mobile',
    ...(options.headers || {}),
  };

  const config: RequestInit = {
    method: options.method || 'GET',
    headers,
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorData: any;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { detail: response.statusText };
    }
    const error: any = new Error(errorData.detail || errorData.error || `HTTP ${response.status}`);
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  // Check if response has content
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return (await response.json()) as T;
  }
  return {} as T;
}

export const api = {
  // Products & Categories
  getProducts: async (params?: Record<string, any>) => {
    let queryString = '';
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      });
      const qs = searchParams.toString();
      if (qs) queryString = `?${qs}`;
    }
    return request<any>(`/products/${queryString}`);
  },

  getProductDetail: async (slug: string) => {
    return request<any>(`/products/${slug}/`);
  },

  getCategories: async () => {
    return request<any>('/products/categories/');
  },

  getFeaturedProducts: async () => {
    return request<any>('/products/featured/');
  },

  // In-App Cart
  getCart: async () => {
    return request<any>('/cart/');
  },

  addToCart: async (productId: string | number, colorwayId?: string | number | null, quantity: number = 1) => {
    return request<any>('/cart/items/', {
      method: 'POST',
      body: {
        product_id: productId,
        colorway_id: colorwayId || null,
        quantity,
      },
    });
  },

  updateCartItem: async (itemId: string, quantity: number) => {
    return request<any>(`/cart/items/${itemId}/`, {
      method: 'PATCH',
      body: { quantity },
    });
  },

  removeCartItem: async (itemId: string) => {
    return request<any>(`/cart/items/${itemId}/`, {
      method: 'DELETE',
    });
  },

  clearCart: async () => {
    return request<any>('/cart/clear/', {
      method: 'POST',
    });
  },

  // Checkout & Orders
  checkout: async (orderData: {
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    shipping_city: string;
    shipping_address: string;
    payment_method?: string;
    coupon_code?: string;
    notes?: string;
  }) => {
    return request<any>('/orders/checkout/', {
      method: 'POST',
      body: {
        ...orderData,
        payment_method: orderData.payment_method || 'cod',
      },
    });
  },

  // Marketing Coupons
  validateCoupon: async (code: string, subtotal: number) => {
    return request<any>('/marketing/coupons/validate/', {
      method: 'POST',
      body: { code, subtotal },
    });
  },

  // Health check
  getHealth: async () => {
    return request<any>('/health/');
  },
};

export default api;
