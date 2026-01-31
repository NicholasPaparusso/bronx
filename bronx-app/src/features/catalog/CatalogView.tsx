import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCatalogStore } from '../../store/useCatalogStore';
import { ProductItem } from './ProductItem';
import { CheckoutOverlay } from './CheckoutOverlay';
import { TrendingUp, Zap, ShieldCheck } from 'lucide-react';

export const CatalogView: React.FC = () => {
    const { products } = useCatalogStore();
    const [selectedProduct, setSelectedProduct] = useState<{ name: string; price: number } | null>(null);
    const isSocio = true; // Mock per ora

    const handlePurchaseAttempt = (id: string) => {
        const product = products.find(p => p.id === id);
        if (product) {
            setSelectedProduct({
                name: product.name,
                price: isSocio ? product.price_socio : product.price_guest
            });
        }
    };

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
                    className="lg:col-span-2 space-y-6 bg-white/[0.01] border border-white/5 p-10 rounded-sm"
                >
                    <div className="inline-flex items-center space-x-2 px-3 py-1 border border-orange-500/20 rounded-full bg-orange-500/5">
                        <Zap size={10} className="text-orange-500 animate-pulse" />
                        <span className="text-[9px] uppercase tracking-[0.3em] text-orange-400 font-mono">Status: Ledger_Online</span>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-5xl md:text-7xl font-light text-white tracking-tighter leading-none">
                            GESTIONE <br />
                            <span className="font-bold italic text-orange-500 text-glow-orange">LEDGER BRONX.</span>
                        </h1>
                        <p className="text-neutral-500 font-mono text-[10px] uppercase tracking-[0.4em]">Protocollo Consumi Interni v4.0.1</p>
                    </div>
                </motion.div>

                {/* Right Stat Cards */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/[0.03] border border-white/5 p-10 rounded-sm space-y-8 h-full flex flex-col justify-center min-h-[220px]"
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
            </div>

            <div className="bg-white/[0.01] border border-white/5 rounded-sm overflow-hidden shadow-2xl shadow-orange-500/5">
                {/* Catalog Control Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-white/[0.02] border-b border-white/5 space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-8">
                        <button className="text-[11px] uppercase tracking-[0.3em] font-bold text-orange-500 border-b-2 border-orange-500 pb-2">Tutti i Prodotti</button>
                        <button className="text-[11px] uppercase tracking-[0.3em] text-neutral-500 hover:text-white transition-colors pb-2">Beer_Stock</button>
                        <button className="text-[11px] uppercase tracking-[0.3em] text-neutral-500 hover:text-white transition-colors pb-2">Spirits</button>
                        <button className="text-[11px] uppercase tracking-[0.3em] text-neutral-500 hover:text-white transition-colors pb-2">Snack_Logic</button>
                    </div>

                    <div className="flex items-center space-x-3 text-[10px] text-neutral-600 font-mono">
                        <ShieldCheck size={14} className="text-orange-500/40" />
                        <span className="uppercase tracking-widest italic">Encrypted_Terminal_01</span>
                    </div>
                </div>

                {/* The Elite List */}
                <div className="divide-y divide-white/[0.03]">
                    {products.length > 0 ? (
                        products.map((product, index) => (
                            <ProductItem
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                category={product.category}
                                price={isSocio ? product.price_socio : product.price_guest}
                                stock={product.stock}
                                index={index}
                                onPurchase={handlePurchaseAttempt}
                            />
                        ))
                    ) : (
                        <div className="py-20 text-center">
                            <p className="font-mono text-neutral-600 uppercase tracking-widest">Inizializzazione catalogo fallita...</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Activity Footer */}
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-5">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.4)]" />
                    <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 font-mono">
                        <span className="text-orange-500/70 mr-2">Social_Ledger:</span> Giannino ha appena prelevato una <span className="text-neutral-300 font-bold text-glow-white">Ichnusa</span> (2m ago)
                    </p>
                </div>
                <div className="flex items-center space-x-8 text-[9px] uppercase tracking-widest text-neutral-600 font-mono">
                    <span className="flex items-center gap-2"><span className="w-1 h-1 bg-neutral-700 rounded-full" /> Server: BRX-Milan-01</span>
                    <span className="flex items-center gap-2"><span className="w-1 h-1 bg-neutral-700 rounded-full" /> Node ID: 0xFF921</span>
                </div>
            </div>

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
