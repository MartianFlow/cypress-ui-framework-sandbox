import { create } from 'zustand';
import type { Cart, CartItem, AddToCartInput } from '@ecommerce/shared';
import { api } from '../services/api';

interface CartState {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  isLoading: boolean;
  isOpen: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (data: AddToCartInput) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  subtotal: 0,
  itemCount: 0,
  isLoading: false,
  isOpen: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get<Cart>('/cart');
      set({
        items: response.items,
        subtotal: response.subtotal,
        itemCount: response.itemCount,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  addToCart: async (data: AddToCartInput) => {
    set({ isLoading: true });
    try {
      await api.post('/cart', data);
      await get().fetchCart();
      set({ isOpen: true });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateQuantity: async (itemId: number, quantity: number) => {
    set({ isLoading: true });
    try {
      await api.put(`/cart/${itemId}`, { quantity });
      await get().fetchCart();
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  removeItem: async (itemId: number) => {
    set({ isLoading: true });
    try {
      await api.delete(`/cart/${itemId}`);
      await get().fetchCart();
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  clearCart: async () => {
    set({ isLoading: true });
    try {
      await api.delete('/cart');
      set({ items: [], subtotal: 0, itemCount: 0, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
}));
