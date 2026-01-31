import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, MoveRight, ShieldCheck } from 'lucide-react';

interface CheckoutOverlayProps {
    isOpen: boolean;
    product: { name: string; price: number } | null;
    onClose: () => void;
    onConfirm: () => void;
}

export const CheckoutOverlay: React.FC<CheckoutOverlayProps> = ({ isOpen, product, onClose, onConfirm }) => {
    return (
        <AnimatePresence>
            {isOpen && product && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-md p-4"
                >
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-t-xl md:rounded-sm overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-white/5">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-orange-500/10 rounded-sm">
                                    <ShoppingCart size={18} className="text-orange-500" />
                                </div>
                                <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-mono font-bold">Inizializzazione Transazione</span>
                            </div>
                            <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-8 space-y-8">
                            <div className="space-y-2">
                                <span className="text-[9px] uppercase tracking-widest text-neutral-600 font-mono">Articolo Selezionato</span>
                                <h3 className="text-3xl font-light text-white tracking-tight leading-none">
                                    {product.name}
                                </h3>
                            </div>

                            <div className="flex justify-between items-end bg-white/[0.02] p-6 border border-white/5 rounded-sm">
                                <div className="space-y-1">
                                    <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-mono">Totale Ledger</span>
                                    <p className="text-[10px] text-neutral-600 font-mono italic">Incl. tasse e protocollo</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-4xl font-black font-mono text-orange-500 text-glow-orange">
                                        €{product.price.toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={onConfirm}
                                    className="w-full bg-white text-black py-6 flex items-center justify-between px-10 group hover:bg-orange-600 hover:text-white transition-all duration-700 shadow-xl"
                                >
                                    <span className="font-black uppercase tracking-widest text-xs">PAGA CON PAYPAL</span>
                                    <MoveRight size={20} className="group-hover:translate-x-3 transition-transform duration-500" />
                                </button>

                                <div className="flex items-center justify-center space-x-2 text-[9px] uppercase tracking-widest text-neutral-600 font-mono">
                                    <ShieldCheck size={12} />
                                    <span>Transazione Crittografata // SSLv3</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer decorative */}
                        <div className="bg-orange-500/5 py-3 px-8 text-center text-[8px] uppercase tracking-[0.5em] text-orange-500/40">
                            Zenith Security Layer Active
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
