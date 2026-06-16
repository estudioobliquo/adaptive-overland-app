import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/lib/types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  syncProducts: (fresh: Product[]) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({ items: state.items.filter((i) => i.product.id !== productId) }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i,
          ),
        }));
      },

      syncProducts: (fresh) => {
        set((state) => {
          let changed = false;
          const items: CartItem[] = [];
          for (const item of state.items) {
            const f = fresh.find((p) => p.id === item.product.id);
            // Producto inexistente, inactivo o sin stock: lo quitamos del carrito.
            if (!f || !f.isActive || f.stock <= 0) {
              changed = true;
              continue;
            }
            const quantity = Math.min(item.quantity, f.stock);
            // Reemplazamos por los datos frescos (precio, stock, nombre, imágenes).
            if (
              quantity !== item.quantity ||
              f.price !== item.product.price ||
              f.stock !== item.product.stock ||
              f.name !== item.product.name
            ) {
              changed = true;
            }
            items.push({ product: f, quantity });
          }
          return changed ? { items } : state;
        });
      },

      clearCart: () => set({ items: [] }),

      total: () =>
        get().items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'ao-cart' },
  ),
);
