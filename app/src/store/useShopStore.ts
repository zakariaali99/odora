import { create } from 'zustand';
import { api } from '../services/api';
import { BusinessConfig, Cart, Category, ProductListItem } from '../types/shop';

export interface ShopState {
  config: BusinessConfig | null;
  categories: Category[];
  products: ProductListItem[];
  cart: Cart | null;
  status: 'idle' | 'loading' | 'ready' | 'error';
  error: string | null;
  addingId: string | null;

  loadStore: () => Promise<void>;
  addToCart: (productId: string, colorwayId?: string | null) => Promise<boolean>;
  refreshCart: () => Promise<void>;
}

export const useShopStore = create<ShopState>((set, get) => ({
  config: null,
  categories: [],
  products: [],
  cart: null,
  status: 'idle',
  error: null,
  addingId: null,

  loadStore: async () => {
    set({ status: 'loading', error: null });
    try {
      const [config, categories, productsRes, cart] = await Promise.all([
        api.getConfig(),
        api.getCategories(),
        api.getProducts(),
        api.getCart(),
      ]);

      set({
        config,
        categories: categories || [],
        products: productsRes?.results || [],
        cart: cart || null,
        status: 'ready',
        error: null,
      });
    } catch (err: any) {
      set({
        status: 'error',
        error: err?.message || 'Failed to load store data',
      });
    }
  },

  addToCart: async (productId: string, colorwayId?: string | null) => {
    set({ addingId: productId });
    try {
      await api.addToCart(productId, colorwayId ?? null, 1);
      const cart = await api.getCart();
      set({ cart, addingId: null });
      return true;
    } catch (err) {
      set({ addingId: null });
      return false;
    }
  },

  refreshCart: async () => {
    try {
      const cart = await api.getCart();
      set({ cart });
    } catch (e) {
      // silently fail background refresh
    }
  },
}));

export const cartCount = (state: ShopState) => state.cart?.total_items ?? 0;
