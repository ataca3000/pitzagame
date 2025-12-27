
import React, { useEffect, useState } from 'react';
import { generateNewsFeed } from '../services/geminiService';
import { NewsItem, UserState } from '../types';
import { Heart, MessageSquare, Share2, Loader2, ExternalLink, ShieldCheck, MoreHorizontal, Sparkles, Zap } from 'lucide-react';

interface NewsFeedProps {
  userState: UserState; 
  setUserState: React.Dispatch<React.SetStateAction<UserState>>;
}

const NATIVE_ADS = [
    {
        id: 'ad_1',
        type: 'SPONSORED',
        title: 'Neural Home: Living V4',
        summary: 'Armonía total entre arquitectura y IA. El futuro de tu hogar comienza con un pulso neural.',
        imageUrl: 'https://images.unsplash.com/photo-1600607687940-4e524cb35a5a?auto=format&fit=crop&q=80&w=800',
        engagement: 'Donar Carga',
        author: 'AuraLiving',
        authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=aura',
        reward: 0.15
    },
    {
        id: 'ad_2',
        type: 'SPONSORED',
        title: 'Deep Space: Saturn Ring Tour',
        summary: 'Reserva tu lugar en la primera expedición comercial a los anillos de Saturno. Cupos limitados.',
        imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800',
        engagement: 'Sincronizar',
        author: 'NovaTravel',
        authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=nova',
        reward: 0.20
    },
    {
        id: 'ad_3',
        type: 'SPONSORED',
        title: 'Quantum Watches: Time is Energy',
        summary: 'Mide tu carga neural en tiempo real con la nueva serie Titanium Pro.',
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
        engagement: 'Validar Intel',
        author: 'Chronos',
        authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=watch',
        reward: 0.10
    }
];

export const NewsFeed: React.FC<NewsFeedProps> = ({ userState, setUserState }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
          const aiItems = await generateNewsFeed();
          const combined = [];
          aiItems.forEach((news, i) => {
              combined.push({ ...news, type: 'NEWS', author: 'Global Intel', authorAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=news' });
              if (i === 1) combined.push(NATIVE_ADS[0]);
              if (i === 2) combined.push(NATIVE_ADS[2]);
              if (i === 3) combined.push(NATIVE_ADS[1]);
          });
          setItems(combined);
      } catch (e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleInteraction = (id: string, reward: number = 0.05) => {
      if (navigator.vibrate) navigator.vibrate(10);
      setUserState(prev => ({ ...prev, balance: prev.balance + reward }));
      // Efecto visual instantáneo: mostrar una chispa o pequeño texto flotante
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin text-neon-cyan mb-4" size={40} />
        <p className="text-gray-500 font-display text-xs tracking-widest uppercase">Syncing Neural Intel...</p>
      </div>
    );
  }

  return (
    <div className="pb-32 space-y-8 animate-in fade-in duration-1000">
      <div className="px-5 pt-4">
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {['Aura', 'Intel', 'Vibe', 'Quantum', 'Nova', 'Flux', 'Deep'].map((story, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 shrink-0">
                      <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-neon-pink via-neon-cyan to-neon-green">
                          <div className="w-full h-full rounded-full bg-black border-2 border-black overflow-hidden">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${story}`} className="w-full h-full object-cover" />
                          </div>
                      </div>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">{story}</span>
                  </div>
              ))}
          </div>
      </div>

      <div className="space-y-12">
        {items.map((item, idx) => (
          <div key={item.id} className="relative group animate-in slide-in-from-bottom-10 duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
            <div className="flex justify-between items-center px-5 mb-4">
                <div className="flex items-center gap-3">
                    <img src={item.authorAvatar} className="w-9 h-9 rounded-full border border-white/10 shadow-lg" />
                    <div>
                        <h4 className="text-sm font-black text-white flex items-center gap-1 leading-none">
                            {item.author} {item.type === 'NEWS' && <ShieldCheck size={14} className="text-neon-cyan" />}
                        </h4>
                        <p className="text-[9px] text-gray-500 font-mono tracking-widest uppercase mt-1">
                            {item.type === 'SPONSORED' ? 'Comunidad Aura' : 'Intel Verificado'}
                        </p>
                    </div>
                </div>
                <button className="text-gray-500"><MoreHorizontal size={24}/></button>
            </div>

            <div 
                onClick={() => handleInteraction(item.id, item.reward)}
                className="relative aspect-square w-full overflow-hidden border-y border-white/5 cursor-pointer active:scale-[0.99] transition-all duration-500 shadow-2xl"
            >
                <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[4000ms]" alt="Content" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/30 to-transparent p-6 pt-24">
                    <h3 className="text-2xl font-display font-black text-white italic tracking-tighter mb-2 drop-shadow-xl">
                        {item.title}
                    </h3>
                    <p className="text-xs text-gray-300 line-clamp-2 opacity-80 mb-5 leading-relaxed">
                        {item.summary}
                    </p>
                    {item.type === 'SPONSORED' && (
                        <div className="bg-white/10 backdrop-blur-3xl border border-white/20 p-4 rounded-2xl flex justify-between items-center group-hover:bg-white/20 transition-all shadow-xl">
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{item.engagement}</span>
                            <Zap size={18} className="text-neon-cyan animate-pulse" fill="currentColor" />
                        </div>
                    )}
                </div>
            </div>

            <div className="px-5 mt-5 flex justify-between items-center">
                <div className="flex gap-8">
                    <button onClick={() => handleInteraction(item.id)} className="text-white hover:text-neon-pink transition-all flex items-center gap-2">
                        <Heart size={26} /> <span className="text-[10px] font-black">Validar</span>
                    </button>
                    <button className="text-white hover:text-neon-cyan transition-all">
                        <MessageSquare size={26} />
                    </button>
                    <button className="text-white hover:text-neon-green transition-all">
                        <Share2 size={26} />
                    </button>
                </div>
                {item.type === 'SPONSORED' && (
                    <div className="text-neon-cyan font-mono text-[9px] font-black flex items-center gap-1.5 px-3 py-1 bg-neon-cyan/10 rounded-full border border-neon-cyan/20">
                        <Sparkles size={12}/> PULSO ACTIVO
                    </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
