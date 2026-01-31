import { create } from 'zustand';

interface Product {
    id: string;
    name: string;
    price_socio: number;
    price_guest: number;
    stock: number;
    category: string;
}

interface CatalogState {
    products: Product[];
    isLoading: boolean;
    setProducts: (products: Product[]) => void;
    updateStock: (productId: string, newStock: number) => void;
}

export const useCatalogStore = create<CatalogState>((set) => ({
    products: [
        { id: '1', name: 'Ichnusa Non Filtrata', price_socio: 1.5, price_guest: 2.0, stock: 24, category: 'Birra' },
        { id: '2', name: 'Taralli Pugliesi', price_socio: 1.0, price_guest: 1.5, stock: 10, category: 'Snack' },
        { id: '3', name: 'Coca Cola Zero', price_socio: 1.0, price_guest: 1.5, stock: 12, category: 'Bibite' },
        { id: '4', name: 'Tennent\'s Super', price_socio: 2.5, price_guest: 3.5, stock: 8, category: 'Birra' },
    ],
    isLoading: false,
    setProducts: (products) => set({ products }),
    updateStock: (productId, newStock) => set((state) => ({
        products: state.products.map(p => p.id === productId ? { ...p, stock: newStock } : p)
    })),
}));
