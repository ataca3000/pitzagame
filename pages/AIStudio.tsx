
import React, { useState } from 'react';
import { UserState } from '../types';
import { Wand2, Brain, Loader2, Sparkles, Image as ImageIcon, Heart, Zap, RefreshCw, AlertCircle } from 'lucide-react';
import { generatePremiumImage, generateCardMetadata } from '../services/geminiService';
import { ECONOMY_RULES } from '../config';
import { InterstitialAd } from '../components/InterstitialAd';

interface AIStudioProps {
  userState: UserState;
  setUserState: React.Dispatch<React.SetStateAction<UserState>>;
}

export const AIStudio: React.FC<AIStudioProps> = ({ userState, setUserState }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const [showAd, setShowAd] = useState(false);

  const cost = ECONOMY_RULES.IMAGE_GENERATION_COST;
  const canAfford = userState.balance >= cost;

  const handleCreate = async () => {
    if (!prompt.trim() || !canAfford) return;
    setLoading(true);
    try {
        const metadata = await generateCardMetadata(prompt, 'RARE', cost);
        const img = await generatePremiumImage(`${metadata.name}, high quality digital art, futuristic, detailed`);
        const card = { ...metadata, imageUrl: img, rarity: 'RARE', value: cost * 1.5, mintCost: cost, id: `art_${Date.now()}` };
        
        setUserState(prev => ({ ...prev, balance: prev.balance - cost }));
        setPreview(card);
    } catch(e) {
        console.error(e);
    }
    setLoading(false);
  };

  const handleQuickCharge = () => {
      setShowAd(true);
  };

  const onAdComplete = () => {
      setShowAd(false);
      const reward = 1.50; // Recompensa por ver el anuncio para poder crear
      setUserState(prev => ({ ...prev, balance: prev.balance + reward }));
      if (navigator.vibrate) navigator.vibrate(20);
  };

  if (showAd) return <InterstitialAd onClose={onAdComplete} title="SINCRONIZANDO CARGA NEURAL..." />;

  return (
    <div className="animate-in fade-in duration-1000">
      <div className="crystal-header relative">
          <img src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1200" alt="Studio Cover" />
          <div className="overlay">
              <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-neon-pink rounded-full animate-ping"></div>
                  <span className="text-[8px] text-neon-pink font-black uppercase tracking-widest">Alquimia Neural Activa</span>
              </div>
              <h1 className="text-6xl font-display font-black text-white italic tracking-tighter drop-shadow-2xl">Aura <span className="text-neon-pink">Lab</span></h1>
              <p className="text-[10px] text-gray-400 font-mono tracking-[0.4em] uppercase mt-2">Transforma Carga en Realidad // v3.0</p>
          </div>
      </div>

      <div className="p-5 space-y-8 -mt-12 relative z-20">
          {!canAfford && (
              <div className="neon-glass p-6 rounded-[35px] border border-yellow-500/30 bg-yellow-500/5 flex flex-col items-center text-center animate-bounce-small">
                  <AlertCircle className="text-yellow-500 mb-2" size={32} />
                  <h3 className="text-white font-black text-sm uppercase italic">Carga Insuficiente</h3>
                  <p className="text-[10px] text-gray-400 mb-4 uppercase tracking-widest leading-relaxed">Se requiere {cost} U para la transmutación neural.</p>
                  <button 
                    onClick={handleQuickCharge}
                    className="w-full py-4 bg-yellow-500 text-black font-black text-[10px] rounded-2xl uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                      <RefreshCw size={16} className="animate-spin-slow" /> SINCRO RÁPIDA (+1.5 U)
                  </button>
              </div>
          )}

          <div className="neon-glass p-8 rounded-[45px] space-y-6 border border-white/20 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Brain size={60} className="text-neon-pink"/></div>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] block relative z-10">Manifiesto Visual</label>
              <textarea 
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Describe tu visión..."
                className="w-full bg-black/40 border border-white/10 rounded-[30px] p-6 text-white text-sm focus:border-neon-pink outline-none h-32 transition-all backdrop-blur-xl relative z-10"
              />
              <button 
                onClick={handleCreate}
                disabled={loading || !canAfford || !prompt.trim()}
                className={`w-full py-6 rounded-[35px] flex items-center justify-center gap-4 transition-all shadow-xl font-display font-black text-xs uppercase tracking-widest ${canAfford ? 'bg-gradient-to-r from-neon-pink to-purple-600 text-white hover:scale-[1.02] active:scale-95' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
              >
                  {loading ? <Loader2 className="animate-spin"/> : <Sparkles size={20}/>}
                  {loading ? 'Transmutando...' : `GENERAR ESENCIA (${cost} U)`}
              </button>
          </div>

          {preview && (
              <div className="flex flex-col items-center animate-in zoom-in duration-700 pb-20">
                  <div className="relative group">
                      <div className="absolute -inset-10 bg-neon-pink/20 blur-[100px] rounded-full animate-pulse"></div>
                      <div className="relative bg-black rounded-[40px] overflow-hidden border border-white/20 shadow-2xl w-80">
                          <img src={preview.imageUrl} className="w-full aspect-square object-cover" />
                          <div className="p-6 bg-black/80 backdrop-blur-md">
                              <h3 className="text-white font-black italic uppercase text-lg">{preview.name}</h3>
                              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest line-clamp-1">{preview.description}</p>
                          </div>
                      </div>
                  </div>
                  <button className="mt-8 px-12 py-4 bg-white text-black font-black rounded-full hover:scale-105 transition-all text-[10px] uppercase tracking-widest shadow-2xl">
                      MINT EN NODO
                  </button>
              </div>
          )}
      </div>
    </div>
  );
};
