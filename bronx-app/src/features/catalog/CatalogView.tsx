import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCatalogStore } from '../../store/useCatalogStore';
import { ProductItem } from './ProductItem';
import { CheckoutOverlay } from './CheckoutOverlay';
import { TrendingUp, Zap, ShieldCheck } from 'lucide-react';

interface CatalogViewProps {
    userRole: 'socio' | 'guest' | 'admin';
}

import { useCartStore } from '../../store/useCartStore';
import { supabase } from '../../lib/supabase'; // Needed for Auth check if we refine user ID

// ... existing code ...

export const CatalogView: React.FC<CatalogViewProps> = ({ userRole }) => {
    const { products, fetchProducts, isLoading } = useCatalogStore();
    const { items: cartItems, addItem, removeItem, syncCart } = useCartStore(); // Cart Hook
    const [selectedProduct, setSelectedProduct] = useState<{ name: string; price: number } | null>(null);
    const isSocio = userRole === 'socio' || userRole === 'admin';

    // State for Dynamic Categories
    const [activeCategory, setActiveCategory] = useState('TUTTI');

    React.useEffect(() => {
        fetchProducts();
        const initCart = async () => {
            // For now, simpler ID logic until full context available
            const { data } = await supabase.auth.getSession();
            const userId = data.session?.user.id || 'guest-session-id'; // Fallback
            syncCart(userId);
        };
        initCart();
    }, []);

    // Handlers
    const handleAdd = async (productId: string) => {
        const { data } = await supabase.auth.getSession();
        const userId = data.session?.user.id || 'guest-session-id';
        await addItem(productId, userId, 1);
        fetchProducts(); // Refresh stock view
    };

    const handleRemove = async (productId: string) => {
        const { data } = await supabase.auth.getSession();
        const userId = data.session?.user.id || 'guest-session-id';
        await removeItem(productId, userId);
        fetchProducts(); // Refresh stock view
    };

    // Derived State: Unique Categories from fetched products
    const categories = ['TUTTI', ...new Set(products.map(p => p.category ? p.category.toUpperCase() : 'ALTRO'))].sort();

    // Derived State: Filtered Products
    const filteredProducts = activeCategory === 'TUTTI'
        ? products
        : products.filter(p => p.category?.toUpperCase() === activeCategory);

    const confirmPurchase = () => {
        console.log("Confirming purchase and redirecting to PayPal...");
        // Logica di reindirizzamento
        setSelectedProduct(null);
    };

    return (
        <div className="w-full space-y-12 pb-20">
            {/* Cinematic Header Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${isSocio ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-6 bg-white/[0.01] border border-white/5 p-10 rounded-sm`}
                >
                    <div className="inline-flex items-center space-x-2 px-3 py-1 border border-orange-500/20 rounded-full bg-orange-500/5">
                        <Zap size={10} className="text-orange-500 animate-pulse" />
                        <span className="text-[9px] uppercase tracking-[0.3em] text-orange-400 font-mono">Status: Online</span>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-5xl md:text-7xl font-light text-white tracking-tighter leading-none">
                            <span className="font-bold italic text-white-500 text-glow-orange">Snacks </span>
                            <span className="font-bold italic text-orange-500 text-glow-orange"> & Drinks.</span>
                        </h1>
                        <p className="text-neutral-500 font-mono text-[10px] uppercase tracking-[0.4em]">Procedi all'acquisto, ora anche con PayPal</p>
                    </div>
                </motion.div>

                {/* Right Stat Cards - ONLY FOR SOCIO */}
                {isSocio && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/[0.03] border border-white/5 p-10 rounded-sm space-y-6 h-full flex flex-col justify-center min-h-[220px]"
                    >
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-mono">Liquidità Attuale</span>
                                <p className="text-4xl font-bold font-mono text-white text-glow-white">€142.50</p>
                            </div>
                            <div className="p-3 bg-orange-500/10 rounded-sm">
                                <TrendingUp size={20} className="text-orange-500" />
                            </div>
                        </div>

                        <div className="h-px bg-white/5 w-full" />

                        <div className="flex justify-between items-center text-[11px] uppercase font-mono tracking-widest">
                            <span className="text-neutral-400">Punti Fegato</span>
                            <span className="text-orange-500 font-bold px-3 py-1 border border-orange-500/20 rounded-sm bg-orange-500/5">LVL 42</span>
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="bg-white/[0.01] border border-white/5 rounded-sm overflow-hidden shadow-2xl shadow-orange-500/5">
                {/* Catalog Control Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-white/[0.02] border-b border-white/5 space-y-4 md:space-y-0">
                    <div className="flex flex-wrap items-center gap-6">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`text-[11px] uppercase tracking-[0.3em] transition-colors pb-2 ${activeCategory === cat
                                    ? 'text-orange-500 border-b-2 border-orange-500 font-bold'
                                    : 'text-neutral-500 hover:text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center space-x-3 text-[10px] text-neutral-600 font-mono">
                        <ShieldCheck size={14} className="text-orange-500/40" />
                        <span className="uppercase tracking-widest italic">Catalogo_Online</span>
                    </div>
                </div>

                {/* The Elite List */}
                <div className="divide-y divide-white/[0.03]">
                    {isLoading ? (
                        <div className="py-20 text-center text-white font-mono animate-pulse">SYNCING DATABASE...</div>
                    ) : filteredProducts.length > 0 ? (
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={activeCategory}
                                initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
                                transition={{ duration: 0.35, ease: "easeOut" }}
                            >
                                {filteredProducts.map((product, index) => {
                                    const cartItem = cartItems.find(item => item.product_id === product.id);
                                    const quantity = cartItem ? cartItem.quantity : 0;

                                    return (
                                        <ProductItem
                                            key={product.id}
                                            id={product.id}
                                            name={product.name}
                                            category={product.category}
                                            price={isSocio ? product.price_base : product.price_guest}
                                            available={product.available_quantity}
                                            cartQuantity={quantity}
                                            index={index}
                                            onAdd={handleAdd}
                                            onRemove={handleRemove}
                                        />
                                    );
                                })}
                            </motion.div>
                        </AnimatePresence>
                    ) : (
                        <div className="py-20 text-center">
                            <p className="font-mono text-neutral-600 uppercase tracking-widest">Nessun prodotto in questa categoria.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Activity Footer - ONLY FOR SOCIO */}
            {isSocio && (
                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center space-x-5">
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.4)]" />
                        <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 font-mono">
                            <span className="text-orange-500/70 mr-2">Ultime transazioni:</span> Giannino ha appena prelevato una <span className="text-neutral-300 font-bold text-glow-white">Ichnusa</span> (2m ago)
                        </p>
                    </div>
                    <div className="flex items-center space-x-8 text-[9px] uppercase tracking-widest text-neutral-600 font-mono">
                        <span className="flex items-center gap-2"><span className="w-1 h-1 bg-neutral-700 rounded-full" /> Server: BRX-Milan-01</span>
                        <span className="flex items-center gap-2"><span className="w-1 h-1 bg-neutral-700 rounded-full" /> Node ID: 0xFF921</span>
                    </div>
                </div>
            )}

            {/* Checkout Overlay Modal */}
            <CheckoutOverlay
                isOpen={selectedProduct !== null}
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onConfirm={confirmPurchase}
            />
        </div>
    );
};
