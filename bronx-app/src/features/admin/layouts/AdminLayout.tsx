import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AdminLayoutProps {
    children: ReactNode;
    activePage: 'roster' | 'inventory' | 'keys';
    onNavigate: (page: 'roster' | 'inventory' | 'keys') => void;
    onExit: () => void;
}

export function AdminLayout({ children, activePage, onNavigate, onExit }: AdminLayoutProps) {
    // TODO: Add real Admin check here
    const isAdmin = true;

    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center h-screen bg-black text-white font-mono">
                ACCESS DENIED
            </div>
        );
    }

    const navItems: { id: 'roster' | 'inventory' | 'keys'; label: string }[] = [
        { id: 'roster', label: '[ Roster ]' },
        { id: 'inventory', label: '[ Inventory ]' },
        { id: 'keys', label: '[ Keys ]' },
    ];

    return (
        <div className="min-h-screen bg-neutral-950 text-white flex">
            <aside className="w-64 border-r border-white/10 p-6 flex flex-col">
                <h2 className="text-xl font-bold tracking-widest uppercase mb-10 text-orange-500 cursor-pointer" onClick={onExit}>
                    Admin Console
                </h2>
                <nav className="space-y-4">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`block w-full text-left transition-colors uppercase text-sm tracking-wider ${activePage === item.id ? 'text-white font-bold' : 'text-neutral-400 hover:text-white'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-white/10">
                    <button onClick={onExit} className="text-xs text-neutral-600 hover:text-red-500 uppercase tracking-widest">
                        Exit Console
                    </button>
                </div>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
}
