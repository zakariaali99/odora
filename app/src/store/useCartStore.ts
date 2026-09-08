import { create } from 'zustand';
import { api } from '../services/api';

export interface CartItem {
  id: string;
  product: {
    id: string;
    name_ar: string;
    name_en?: string;
    price: string;
    main_image?: string;
    product_type: string;
  };
  colorway?: {
    id: string;
    name_ar: string;
    name_en?: string;
    hex_code: string;
  } | null;
  quantity: number;
  unit_price: string;
  total_price: string;
}

export interface CartData {
  items: CartItem[];
  total_items: number;
  subtotal: string;
  delivery_fee: string;
  free_delivery_remaining: string;
  total_price: string;
}

interface CartStore {
  cart: CartData;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, colorwayId?: string | null, quantity?: number) => Promise<boolean>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const emptyCart: CartData = {
  items: [],
  total_items: 0,
  subtotal: '0.00',
  delivery_fee: '0.00',
  free_delivery_remaining: '300.00',
  total_price: '0.00',
};

export const useCartStore = create<CartStore>((set, get) => ({
  cart: emptyCart,
  isLoading: false,

  fetchCart: async () => {
    try {
      const data = await api.getCart();
      if (data) {
        set({ cart: data });
      }
    } catch (err) {
      console.warn('Failed to fetch mobile cart from API', err);
    }
  },

  addItem: async (productId: string, colorwayId: string | null = null, quantity: number = 1) => {
    set({ isLoading: true });
    try {
      const updatedCart = await api.addToCart(productId, colorwayId, quantity);
      if (updatedCart) {
        set({ cart: updatedCart, isLoading: false });
        return true;
      }
      set({ isLoading: false });
      return false;
    } catch (err) {
      console.warn('Failed to add item to mobile cart', err);
      set({ isLoading: false });
      return false;
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    try {
      const updatedCart = await api.updateCartItem(itemId, quantity);
      if (updatedCart) {
        set({ cart: updatedCart });
      }
    } catch (err) {
      console.warn('Failed to update cart quantity', err);
    }
  },

  removeItem: async (itemId: string) => {
    try {
      const updatedCart = await api.removeCartItem(itemId);
      if (updatedCart) {
        set({ cart: updatedCart });
      }
    } catch (err) {
      console.warn('Failed to remove cart item', err);
    }
  },

  clearCart: async () => {
    try {
      const empty = await api.clearCart();
      set({ cart: empty || emptyCart });
    } catch (err) {
      set({ cart: emptyCart });
    }
  },
}));
