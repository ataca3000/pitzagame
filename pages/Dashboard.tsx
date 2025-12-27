
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserState, UserProfile } from '../types';
import { Zap, Database, Lock, RefreshCw, AlertTriangle, Info, TrendingUp, Users } from 'lucide-react';

interface DashboardProps {
  userState: UserState;
  setUserState: React.Dispatch<React.SetStateAction<UserState>>;
  userProfile: UserProfile | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ userState, setUserState, userProfile }) => {
  const navigate = useNavigate();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 pb-32">
      <div className="p-6 space-y-6 pt-24">
          
          {/* Tarjeta de PitzzaCoins Acumulados (Basada en Imagen 2) */}
          <div className="bg-[#111B27]/90 backdrop-blur-xl border border-white/10 rounded-[35px] p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Database size={120} className="text-gray-400" />
              </div>
              <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                      <RefreshCw size={14} className="text-neon-green animate-spin-slow" />
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">PITZZACOINS ACUMULADOS</p>
                  </div>

                  <div className="flex items-center gap-5 mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-700 rounded-full flex items-center justify-center text-4xl shadow-2xl border border-orange-300/30">🍕</div>
                      <div className="flex items-baseline gap-2">
                          <span className="text-7xl font-black text-white font-display tracking-tighter italic">
                              {userState.balance.toFixed(2)}
                          </span>
                          <span className="text-sm font-bold text-gray-500 font-mono tracking-widest uppercase">PTZ</span>
                      </div>
                  </div>

                  <p className="text-[10px] text-gray-500 font-mono leading-relaxed mb-8 max-w-[300px] uppercase tracking-tighter">
                      Recursos obtenidos por tu participación activa en la red y visualización de nodos premium. 
                      <span className="text-neon-green ml-1 font-bold">(1 PTZ ≈ 1.00 MXN)</span>
                  </p>

                  <button 
                    onClick={() => navigate('/earn')}
                    className="w-full py-5 bg-neon-green text-black font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-[0_0_25px_rgba(57,255,20,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                      <Zap size={18} fill="currentColor" /> RECOLECTAR MÁS
                  </button>
              </div>
          </div>

          {/* Banner de Error Mock (Basada en Imagen 2) */}
          <div className="bg-[#1C0F14]/90 backdrop-blur-md border border-red-500/30 rounded-2xl p-5 flex items-center gap-5 animate-pulse">
              <div className="bg-red-500/20 p-3 rounded-xl border border-red-500/30 shrink-0">
                  <AlertTriangle className="text-red-500" size={24} />
              </div>
              <div>
                  <h4 className="text-red-500 font-black text-[10px] uppercase tracking-[0.2em]">ERROR: MODO REAL ACTIVADO SIN IDS</h4>
                  <p className="text-red-500/60 text-[9px] font-mono mt-0.5 uppercase tracking-tighter italic">Edita 'config.ts' y pon tu ca-pub-ID de AdMob.</p>
              </div>
          </div>

          {/* Bóveda de Seguridad (Basada en Imagen 2) */}
          <div className="bg-[#0A0D14]/90 backdrop-blur-xl border border-white/10 rounded-[35px] p-8 relative shadow-2xl">
              <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-3">
                      <div className="p-2 bg-neon-orange/10 rounded-lg">
                        <Lock className="text-neon-orange" size={20} />
                      </div>
                      <h3 className="text-white font-black text-sm uppercase tracking-[0.2em] italic">BÓVEDA DE SEGURIDAD</h3>
                  </div>
                  <div className="text-right">
                      <p className="text-neon-orange font-black text-2xl font-display">{userState.salsaBalance.toFixed(2)} PTZ</p>
                      <p className="text-[8px] text-gray-600 uppercase font-mono tracking-widest mt-1">Fondo de reserva mensual.</p>
                  </div>
              </div>

              <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.3em]">
                      <span className="text-gray-500">DESENCRIPTANDO BÓVEDA</span>
                      <span className="text-neon-cyan">0/60 PROTOCOLOS</span>
                  </div>
                  <div className="w-full h-3 bg-gray-950 rounded-full border border-white/5 overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-neon-cyan/40 to-neon-cyan w-0 transition-all duration-1000"></div>
                  </div>
              </div>

              <div className="bg-orange-500/5 border border-orange-500/20 p-5 rounded-2xl flex gap-4">
                  <Info className="text-neon-orange shrink-0" size={24} />
                  <p className="text-[11px] text-orange-200/70 leading-relaxed font-medium uppercase tracking-tighter">
                      Completa <span className="text-white font-black">60 protocolos de publicidad más</span> para liberar estos recursos a tu cuenta principal.
                  </p>
              </div>
          </div>

          {/* Estadísticas de Red */}
          <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#111B27]/80 backdrop-blur-md border border-white/5 p-8 rounded-[35px] flex flex-col items-center justify-center text-center group hover:border-blue-500/30 transition-all">
                  <TrendingUp className="text-blue-500 mb-3 group-hover:scale-110 transition-transform" size={28} />
                  <p className="text-3xl font-black text-white font-display">0</p>
                  <p className="text-[9px] text-gray-600 uppercase font-bold tracking-[0.3em] mt-1">Impacto Global</p>
              </div>
              <div className="bg-[#111B27]/80 backdrop-blur-md border border-white/5 p-8 rounded-[35px] flex flex-col items-center justify-center text-center group hover:border-purple-500/30 transition-all">
                  <Users className="text-purple-500 mb-3 group-hover:scale-110 transition-transform" size={28} />
                  <p className="text-3xl font-black text-white font-display">0</p>
                  <p className="text-[9px] text-gray-600 uppercase font-bold tracking-[0.3em] mt-1">Nodos Activos</p>
              </div>
          </div>

      </div>
    </div>
  );
};
