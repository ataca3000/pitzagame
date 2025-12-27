
import React, { useState } from 'react';
import { UserState, UserProfile } from '../types';
import { Rocket, Play, Zap, Activity, Database, Sparkles, ShieldCheck, RefreshCw, Star } from 'lucide-react';
import { BannerAd } from '../components/BannerAd';
import { InterstitialAd } from '../components/InterstitialAd';

interface EarnProps {
  userState: UserState;
  setUserState: React.Dispatch<React.SetStateAction<UserState>>;
  userProfile?: UserProfile | null;
}

export const Earn : React.FC<EarnProps> = ({ userState, setUserState }) => {
  const [showRewardAd, setShowRewardAd] = useState(false);
  const [adTitle, setAdTitle] = useState("");

  const handleRewardAction = (amount: number, isAd: boolean = false, title: string = "") => {
      if (isAd) {
          setAdTitle(title);
          setShowRewardAd(true);
      } else {
          if (navigator.vibrate) navigator.vibrate(10);
          setUserState(prev => ({ ...prev, balance: prev.balance + amount }));
      }
  };

  const onAdComplete = () => {
    setShowRewardAd(false);
    const reward = 0.75; 
    setUserState(prev => ({ ...prev, balance: prev.balance + reward }));
    if (navigator.vibrate) navigator.vibrate(30);
    // Incrementamos tareas completadas para la bóveda
    setUserState(prev => ({ ...prev, tasksCompleted: prev.tasksCompleted + 1 }));
  };

  if (showRewardAd) return <InterstitialAd onClose={onAdComplete} title={adTitle} />;

  return (
    <div className="animate-in fade-in duration-700 pb-32">
      <div className="crystal-header relative">
          <img src="https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=1200" alt="Earn" />
          <div className="overlay">
              <div className="flex gap-2 mb-2">
                 <div className="w-2 h-2 bg-neon-green rounded-full animate-ping"></div>
                 <span className="text-[8px] text-neon-green font-black uppercase tracking-widest">Protocolos de Pago Activos</span>
              </div>
              <h1 className="text-6xl font-display font-black text-white italic tracking-tighter drop-shadow-2xl">Earn <span className="text-neon-cyan">Hub</span></h1>
              <p className="text-[10px] text-gray-400 font-mono tracking-[0.4em] mt-2 uppercase">Monetiza tu Tiempo // Visualización Premium</p>
          </div>
      </div>

      <div className="p-5 space-y-8 -mt-12 relative z-20">
          
          {/* Status de la Bóveda */}
          <div className="neon-glass p-6 rounded-[35px] border border-white/10 shadow-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                  <div className="p-3 bg-neon-cyan/10 rounded-2xl">
                      <Database className="text-neon-cyan" size={24} />
                  </div>
                  <div>
                      <h4 className="text-white font-black uppercase text-xs italic">Progreso de Bóveda</h4>
                      <p className="text-[9px] text-gray-500 uppercase tracking-widest mt-0.5">{userState.tasksCompleted}/60 Protocolos</p>
                  </div>
              </div>
              <div className="text-right">
                  <Star className="text-neon-orange animate-pulse" size={20} fill="currentColor" />
              </div>
          </div>

          <BannerAd />

          {/* Secciones de Ganancia */}
          <div className="space-y-4">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] ml-4">Nodos de Publicidad Pagada</h3>
              
              <div className="grid grid-cols-1 gap-4">
                  {/* Tarea 1 */}
                  <button 
                    onClick={() => handleRewardAction(0, true, "SINCRO STREAM PATROCINADO...")}
                    className="neon-glass p-8 rounded-[40px] flex items-center justify-between group active:scale-95 transition-all border border-white/10 hover:border-neon-cyan/30 shadow-xl"
                  >
                      <div className="flex items-center gap-6">
                          <div className="p-5 bg-neon-cyan/10 rounded-3xl group-hover:scale-110 transition-transform shadow-inner">
                            <Play className="text-neon-cyan" fill="currentColor" size={28}/>
                          </div>
                          <div className="text-left">
                              <h4 className="text-white font-black uppercase text-base italic tracking-tighter leading-tight">Video Stream <span className="text-neon-cyan">Pro</span></h4>
                              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Recompensa Instantánea + Protocolo</p>
                          </div>
                      </div>
                      <div className="text-neon-cyan font-display font-black text-2xl tracking-tighter">+0.75 PTZ</div>
                  </button>

                  {/* Tarea 2 */}
                  <div 
                    onClick={() => handleRewardAction(0.50)}
                    className="neon-glass p-8 rounded-[40px] flex items-center justify-between group active:scale-95 transition-all border border-white/10 hover:border-neon-pink/30 shadow-xl cursor-pointer"
                  >
                      <div className="flex items-center gap-6">
                          <div className="p-5 bg-neon-pink/10 rounded-3xl group-hover:scale-110 transition-transform">
                            <RefreshCw className="text-neon-pink" size={28}/>
                          </div>
                          <div className="text-left">
                              <h4 className="text-white font-black uppercase text-base italic tracking-tighter leading-tight">Data Sync <span className="text-neon-pink">Node</span></h4>
                              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Sincronización de Anuncio Estático</p>
                          </div>
                      </div>
                      <div className="text-neon-pink font-display font-black text-2xl tracking-tighter">+0.50 PTZ</div>
                  </div>

                  {/* Tarea 3 */}
                  <div 
                    onClick={() => handleRewardAction(1.20)}
                    className="neon-glass p-8 rounded-[40px] flex items-center justify-between group active:scale-95 transition-all border border-white/10 hover:border-neon-green/30 shadow-xl cursor-pointer"
                  >
                      <div className="flex items-center gap-6">
                          <div className="p-5 bg-neon-green/10 rounded-3xl group-hover:scale-110 transition-transform">
                            <Activity className="text-neon-green" size={28}/>
                          </div>
                          <div className="text-left">
                              <h4 className="text-white font-black uppercase text-base italic tracking-tighter leading-tight">Neural <span className="text-neon-green">Impulse</span></h4>
                              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Interacción con Oferta Especial</p>
                          </div>
                      </div>
                      <div className="text-neon-green font-display font-black text-2xl tracking-tighter">+1.20 PTZ</div>
                  </div>
              </div>
          </div>

          {/* Tarjeta de Multiplicador */}
          <div className="neon-glass p-8 rounded-[45px] flex items-center justify-between group border-l-4 border-l-neon-cyan active:scale-95 transition-all shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-neon-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-6 relative z-10">
                  <div className="p-4 bg-neon-cyan/10 rounded-2xl shadow-inner">
                    <Sparkles className="text-neon-cyan" size={28} />
                  </div>
                  <div>
                      <h4 className="text-white font-black uppercase text-sm italic tracking-widest">Multiplicador x2.5</h4>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Activo para Pilotos Verificados</p>
                  </div>
              </div>
              <ShieldCheck className="text-neon-cyan relative z-10" size={32} />
          </div>

          <div className="text-center pt-4">
              <p className="text-[9px] text-gray-600 font-mono uppercase tracking-[0.4em]">Fin del Buffer de Ganancias</p>
          </div>
      </div>
    </div>
  );
};
