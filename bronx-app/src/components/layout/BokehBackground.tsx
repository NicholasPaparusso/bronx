import React from 'react';
import { motion } from 'framer-motion';

export const BokehBackground: React.FC = () => {
    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            backgroundColor: '#050505'
        }}>
            {/* Massive Zenith Glow - The "Ambient Light" */}
            <motion.div
                animate={{
                    opacity: [0.2, 0.4, 0.2],
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '120vw',
                    height: '120vh',
                    background: 'radial-gradient(circle at center, rgba(249, 115, 22, 0.4) 0%, transparent 60%)',
                    borderRadius: '50%',
                    filter: 'blur(80px)',
                    zIndex: 1
                }}
            />


            {/* Flare 2 - Bottom Right (White Neon) */}
            <motion.div
                animate={{
                    x: ["5%", "-5%", "-2%", "5%"],
                    y: ["5%", "-2%", "-5%", "5%"],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{
                    position: 'absolute',
                    bottom: '-10%',
                    right: '-10%',
                    width: '40vw',
                    height: '40vw',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '50%',
                    filter: 'blur(70px)',
                    zIndex: 2
                }}
            />

            {/* Subtle Vignette to focus center */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.6) 100%)',
                zIndex: 3
            }} />
        </div>
    );
};
