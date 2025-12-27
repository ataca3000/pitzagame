
import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Lock, Trophy, Zap, Gift, ArrowUp } from 'lucide-react';

export const PromoGenerator = () => {
    // FAKE DATA FOR SCREENSHOTS
    const mockBalance = 845.20;
    const mockVault = 199.50;

    return (
        <div className="min-h-screen bg-black text-white p-4 relative overflow-hidden font-sans">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 pointer-events-none"></div>
            
            {/* INSTRUCTIONS OVERLAY (HIDDEN IN SCREENSHOT IF CROPPED) */}
            <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black text-center text-xs font-bold p-2 z-[9999]">
                📸 MODO SCREENSHOT: Haz captura de esto para tu TikTok. (Recorta este aviso)
            </div>

            <div className="max-w-md mx-auto space-y-6 mt-8 relative">
                
                {/* --- HEADER --- */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-black font-display italic">PITZZA<span className="text-neon-cyan">FREE</span></h1>
                        <p className="text-xs text-gray-400 font-mono">PLAYER STATUS: <span className="text-green-500">VIP</span></p>
                    </div>
                    <div className="bg-gray-900 px-3 py-1 rounded-full border border-gray-700">
                        <span className="text-xs font-bold">NVL 12 👑</span>
                    </div>
                </div>

                {/* --- MAIN BALANCE (WITH ARROW) --- */}
                <div className="relative">
                    <div className="bg-gradient-to-r from-gray-900 to-black border border-neon-cyan rounded-2xl p-6 shadow-[0_0_30px_rgba(0,255,255,0.3)]">
                        <p className="text-xs text-neon-cyan font-mono mb-1">SALDO DISPONIBLE</p>
                        <h2 className="text-5xl font-black text-white tracking-tighter">{mockBalance.toFixed(2)} <span className="text-lg text-gray-500">PZC</span></h2>
                        <div className="flex gap-2 mt-4">
                            <div className="px-4 py-2 bg-white text-black font-bold rounded-lg text-xs">RETIRAR</div>
                            <div className="px-4 py-2 bg-gray-800 text-white font-bold rounded-lg text-xs">HISTORIAL</div>
                        </div>
                    </div>

                    {/* MARKETING ARROW 1 */}
                    <div className="absolute -right-4 top-10 flex items-center gap-2 animate-bounce">
                        <span className="text-yellow-400 font-black text-lg bg-black px-2 py-1 rounded border border-yellow-400 shadow-lg -rotate-12">
                            DINERO REAL 🤑
                        </span>
                        <ArrowUp className="text-yellow-400 rotate-[-45deg]" size={40} strokeWidth={3} />
                    </div>
                </div>

                {/* --- VAULT VISUALIZATION (REPLACED GRAPH) --- */}
                <div className="relative">
                    <div className="bg-indigo-900/20 border border-indigo-500/50 rounded-xl p-6 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-white flex items-center gap-2"><Lock className="text-indigo-400"/> MI BÓVEDA</h3>
                            <p className="text-[10px] text-gray-400">Ahorro Oculto</p>
                        </div>
                        
                        <div className="w-full bg-gray-900 h-8 rounded-full border border-gray-700 overflow-hidden relative">
                            <div className="absolute inset-0 bg-indigo-600 w-3/4 animate-pulse"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-white z-10">{mockVault} PZC</div>
                        </div>
                    </div>

                    {/* MARKETING ARROW 2 */}
                    <div className="absolute -left-2 bottom-2 flex flex-col items-center animate-pulse">
                        <ArrowUp className="text-neon-pink" size={40} strokeWidth={3} />
                        <span className="text-neon-pink font-black text-sm bg-black px-2 rounded border border-neon-pink shadow-lg">
                            ACUMULA<br/>SIN HACER NADA 🔒
                        </span>
                    </div>
                </div>

                {/* --- GAMES --- */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 relative overflow-hidden flex flex-col items-center justify-center">
                        <Trophy className="text-yellow-400 mb-2" size={24}/>
                        <h4 className="font-bold text-white text-xs">JUGAR TORNEO</h4>
                    </div>
                    <div className="bg-gradient-to-br from-purple-900 to-black border border-purple-500 rounded-xl p-4 flex flex-col justify-center items-center text-center relative overflow-hidden">
                        <Gift className="text-pink-400 mb-2" size={24}/>
                        <h4 className="font-bold text-white text-xs">RECOMPENSA DIARIA</h4>
                    </div>
                </div>

                {/* --- DOWNLOAD CTA --- */}
                <div className="bg-neon-green text-black font-black text-center py-4 rounded-xl shadow-[0_0_20px_#39FF14] animate-pulse">
                    DESCARGAR AHORA 👇<br/>LINK EN BIO
                </div>

            </div>
        </div>
    );
};
