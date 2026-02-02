import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Product {
    id: string;
    product_id: string; // From View
    name: string;
    price_base: number;
    price_guest: number;
    stock_quantity: number; // Base Stock
    available_quantity: number; // Real-time Stock
    category: string;
}

interface CatalogState {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    fetchProducts: () => Promise<void>;
}

export const useCatalogStore = create<CatalogState>((set) => ({
    products: [],
    isLoading: false,
    error: null,

    fetchProducts: async () => {
        set({ isLoading: true, error: null });
        try {
            // Join view with products table to get full details
            const { data, error } = await supabase
                .from('view_available_stock')
                .select(`
                    product_id,
                    base_stock,
                    available_quantity,
                    product:products (
                        id,
                        name,
                        price_base,
                        price_guest,
                        category,
                        is_active
                    )
                `);

            if (error) throw error;

            // Flatten the structure
            const products = data.map((item: any) => ({
                id: item.product_id,
                product_id: item.product_id,
                name: item.product.name,
                price_base: item.product.price_base,
                price_guest: item.product.price_guest,
                category: item.product.category,
                stock_quantity: item.base_stock,
                available_quantity: item.available_quantity
                // Filter active is handled by view ideally, but here we can filter
            })).filter((p: any) => p.name); // Simple check, or add is_active to view

            set({ products: products as Product[], isLoading: false });
        } catch (err: any) {
            console.error('Error fetching products:', err);
            set({ error: err.message, isLoading: false });
        }
    },
}));
