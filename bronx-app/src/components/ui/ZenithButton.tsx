import React, { type ButtonHTMLAttributes } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { MoveRight } from 'lucide-react';

type CombinedBtnProps = HTMLMotionProps<"button"> & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'style'>;

interface ZenithButtonProps extends CombinedBtnProps {
    variant?: 'solid' | 'outline' | 'ghost';
    showIcon?: boolean;
}

export const ZenithButton: React.FC<ZenithButtonProps> = ({
    children,
    variant = 'solid',
    showIcon = true,
    className = '',
    ...props
}) => {
    const baseStyles = "relative flex items-center justify-center gap-3 px-8 py-4 font-mono text-sm tracking-widest uppercase transition-all duration-300 overflow-hidden";

    const variants = {
        solid: "bg-white text-black hover:bg-zenith-orange hover:text-white",
        outline: "border border-zenith-neutral-800 text-white hover:border-zenith-orange hover:text-zenith-orange",
        ghost: "text-zenith-neutral-400 hover:text-zenith-orange"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            <span className="relative z-10">{children}</span>
            {showIcon && (
                <motion.div
                    initial={{ x: -5, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="relative z-10"
                >
                    <MoveRight size={18} />
                </motion.div>
            )}
        </motion.button>
    );
};
