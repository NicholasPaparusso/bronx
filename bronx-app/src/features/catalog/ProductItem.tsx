import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

interface ProductItemProps {
    id: string;
    name: string;
    price: number;
    stock: number;
    category: string;
    index: number;
    onPurchase: (id: string) => void;
}

export const ProductItem: React.FC<ProductItemProps> = ({
    id,
    name,
    price,
    stock,
    category,
    index,
    onPurchase
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            className="group relative flex items-center justify-between py-5 border-b border-white/[0.05] hover:bg-white/[0.02] transition-all duration-300 px-4 cursor-pointer"
            onClick={() => onPurchase(id)}
        >
            {/* Stock indicator line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-orange-500 transition-all duration-500" />

            <div className="flex flex-col space-y-1">
                <span className="text-[10px] font-mono text-orange-500/60 uppercase tracking-[0.2em]">
                    {category} // ID_{id.padStart(3, '0')}
                </span>
                <span className="text-xl font-light text-white group-hover:translate-x-1 transition-transform duration-300">
                    {name}
                </span>
            </div>

            <div className="flex items-center space-x-12">
                {/* Stock Level */}
                <div className="hidden md:flex flex-col items-end">
                    <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest">Disponibilità</span>
                    <span className={`font-mono text-sm ${stock < 5 ? 'text-red-500 animate-pulse' : 'text-neutral-400'}`}>
                        {stock.toString().padStart(2, '0')} PCS
                    </span>
                </div>

                {/* Price */}
                <div className="flex flex-col items-end min-w-[100px]">
                    <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest">Valore</span>
                    <span className="font-mono text-xl text-orange-500 font-bold group-hover:text-glow-orange transition-all">
                        €{price.toFixed(2)}
                    </span>
                </div>

                {/* Quick Action Icon */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">
                    <ShoppingCart size={18} className="text-white" />
                </div>
            </div>

            <style>{`
                .text-glow-orange {
                    text-shadow: 0 0 10px rgba(249, 115, 22, 0.5);
                }
            `}</style>
        </motion.div>
    );
};
