import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface CartItem {
    id: string; // Reservation ID
    product_id: string;
    quantity: number;
    expires_at: string;
    product?: {
        name: string;
        price_base: number;
        price_guest: number;
    };
}

interface CartStore {
    items: CartItem[];
    isLoading: boolean;
    error: string | null;
    cartTotal: number;
    cartCount: number;

    // Actions
    syncCart: (userIdentifier: string) => Promise<void>;
    addItem: (productId: string, userIdentifier: string, quantity?: number) => Promise<boolean>;
    removeItem: (productId: string, userIdentifier: string) => Promise<void>;
    clearCart: (userIdentifier: string) => Promise<void>;
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],
    isLoading: false,
    error: null,
    cartTotal: 0,
    cartCount: 0,

    syncCart: async (userIdentifier) => {
        set({ isLoading: true, error: null });
        try {
            // Fetch reservations joined with product details
            const { data, error } = await supabase
                .from('cart_reservations')
                .select(`
                    id,
                    product_id,
                    quantity,
                    expires_at,
                    product:products (
                        name,
                        price_base,
                        price_guest
                    )
                `)
                .eq('user_identifier', userIdentifier)
                .gt('expires_at', new Date().toISOString()); // Only active reservations

            if (error) throw error;

            const items = data as any[];

            // Calculate derived state
            const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
            // Note: Total price depends on user role, so it might be better calculated in UI 
            // or we pass role to syncCart. For now, we store raw items.

            set({ items, cartCount, isLoading: false });
        } catch (err: any) {
            console.error('Sync Cart Error:', err);
            set({ error: err.message, isLoading: false });
        }
    },

    addItem: async (productId, userIdentifier, quantity = 1) => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .rpc('reserve_item', {
                    p_product_id: productId,
                    p_user_identifier: userIdentifier,
                    p_quantity: quantity
                });

            if (error) throw error;

            if (data === true) {
                // Success: Refresh cart
                await get().syncCart(userIdentifier);
                return true;
            } else {
                set({ error: 'Stock insufficient or product unavailable', isLoading: false });
                return false;
            }
        } catch (err: any) {
            console.error('Add Item Error:', err);
            set({ error: err.message, isLoading: false });
            return false;
        }
    },

    removeItem: async (productId, userIdentifier) => {
        set({ isLoading: true });
        try {
            const { error } = await supabase
                .rpc('release_item', {
                    p_product_id: productId,
                    p_user_identifier: userIdentifier
                });

            if (error) throw error;
            await get().syncCart(userIdentifier);
        } catch (err: any) {
            console.error('Remove Item Error:', err);
            set({ error: err.message, isLoading: false });
        }
    },

    clearCart: async (userIdentifier) => {
        // Implement release of all items (can be done loop or new RPC)
        // For now, we rely on individual release or confirm_order
        // TODO: Add release_all RPC if needed
    }
}));
