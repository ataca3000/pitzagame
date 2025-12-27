
import React from 'react';
import { Youtube, Search, ExternalLink } from 'lucide-react';

interface TechGiantsBannerProps {
  platform: 'GOOGLE' | 'YOUTUBE';
}

export const TechGiantsBanner: React.FC<TechGiantsBannerProps> = ({ platform }) => {
  const isGoogle = platform === 'GOOGLE';

  return (
    <div className="w-full flex justify-center my-2">
      <div className={`relative w-[95%] rounded-full p-[1px] bg-gradient-to-r ${isGoogle ? 'from-blue-500/50 via-green-500/50 to-yellow-500/50' : 'from-red-600/50 via-pink-600/50 to-orange-600/50'} shadow-lg group transform hover:scale-[1.01] transition-transform`}>
        
        {/* Compact Content */}
        <div className="relative bg-black/90 backdrop-blur-md rounded-full px-4 py-1.5 flex items-center justify-between h-8">
          
          <div className="flex items-center gap-2">
              <div className={`text-[10px] font-bold ${isGoogle ? 'text-blue-400' : 'text-red-500'}`}>
                  {isGoogle ? <Search size={12} /> : <Youtube size={12} />}
              </div>
              <span className="text-white font-bold font-display tracking-wider text-[9px] leading-none opacity-80">
                  {isGoogle ? 'GOOGLE SEARCH' : 'YOUTUBE PREMIUM'}
              </span>
          </div>
          
          <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
              <span className="text-[7px] font-mono text-gray-400">PARTNER</span>
              <ExternalLink size={8} className="text-gray-400" />
          </div>

        </div>
      </div>
    </div>
  );
};
