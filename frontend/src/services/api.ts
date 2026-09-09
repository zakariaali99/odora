import axios, { AxiosResponse } from 'axios';
import { Product, Cart, User, Order, Faq, Banner, Category } from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper for persistent Guest Session ID
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('odora_session_id');
  if (!sessionId) {
    sessionId = 'guest_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('odora_session_id', sessionId);
  }
  return sessionId;
};

// Request Interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('odora_access_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.headers) {
    config.headers['X-Session-ID'] = getSessionId();
  }
  return config;
});

// Response Interceptor for auto-refresh or error handling
apiClient.interceptors.response.use(
  (response) => {
    const newSession = response.headers['x-session-id'];
    if (newSession) {
      localStorage.setItem('odora_session_id', newSession);
    }
    return response;
  },
  async (error) => {
    if (error.response?.status === 401 && localStorage.getItem('odora_refresh_token')) {
      localStorage.removeItem('odora_access_token');
      localStorage.removeItem('odora_user');
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Health
  getHealth: () => apiClient.get('/health/'),

  // Auth & Accounts
  login: (email: string, password: string) => apiClient.post('/accounts/token/', { email, password }),
  register: (data: any) => apiClient.post('/accounts/register/', data),
  getProfile: (): Promise<AxiosResponse<User>> => apiClient.get('/accounts/profile/'),
  updateProfile: (data: any): Promise<AxiosResponse<User>> => apiClient.patch('/accounts/profile/', data),
  getAddresses: () => apiClient.get('/accounts/addresses/'),
  createAddress: (data: any) => apiClient.post('/accounts/addresses/', data),
  updateAddress: (id: string | number, data: any) => apiClient.patch(`/accounts/addresses/${id}/`, data),
  deleteAddress: (id: string | number) => apiClient.delete(`/accounts/addresses/${id}/`),
  getCustomerDevices: () => apiClient.get('/accounts/devices/'),
  addCustomerDevice: (data: any) => apiClient.post('/accounts/devices/', data),

  // Products & Categories
  getCategories: (): Promise<AxiosResponse<any>> => apiClient.get('/products/categories/'),
  getProducts: (params?: any): Promise<AxiosResponse<any>> => apiClient.get('/products/', { params }),
  getFeaturedProducts: (): Promise<AxiosResponse<Product[]>> => apiClient.get('/products/featured/'),
  getProductDetail: (slug: string): Promise<AxiosResponse<Product>> => apiClient.get(`/products/${slug}/`),
  addProductReview: (slug: string, data: any) => apiClient.post(`/products/${slug}/add_review/`, data),

  // Cart
  getCart: (): Promise<AxiosResponse<Cart>> => apiClient.get('/cart/'),
  addToCart: (productId: string, colorwayId: string | null = null, quantity: number = 1): Promise<AxiosResponse<Cart>> =>
    apiClient.post('/cart/items/', { product_id: productId, colorway_id: colorwayId, quantity }),
  updateCartItem: (itemId: string, quantity: number): Promise<AxiosResponse<Cart>> =>
    apiClient.patch(`/cart/items/${itemId}/`, { quantity }),
  removeCartItem: (itemId: string): Promise<AxiosResponse<Cart>> => apiClient.delete(`/cart/items/${itemId}/`),
  clearCart: (): Promise<AxiosResponse<Cart>> => apiClient.post('/cart/clear/'),

  // Orders
  checkout: (data: any): Promise<AxiosResponse<Order>> => apiClient.post('/orders/checkout/', data),
  getMyOrders: (): Promise<AxiosResponse<any>> => apiClient.get('/orders/my-orders/'),
  trackOrder: (orderNumber: string, phone: string = ''): Promise<AxiosResponse<Order>> =>
    apiClient.get(`/orders/track/${orderNumber}/`, { params: { phone } }),

  // CMS
  getBanners: (): Promise<AxiosResponse<{ results: Banner[] } | Banner[]>> => apiClient.get('/cms/banners/'),
  getScentStories: () => apiClient.get('/cms/scent-stories/'),
  getFaqs: (params?: any): Promise<AxiosResponse<{ results: Faq[] } | Faq[]>> => apiClient.get('/cms/faqs/', { params }),
  sendContactMessage: (data: any) => apiClient.post('/cms/contact/', data),

  // Marketing
  validateCoupon: (code: string, subtotal: number) =>
    apiClient.post('/marketing/coupons/validate/', { code, subtotal }),
  subscribeNewsletter: (email: string) =>
    apiClient.post('/marketing/newsletter/subscribe/', { email }),

  // Admin Dashboard & CRM
  getDashboardStats: () => apiClient.get('/analytics/dashboard/'),
  getAdminProducts: (params?: any) => apiClient.get('/products/admin-products/', { params }),
  createAdminProduct: (data: any) => apiClient.post('/products/admin-products/', data),
  updateAdminProduct: (id: string | number, data: any) => apiClient.patch(`/products/admin-products/${id}/`, data),
  deleteAdminProduct: (id: string | number) => apiClient.delete(`/products/admin-products/${id}/`),
  updateAdminStock: (id: string | number, stock: number) => apiClient.post(`/products/admin-products/${id}/update_stock/`, { stock }),

  getAdminOrders: (params?: any) => apiClient.get('/orders/admin-orders/', { params }),
  updateAdminOrderStatus: (id: string | number, status: string, note: string = '') =>
    apiClient.post(`/orders/admin-orders/${id}/update_status/`, { status, note }),

  getAdminCustomers: (params?: any) => apiClient.get('/crm/customers/', { params }),
  addCustomerNote: (id: string | number, note: string) => apiClient.post(`/crm/customers/${id}/add_note/`, { note }),
  getAdminCoupons: () => apiClient.get('/marketing/admin-coupons/'),

  // Direct HTTP Methods for generic REST calls
  get: (url: string, config?: any) => apiClient.get(url, config),
  post: (url: string, data?: any, config?: any) => apiClient.post(url, data, config),
  patch: (url: string, data?: any, config?: any) => apiClient.patch(url, data, config),
  put: (url: string, data?: any, config?: any) => apiClient.put(url, data, config),
  delete: (url: string, config?: any) => apiClient.delete(url, config),
  client: apiClient,
};

export default api;
