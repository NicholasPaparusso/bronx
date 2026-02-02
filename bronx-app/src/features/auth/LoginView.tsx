import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Logo } from '../../components/Logo';
import { MoveRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface LoginViewProps {
    onGuestLogin: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onGuestLogin }) => {
    const [isSocio, setIsSocio] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [guestKey, setGuestKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (isSocio) {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password.trim(),
            });

            if (authError) {
                console.error("AUTH ERROR:", authError);
                setError("Protocol Rejected: " + authError.message);
                setIsLoading(false);
            }
            // Success handled by App.tsx
        } else {
            // GUEST LOGIC
            const cleanKey = guestKey.trim().toUpperCase();

            const { data, error } = await supabase
                .from('guest_keys')
                .select('*')
                .eq('key_code', cleanKey)
                .single();

            if (error || !data) {
                setError("ACCESS DENIED: Invalid Guest Key.");
                setIsLoading(false);
                return;
            }

            if (!data.is_active) {
                setError("ACCESS DENIED: Key Deactivated.");
                setIsLoading(false);
                return;
            }

            if (data.expires_at && new Date(data.expires_at) < new Date()) {
                setError("ACCESS DENIED: Key Expired.");
                setIsLoading(false);
                return;
            }

            // Valid key
            onGuestLogin();
            setIsLoading(false);
        }
    };

    return (
        <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]">

            {/* Cinematic Bokeh Background - Specific for Login */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-600/20 blur-[120px] rounded-full animate-[pulse_8s_infinite]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-neutral-800/30 blur-[100px] rounded-full animate-[pulse_12s_infinite_1s]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 w-full max-w-4xl px-8 flex flex-col items-center">

                {/* Top Branding */}
                <div className="mb-20">
                    <Logo className="scale-110 opacity-90" />
                </div>

                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Atmospheric Text */}
                    <div className="hidden lg:block text-left space-y-6">
                        <div className="inline-block px-3 py-1 border border-orange-500/30 rounded-full">
                            <span className="text-[10px] uppercase tracking-[0.4em] text-orange-400 font-mono">NODE: BRONX_MAINLINE</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-light text-white leading-tight tracking-tight">
                            Procedi per <br />
                            <span className="font-bold italic text-orange-500 text-glow-orange">accedere al Bronx.</span>
                        </h1>
                        <p className="text-neutral-400 text-lg font-light max-w-sm leading-relaxed">
                            Benvenuto all'<span className="text-neutral-200 font-medium">Accesso BRONX</span>. Autenticati o vattene a fare in culo.
                        </p>
                    </div>

                    {/* Right: Refined Dark Form */}
                    <div className="w-full max-w-sm mx-auto">
                        <form className="space-y-8" onSubmit={handleLogin}>
                            <div className="space-y-4">
                                <div className="group border-b border-white/20 py-3 focus-within:border-orange-500 transition-all duration-500 bg-white/[0.02] hover:bg-white/[0.04]">
                                    <label className="block px-2 text-[9px] uppercase tracking-[0.4em] text-neutral-400 group-focus-within:text-orange-500 transition-colors font-mono font-bold">
                                        {isSocio ? 'FIRMA DIGITALE (EMAIL)' : 'GUEST_ACCESS_KEY'}
                                    </label>
                                    {isSocio ? (
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="MEMBER@BRONX.EU"
                                            className="w-full bg-transparent border-none py-2 px-2 text-white text-lg focus:outline-none placeholder:text-neutral-700 tracking-wider font-light"
                                            required
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            placeholder="0000-0000-0000"
                                            value={guestKey}
                                            onChange={(e) => setGuestKey(e.target.value)}
                                            className="w-full bg-transparent border-none py-2 px-2 text-white text-lg focus:outline-none placeholder:text-neutral-700 tracking-wider font-mono"
                                        />
                                    )}
                                </div>

                                {isSocio && (
                                    <div className="group border-b border-white/20 py-3 focus-within:border-orange-500 transition-all duration-500 bg-white/[0.02] hover:bg-white/[0.04]">
                                        <label className="block px-2 text-[9px] uppercase tracking-[0.4em] text-neutral-400 group-focus-within:text-orange-500 transition-colors font-mono font-bold">CHIAVE D'ACCESSO</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-transparent border-none py-2 px-2 text-white text-lg focus:outline-none placeholder:text-neutral-700 tracking-wider"
                                            required
                                        />
                                    </div>
                                )}
                            </div>

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-red-500 text-xs font-mono tracking-wider text-center"
                                >
                                    / {error} /
                                </motion.p>
                            )}

                            <button type="submit" disabled={isLoading} className="w-full bg-white text-black py-6 flex items-center justify-between px-10 group hover:bg-orange-600 hover:text-white transition-all duration-700 ease-in-out shadow-[0_0_40px_rgba(255,255,255,0.02)] disabled:opacity-50 disabled:cursor-not-allowed">
                                <span className="font-black uppercase tracking-widest text-xs">
                                    {isLoading ? 'VERIFYING...' : (isSocio ? 'AUTORIZZA INGRESSO' : 'ACCESSO OSPITE')}
                                </span>
                                <MoveRight size={20} className="group-hover:translate-x-3 transition-transform duration-500" />
                            </button>
                        </form>

                        <div className="mt-12 flex justify-between items-center text-[9px] uppercase tracking-[0.4em] text-neutral-300 font-mono">
                            <button className="hover:text-orange-600 transition-colors duration-300">RECUPERA_CHIAVE</button>
                            <div className="w-1.5 h-1.5 bg-neutral-800 rounded-full"></div>
                            <button
                                onClick={() => setIsSocio(!isSocio)}
                                className="hover:text-white border-b border-transparent hover:border-orange-600 transition-all duration-300 pb-0.5"
                            >
                                {isSocio ? 'SWITCH_GUEST' : 'SWITCH_MEMBER'}
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            <style>{`
                .text-glow-orange {
                  text-shadow: 0 0 15px rgba(234, 88, 12, 0.4);
                }
              `}</style>
        </div>
    );
};
