import React, { type InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface ZenithInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const ZenithInput: React.FC<ZenithInputProps> = ({ label, ...props }) => {
    return (
        <div className="relative w-full mb-8">
            <input
                {...props}
                className="peer w-full bg-transparent border-b border-zenith-neutral-800 py-2 text-white placeholder-transparent focus:outline-none focus:border-zenith-orange transition-colors font-mono"
                placeholder={label}
            />
            <label
                className="absolute left-0 -top-3.5 text-zenith-neutral-400 text-xs tracking-widest uppercase transition-all 
                   peer-placeholder-shown:text-base peer-placeholder-shown:text-zenith-neutral-400 peer-placeholder-shown:top-2 
                   peer-focus:-top-3.5 peer-focus:text-zenith-orange peer-focus:text-xs"
            >
                {label}
            </label>
            <motion.div
                initial={{ scaleX: 0 }}
                whileFocus={{ scaleX: 1 }}
                className="absolute bottom-0 left-0 w-full h-[1px] bg-zenith-orange origin-left"
            />
        </div>
    );
};
