import { useState } from 'react';

export function GuestLinkGenerator() {
    const [generatedLink, setGeneratedLink] = useState<string | null>(null);

    const generateKey = () => {
        // In real app, call Supabase Edge Function
        const mockToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const link = `${window.location.origin}/guest-login?token=${mockToken}`;
        setGeneratedLink(link);
    };

    return (
        <div className="max-w-xl space-y-8">
            <h1 className="text-3xl font-thin tracking-tighter uppercase text-white/50">Guest Keys</h1>

            <div className="p-8 border border-white/10 bg-white/5 rounded-sm space-y-6">
                <p className="text-neutral-400 text-sm">
                    Generate a temporary access key for non-members. Valid for 3 hours.
                </p>

                <button
                    onClick={generateKey}
                    className="w-full py-4 border border-orange-500/50 text-orange-500 hover:bg-orange-500/10 uppercase tracking-[0.2em] transition-all duration-300"
                >
                    Generate Key
                </button>

                {generatedLink && (
                    <div className="mt-6 p-4 bg-black/50 border border-white/10 flex flex-col gap-2 animate-pulse">
                        <span className="text-[10px] uppercase text-neutral-500 tracking-widest">Active Link</span>
                        <code className="text-xs text-orange-400 break-all font-mono select-all">
                            {generatedLink}
                        </code>
                    </div>
                )}
            </div>
        </div>
    );
}
