import { create } from 'zustand';
import api from '../services/api';
import { Cart } from '../types';

interface CartState {
  cart: Cart;
  isCartOpen: boolean;
  isLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  fetchCart: () => Promise<void>;
  addItem: (productOrId: any, colorwayId?: string | null, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  cart: {
    items: [],
    total_items: 0,
    subtotal: '0.00',
    delivery_fee: '0.00',
    total: '0.00',
  },
  isCartOpen: false,
  isLoading: false,

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  fetchCart: async () => {
    try {
      const res = await api.getCart();
      set({ cart: res.data });
    } catch (err) {
      console.error('Failed to fetch cart', err);
    }
  },

  addItem: async (productOrId, colorwayId = null, quantity = 1) => {
    set({ isLoading: true });
    try {
      const productId = typeof productOrId === 'object' && productOrId !== null ? productOrId.id : productOrId;
      const res = await api.addToCart(productId, colorwayId, quantity);
      set({ cart: res.data, isCartOpen: true, isLoading: false });
    } catch (err) {
      console.error('Failed to add item to cart', err);
      set({ isLoading: false });
    }
  },

  updateQuantity: async (itemId, quantity) => {
    try {
      const res = await api.updateCartItem(itemId, quantity);
      set({ cart: res.data });
    } catch (err) {
      console.error('Failed to update cart item', err);
    }
  },

  removeItem: async (itemId) => {
    try {
      const res = await api.removeCartItem(itemId);
      set({ cart: res.data });
    } catch (err) {
      console.error('Failed to remove cart item', err);
    }
  },

  clearCart: async () => {
    try {
      const res = await api.clearCart();
      set({ cart: res.data });
    } catch (err) {
      console.error('Failed to clear cart', err);
    }
  },
}));
