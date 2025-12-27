
import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Zap, Sparkles, Hexagon } from 'lucide-react';

interface HoloCardProps {
    image: string;
    name: string;
    rarity: string;
    stats: { atk: number; def: number; spd: number };
    element: string;
    description: string;
    isFullView?: boolean; // Si es true, activa efectos más intensos
}

export const HoloCard: React.FC<HoloCardProps> = ({ image, name, rarity, stats, element, description, isFullView = false }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotate, setRotate] = useState({ x: 0, y: 0 });
    const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

    const handleMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calcular rotación (Max 20 grados para efecto cristal)
        const rotateX = ((y - centerY) / centerY) * -20; 
        const rotateY = ((x - centerX) / centerX) * 20;

        setRotate({ x: rotateX, y: rotateY });
        // Efecto Tornasol: El gradiente se mueve opuesto al mouse
        setGlare({ x: (x / rect.width) * 100, y: (y / rect.height) * 100, opacity: 1 });
    };

    const handleLeave = () => {
        setRotate({ x: 0, y: 0 });
        setGlare(prev => ({ ...prev, opacity: 0 }));
    };

    // Colores de borde cristalino
    const getBorderColor = () => {
        if (rarity === 'MYTHIC') return 'border-neon-pink/60 shadow-[0_0_40px_rgba(255,0,255,0.4)]';
        if (rarity === 'LEGENDARY') return 'border-yellow-400/60 shadow-[0_0_30px_rgba(250,204,21,0.4)]';
        if (rarity === 'EPIC') return 'border-purple-500/60 shadow-[0_0_25px_rgba(168,85,247,0.4)]';
        return 'border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.2)]';
    };

    return (
        <div 
            className="perspective-container"
            style={{ perspective: '1000px' }}
        >
            <div
                ref={cardRef}
                onMouseMove={handleMove}
                onMouseLeave={handleLeave}
                onTouchMove={handleMove}
                onTouchEnd={handleLeave}
                className={`relative transition-transform duration-100 ease-out rounded-xl overflow-hidden border bg-black/40 backdrop-blur-md select-none ${getBorderColor()} ${isFullView ? 'w-80 h-[480px]' : 'w-64 h-[400px]'}`}
                style={{
                    transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.02, 1.02, 1.02)`,
                    transformStyle: 'preserve-3d',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)'
                }}
            >
                {/* 1. CRYSTAL TEXTURE (Noise + Prismatic Base) */}
                <div className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay opacity-20 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')]"></div>

                {/* 2. BACKGROUND & IMAGE */}
                <div className="absolute inset-0 z-0 bg-gray-900">
                    <img src={image} className="w-full h-full object-cover opacity-90" alt={name} />
                    {/* Dark gradient for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 opacity-90"></div>
                </div>

                {/* 3. TORNASOL (IRIDESCENT) EFFECT - THE "RAINBOW" */}
                <div 
                    className="absolute inset-0 z-10 mix-blend-color-dodge pointer-events-none transition-opacity duration-300"
                    style={{
                        background: `linear-gradient(${115 + rotate.y * 2}deg, 
                            transparent 15%, 
                            rgba(255,0,0,0.4) 25%, 
                            rgba(255,255,0,0.4) 35%, 
                            rgba(0,255,0,0.4) 45%, 
                            rgba(0,255,255,0.4) 55%, 
                            rgba(0,0,255,0.4) 65%, 
                            rgba(255,0,255,0.4) 75%, 
                            transparent 85%)`,
                        opacity: 0.6 // Always visible slightly for the "Tornasol" look
                    }}
                ></div>

                {/* 4. PRISMATIC GLARE (Reflejo de luz blanca fuerte) */}
                <div 
                    className="absolute inset-0 z-20 pointer-events-none mix-blend-soft-light"
                    style={{
                        background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.8) 0%, transparent 60%)`,
                        opacity: glare.opacity
                    }}
                ></div>

                {/* 5. HOLOGRAPHIC STAMP */}
                <div className="absolute top-2 right-2 z-20 opacity-80" style={{ transform: 'translateZ(20px)' }}>
                    <div className="w-8 h-8 border-2 border-white/30 rounded-full flex items-center justify-center animate-pulse-fast bg-white/5 backdrop-blur-sm">
                        <Hexagon size={20} className="text-white animate-spin-slow" />
                    </div>
                </div>

                {/* 6. CONTENT UI (FLOATING) */}
                <div 
                    className="absolute inset-0 z-30 p-4 flex flex-col justify-between"
                    style={{ transform: 'translateZ(40px)' }}
                >
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-1 mb-1">
                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded backdrop-blur-md border border-white/20 text-white`}>
                                    EDICIÓN CRISTAL
                                </span>
                            </div>
                            <h3 className="font-display font-black text-white text-xl tracking-wider drop-shadow-lg uppercase italic leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                                {name}
                            </h3>
                            <span className={`text-[9px] font-bold ${rarity === 'MYTHIC' ? 'text-neon-pink' : 'text-yellow-400'} drop-shadow-md`}>
                                {rarity} CLASS
                            </span>
                        </div>
                    </div>

                    {/* Stats Box - Glassmorphism */}
                    <div className="space-y-3">
                        <div className="bg-black/50 backdrop-blur-md rounded-xl p-3 border border-white/10 shadow-xl">
                            <div className="grid grid-cols-3 gap-2 text-center mb-2">
                                <div className="border-r border-white/10">
                                    <div className="text-[7px] text-gray-400 font-bold tracking-wider">ATK</div>
                                    <div className="text-sm font-black text-white drop-shadow-md">{stats.atk}</div>
                                </div>
                                <div className="border-r border-white/10">
                                    <div className="text-[7px] text-gray-400 font-bold tracking-wider">DEF</div>
                                    <div className="text-sm font-black text-white drop-shadow-md">{stats.def}</div>
                                </div>
                                <div>
                                    <div className="text-[7px] text-gray-400 font-bold tracking-wider">SPD</div>
                                    <div className="text-sm font-black text-white drop-shadow-md">{stats.spd}</div>
                                </div>
                            </div>
                            <div className="text-[9px] text-gray-300 italic border-t border-white/10 pt-2 leading-tight opacity-90 line-clamp-2">
                                "{description}"
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-end">
                            <div className="flex items-center gap-1 text-[8px] text-gray-400 font-mono">
                                <ShieldCheck size={10} className="text-green-500" /> VERIFIED
                            </div>
                            <Zap size={20} className={element === 'FIRE' ? 'text-orange-500' : element === 'CYBER' ? 'text-neon-cyan' : 'text-purple-500'} fill="currentColor"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
