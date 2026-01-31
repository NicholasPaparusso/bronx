import React from 'react';

interface LogoProps {
    className?: string;
    iconColor?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '', iconColor = 'text-orange-500' }) => {
    return (
        <div className={`flex items-center ${className}`}>
            {/* The "B" Square Icon as the first letter */}
            <div className={`w-8 h-8 ${iconColor} flex items-center justify-center font-black border-2 border-current rounded-sm mr-1`}>
                B
            </div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
                RONX<span className={iconColor}>.</span>
            </span>
        </div>
    );
};
