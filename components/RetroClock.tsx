
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const RetroClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatSegment = (num: number) => num.toString().padStart(2, '0');
  
  const hours = formatSegment(time.getHours());
  const minutes = formatSegment(time.getMinutes());
  const seconds = formatSegment(time.getSeconds());

  return (
    <div className="bg-black/80 border-2 border-gray-700 rounded-lg p-2 shadow-[0_0_15px_rgba(0,0,0,0.8)] inline-block transform hover:scale-105 transition-transform">
        <div className="flex items-center gap-2 mb-1 justify-center border-b border-gray-800 pb-1">
            <Clock size={12} className="text-gray-400" />
            <span className="text-[8px] text-gray-400 font-mono tracking-widest uppercase">Server Time</span>
        </div>
        <div className="flex items-center gap-1 font-retro text-lg md:text-xl">
            {/* Hours - Red/Orange Neon */}
            <div className="bg-gray-900 px-2 rounded border border-gray-800 text-neon-orange drop-shadow-[0_0_5px_rgba(255,153,0,0.8)]">
                {hours}
            </div>
            <span className="text-gray-600 animate-pulse">:</span>
            
            {/* Minutes - Cyan/Blue Neon */}
            <div className="bg-gray-900 px-2 rounded border border-gray-800 text-neon-cyan drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]">
                {minutes}
            </div>
            <span className="text-gray-600 animate-pulse">:</span>
            
            {/* Seconds - Pink/Purple Neon */}
            <div className="bg-gray-900 px-2 rounded border border-gray-800 text-neon-pink drop-shadow-[0_0_5px_rgba(255,0,255,0.8)] min-w-[40px] text-center">
                {seconds}
            </div>
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500 mt-2 rounded-full opacity-50 blur-[1px]"></div>
    </div>
  );
};
