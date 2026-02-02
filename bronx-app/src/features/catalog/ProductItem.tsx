import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface ProductItemProps {
    id: string;
    name: string;
    price: number;
    available: number; // Real-time available
    cartQuantity: number;
    category: string;
    index: number;
    onAdd: (id: string) => void;
    onRemove: (id: string) => void;
}

export const ProductItem: React.FC<ProductItemProps> = ({
    id,
    name,
    price,
    available,
    cartQuantity,
    category,
    index,
    onAdd,
    onRemove,
}) => {
    return (
        <div
            className={`group relative flex items-center justify-between py-5 border-b border-white/[0.05] transition-all duration-300 px-4 ${available === 0 ? 'opacity-50' : 'hover:bg-white/[0.02]'}`}
        >
            {/* Stock indicator line */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-transparent transition-all duration-500 ${available > 0 ? 'group-hover:bg-orange-500' : 'bg-red-500/20'}`} />

            <div className="flex flex-col space-y-1">
                <span className="text-[10px] font-mono text-orange-500/60 uppercase tracking-[0.2em]">
                    {category} // ID_{id.substring(0, 4)}
                </span>
                <span className="text-xl font-light text-white group-hover:translate-x-1 transition-transform duration-300">
                    {name}
                </span>
            </div>

            <div className="flex items-center space-x-12">
                {/* Available Level */}
                <div className="hidden md:flex flex-col items-end">
                    <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest">Disponibili</span>
                    <span className={`font-mono text-sm ${available < 5 ? 'text-red-500 animate-pulse' : 'text-neutral-400'}`}>
                        {available.toString().padStart(2, '0')} PCS
                    </span>
                </div>

                {/* Price */}
                <div className="flex flex-col items-end min-w-[100px] space-y-2">
                    <div className="flex items-center space-x-3 bg-white/[0.05] rounded-full p-1 border border-white/10">
                        {cartQuantity > 0 ? (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onRemove(id); }}
                                    className="w-6 h-6 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-500/20 text-white hover:text-red-500 transition-colors"
                                >
                                    -
                                </button>
                                <span className="text-white font-mono text-sm w-4 text-center font-bold">
                                    {cartQuantity}
                                </span>
                            </>
                        ) : (
                            <span className="text-[10px] text-neutral-500 px-2 uppercase tracking-widest">ADD</span>
                        )}

                        <button
                            onClick={(e) => { e.stopPropagation(); onAdd(id); }}
                            disabled={available <= 0}
                            className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors ${available > 0
                                    ? 'bg-orange-500 text-white hover:bg-orange-400'
                                    : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                                }`}
                        >
                            +
                        </button>
                    </div>
                    <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest text-right w-full block">
                        €{price.toFixed(2)}
                    </span>
                </div>
            </div>

            {/* Quick Action Icon */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">
                <ShoppingCart size={18} className="text-white" />
            </div>

            <style>{`
                    .text-glow-orange {
                        text-shadow: 0 0 10px rgba(249, 115, 22, 0.5);
                    }
                `}</style>
        </div>
    );
};
