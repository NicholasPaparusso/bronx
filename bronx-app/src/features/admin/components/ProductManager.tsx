import { useState } from 'react';

export function ProductManager() {
    const [products, setProducts] = useState([
        { id: 1, name: 'Heineken', stock: 24, price: 3.5 },
        { id: 2, name: 'Gin Tonic', stock: 12, price: 6.0 },
    ]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-thin tracking-tighter uppercase text-white/50">Inventory</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Add Form */}
                <div className="p-6 border border-white/10 bg-white/5 space-y-4">
                    <h3 className="text-sm uppercase tracking-widest text-orange-500 mb-4">New Artifact</h3>
                    <div className="space-y-4">
                        <input type="text" placeholder="Product Name" className="w-full bg-black/30 border-b border-white/20 p-2 text-white placeholder-white/20 focus:outline-none focus:border-orange-500 transition-colors" />
                        <div className="flex gap-4">
                            <input type="number" placeholder="Stock" className="w-1/2 bg-black/30 border-b border-white/20 p-2 text-white placeholder-white/20 focus:outline-none focus:border-orange-500" />
                            <input type="number" step="0.5" placeholder="Price €" className="w-1/2 bg-black/30 border-b border-white/20 p-2 text-white placeholder-white/20 focus:outline-none focus:border-orange-500" />
                        </div>
                        <button className="w-full py-3 mt-4 bg-white/10 hover:bg-white/20 text-white uppercase text-xs tracking-widest transition-colors">
                            Add to Catalog
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="border border-white/10">
                    <ul className="divide-y divide-white/5">
                        {products.map(p => (
                            <li key={p.id} className="p-4 flex justify-between items-center hover:bg-white/5 group">
                                <div>
                                    <div className="font-mono text-white">{p.name}</div>
                                    <div className="text-xs text-neutral-500">Qty: {p.stock}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-orange-500 font-mono">€{p.price.toFixed(2)}</div>
                                    <button className="text-[10px] text-neutral-600 uppercase hover:text-white opacity-0 group-hover:opacity-100 transition-all">Edit</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
