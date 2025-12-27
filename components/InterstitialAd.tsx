
import React, { useState, useEffect } from 'react';
import { Loader2, X, ShieldCheck, Zap } from 'lucide-react';
import { APP_CONFIG } from '../config';

interface InterstitialAdProps {
    onClose: () => void;
    title?: string;
}

export const InterstitialAd: React.FC<InterstitialAdProps> = ({ onClose, title = "ESTABLISHING SECURE CONNECTION..." }) => {
    const [timeLeft, setTimeLeft] = useState(5); // 5 seconds forced view for higher view-through rate
    const [canClose, setCanClose] = useState(false);
    
    const isRealAd = APP_CONFIG.ENABLE_REAL_ADS;

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setCanClose(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (isRealAd) {
            try {
                // @ts-ignore
                const adsbygoogle = window.adsbygoogle || [];
                adsbygoogle.push({});
            } catch (e) {
                console.error("AdSense Interstitial Error", e);
            }
        }
    }, [isRealAd]);

    return (
        <div className="fixed inset-0 z-[300] bg-black/95 flex flex-col items-center justify-center p-4 animate-in fade-in duration-300 backdrop-blur-xl">
            {/* Header / Loading State */}
            <div className="absolute top-8 text-center w-full">
                <div className="flex justify-center items-center gap-2 mb-2">
                    <Loader2 className="animate-spin text-neon-cyan" size={32} />
                    <Zap className="text-yellow-400 animate-pulse" size={32} />
                </div>
                <h2 className="text-white font-display font-bold tracking-widest text-xl animate-pulse text-shadow-neon">
                    {title}
                </h2>
                <p className="text-gray-500 font-mono text-xs mt-1 tracking-widest">SPONSORED UPLINK IN PROGRESS</p>
            </div>

            {/* Ad Container - Responsive High CPM Unit */}
            <div className="bg-white/5 border-2 border-neon-cyan/30 p-1 rounded-xl shadow-[0_0_50px_rgba(0,255,255,0.15)] mt-12 mb-8 relative w-full max-w-md aspect-square md:aspect-video flex items-center justify-center overflow-hidden">
                {isRealAd ? (
                    <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden">
                         {/* Responsive Ad Unit for Max Fill Rate */}
                         <ins className="adsbygoogle"
                            style={{ display: 'block', width: '100%', height: '100%' }}
                            data-ad-client={APP_CONFIG.ADSENSE_CLIENT_ID}
                            data-ad-slot={APP_CONFIG.ADSENSE_INTERSTITIAL_SLOT_ID}
                            data-ad-format="rectangle, horizontal" 
                            data-full-width-responsive="true"
                         ></ins>
                    </div>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center text-center p-6 relative group">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                        <span className="text-neon-pink font-black text-3xl mb-2 drop-shadow-md z-10">MEGA BRAND</span>
                        <p className="text-gray-400 text-sm z-10">Premium Ad Placement</p>
                        <p className="text-gray-600 text-[10px] mt-4 font-mono z-10">High CPM • High CTR • Targeted</p>
                        <button className="mt-6 bg-white text-black px-6 py-2 rounded-full font-bold text-xs hover:scale-105 transition-transform z-10 shadow-lg">VISIT SPONSOR</button>
                    </div>
                )}
                
                <div className="absolute top-2 right-2 bg-black/60 px-2 py-0.5 rounded text-[8px] text-gray-400 border border-gray-700">
                    ADVERTISEMENT
                </div>
            </div>

            {/* Action Button */}
            <button 
                onClick={onClose}
                disabled={!canClose}
                className={`w-64 py-4 rounded-xl font-black font-display tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
                    canClose 
                    ? 'bg-neon-cyan text-black hover:scale-105 shadow-[0_0_30px_#00FFFF] border border-white' 
                    : 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed opacity-50'
                }`}
            >
                {canClose ? (
                    <>CONTINUE <X size={20}/></>
                ) : (
                    <><Loader2 className="animate-spin" size={16}/> WAIT {timeLeft}s</>
                )}
            </button>

            {/* Footer Trust */}
            <div className="absolute bottom-8 flex items-center gap-2 text-gray-600 text-[10px] font-mono">
                <ShieldCheck size={12} className="text-green-500"/>
                SECURE ADVERTISING PROTOCOL // VERIFIED
            </div>
        </div>
    );
};
