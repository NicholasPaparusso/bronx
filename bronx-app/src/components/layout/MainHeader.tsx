import React from 'react';
import { Logo } from '../Logo';
import { LogOut, User, Bell } from 'lucide-react';

interface MainHeaderProps {
    onLogout: () => void;
    userRole: 'socio' | 'guest' | 'admin';
    currentView?: 'catalog' | 'admin';
    onSwitchView?: (view: 'catalog' | 'admin') => void;
    activeAdminPage?: 'roster' | 'inventory' | 'keys';
    onNavigateAdmin?: (page: 'roster' | 'inventory' | 'keys') => void;
}

export const MainHeader: React.FC<MainHeaderProps> = ({
    onLogout,
    userRole,
    currentView,
    onSwitchView,
    activeAdminPage,
    onNavigateAdmin
}) => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Brand Section */}
                <div className="flex items-center space-x-8">
                    <Logo className="scale-90" />
                    <nav className="hidden md:flex items-center space-x-6 border-l border-white/10 pl-8">
                        {/* Standard Links - Always visible */}
                        <button
                            onClick={() => onSwitchView?.('catalog')}
                            className={`text-[10px] uppercase tracking-[0.3em] font-bold transition-colors ${currentView === 'catalog' ? 'text-orange-500' : 'text-neutral-500 hover:text-white'}`}
                        >
                            Catalog
                        </button>
                        <button className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 hover:text-white transition-colors">History</button>
                        <button className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 hover:text-white transition-colors">Social</button>

                        {/* Admin Links - Visible only to Admin */}
                        {userRole === 'admin' && (
                            <>
                                <div className="h-4 w-px bg-white/10 mx-2" /> {/* Separator */}
                                <button
                                    onClick={() => { onSwitchView?.('admin'); onNavigateAdmin?.('roster'); }}
                                    className={`text-[10px] uppercase tracking-[0.3em] font-bold transition-colors ${currentView === 'admin' && activeAdminPage === 'roster' ? 'text-orange-500' : 'text-neutral-500 hover:text-white'}`}
                                >
                                    Roster
                                </button>
                                <button
                                    onClick={() => { onSwitchView?.('admin'); onNavigateAdmin?.('inventory'); }}
                                    className={`text-[10px] uppercase tracking-[0.3em] font-bold transition-colors ${currentView === 'admin' && activeAdminPage === 'inventory' ? 'text-orange-500' : 'text-neutral-500 hover:text-white'}`}
                                >
                                    Inventory
                                </button>
                                <button
                                    onClick={() => { onSwitchView?.('admin'); onNavigateAdmin?.('keys'); }}
                                    className={`text-[10px] uppercase tracking-[0.3em] font-bold transition-colors ${currentView === 'admin' && activeAdminPage === 'keys' ? 'text-orange-500' : 'text-neutral-500 hover:text-white'}`}
                                >
                                    Keys
                                </button>
                            </>
                        )}
                    </nav>
                </div>

                {/* User & Actions Section */}
                <div className="flex items-center space-x-6">
                    {/* Role Badge */}
                    <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-sm">
                        <div className={`w-1.5 h-1.5 rounded-full ${userRole === 'socio' || userRole === 'admin' ? 'bg-orange-500 animate-pulse' : 'bg-neutral-500'}`} />
                        <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-mono">
                            {userRole === 'socio' ? 'Authorized_Socio' : userRole === 'admin' ? 'Admin_Override' : 'Guest_Protocol'}
                        </span>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-neutral-500 hover:text-white transition-colors relative">
                            <Bell size={18} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full border-2 border-[#050505]"></span>
                        </button>

                        <div className="h-8 w-px bg-white/5 hidden xs:block" />

                        <div className="flex items-center space-x-3 pl-2 group cursor-pointer">
                            <div className="text-right hidden xs:block">
                                <p className="text-[8px] uppercase tracking-[0.2em] text-neutral-600 font-mono leading-none mb-1">Identità</p>
                                <p className="text-[10px] font-bold text-white uppercase tracking-wider">
                                    {userRole === 'socio' || userRole === 'admin' ? 'M. Allegri' : 'Guest_821'}
                                </p>
                            </div>
                            <div className="w-8 h-8 rounded-sm bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                                <User size={16} />
                            </div>
                        </div>

                        <button
                            onClick={onLogout}
                            className="p-2 text-neutral-500 hover:text-orange-500 transition-colors"
                            title="Disconnect"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
