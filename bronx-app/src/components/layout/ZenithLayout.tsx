import React, { type ReactNode } from 'react';
import { BokehBackground } from './BokehBackground';

interface ZenithLayoutProps {
    children: ReactNode;
}

export const ZenithLayout: React.FC<ZenithLayoutProps> = ({ children }) => {
    return (
        <div className="zenith-bg min-h-screen w-full overflow-hidden">
            <BokehBackground />
            {/* z-index 10 to be clearly above BokehBackground (z-index 1) */}
            <main style={{ position: 'relative', zIndex: 10 }} className="w-full min-h-screen">
                {children}
            </main>
        </div>
    );
};
