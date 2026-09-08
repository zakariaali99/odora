import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper for persistent Guest Session ID
export const getSessionId = () => {
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
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['X-Session-ID'] = getSessionId();
  return config;
});

// Response Interceptor for auto-refresh or error handling
apiClient.interceptors.response.use(
  (response) => {
    // If backend returns a new session ID header, save it
    const newSession = response.headers['x-session-id'];
    if (newSession) {
      localStorage.setItem('odora_session_id', newSession);
    }
    return response;
  },
  async (error) => {
    if (error.response?.status === 401 && localStorage.getItem('odora_refresh_token')) {
      // Token expired, clear if cannot refresh
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
  login: (email, password) => apiClient.post('/accounts/token/', { email, password }),
  register: (data) => apiClient.post('/accounts/register/', data),
  getProfile: () => apiClient.get('/accounts/profile/'),
  updateProfile: (data) => apiClient.patch('/accounts/profile/', data),
  getAddresses: () => apiClient.get('/accounts/addresses/'),
  createAddress: (data) => apiClient.post('/accounts/addresses/', data),
  updateAddress: (id, data) => apiClient.patch(`/accounts/addresses/${id}/`, data),
  deleteAddress: (id) => apiClient.delete(`/accounts/addresses/${id}/`),
  getCustomerDevices: () => apiClient.get('/accounts/devices/'),
  addCustomerDevice: (data) => apiClient.post('/accounts/devices/', data),

  // Products & Categories
  getCategories: () => apiClient.get('/products/categories/'),
  getProducts: (params) => apiClient.get('/products/', { params }),
  getFeaturedProducts: () => apiClient.get('/products/featured/'),
  getProductDetail: (slug) => apiClient.get(`/products/${slug}/`),
  addProductReview: (slug, data) => apiClient.post(`/products/${slug}/add_review/`, data),

  // Cart
  getCart: () => apiClient.get('/cart/'),
  addToCart: (productId, colorwayId = null, quantity = 1) =>
    apiClient.post('/cart/items/', { product_id: productId, colorway_id: colorwayId, quantity }),
  updateCartItem: (itemId, quantity) =>
    apiClient.patch(`/cart/items/${itemId}/`, { quantity }),
  removeCartItem: (itemId) => apiClient.delete(`/cart/items/${itemId}/`),
  clearCart: () => apiClient.post('/cart/clear/'),

  // Orders
  checkout: (data) => apiClient.post('/orders/checkout/', data),
  getMyOrders: () => apiClient.get('/orders/my-orders/'),
  trackOrder: (orderNumber, phone = '') =>
    apiClient.get(`/orders/track/${orderNumber}/`, { params: { phone } }),

  // CMS
  getBanners: () => apiClient.get('/cms/banners/'),
  getScentStories: () => apiClient.get('/cms/scent-stories/'),
  getFaqs: (params) => apiClient.get('/cms/faqs/', { params }),
  sendContactMessage: (data) => apiClient.post('/cms/contact/', data),

  // Marketing
  validateCoupon: (code, subtotal) =>
    apiClient.post('/marketing/coupons/validate/', { code, subtotal }),
  subscribeNewsletter: (email) =>
    apiClient.post('/marketing/newsletter/subscribe/', { email }),

  // Admin Dashboard & CRM
  getDashboardStats: () => apiClient.get('/analytics/dashboard/'),
  getAdminProducts: (params) => apiClient.get('/products/admin-products/', { params }),
  createAdminProduct: (data) => apiClient.post('/products/admin-products/', data),
  updateAdminProduct: (id, data) => apiClient.patch(`/products/admin-products/${id}/`, data),
  deleteAdminProduct: (id) => apiClient.delete(`/products/admin-products/${id}/`),
  updateAdminStock: (id, stock) => apiClient.post(`/products/admin-products/${id}/update_stock/`, { stock }),

  getAdminOrders: (params) => apiClient.get('/orders/admin-orders/', { params }),
  updateAdminOrderStatus: (id, status, note = '') =>
    apiClient.post(`/orders/admin-orders/${id}/update_status/`, { status, note }),

  getAdminCustomers: (params) => apiClient.get('/crm/customers/', { params }),
  addCustomerNote: (id, note) => apiClient.post(`/crm/customers/${id}/add_note/`, { note }),
  getAdminCoupons: () => apiClient.get('/marketing/admin-coupons/'),

  // Direct HTTP Methods for generic REST calls
  get: (url, config) => apiClient.get(url, config),
  post: (url, data, config) => apiClient.post(url, data, config),
  patch: (url, data, config) => apiClient.patch(url, data, config),
  put: (url, data, config) => apiClient.put(url, data, config),
  delete: (url, config) => apiClient.delete(url, config),
  client: apiClient,
};

export default api;
