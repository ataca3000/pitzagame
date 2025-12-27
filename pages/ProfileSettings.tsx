
import React, { useState } from 'react';
import { UserProfile, UserState } from '../types';
import { ChevronLeft, User, Camera, Bell, ShieldCheck, Save, RefreshCw, Sparkles, Zap, Smartphone, Mail, Lock, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getRandomAvatar } from '../services/auth';

interface ProfileSettingsProps {
  userProfile: UserProfile | null;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  userState: UserState;
  setUserState: React.Dispatch<React.SetStateAction<UserState>>;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ userProfile, setUserProfile, userState, setUserState }) => {
  const navigate = useNavigate();
  const [name, setName] = useState(userProfile?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [phone, setPhone] = useState(userState.twoFactorPhone || '');

  const handleRandomizeAvatar = () => {
    if (!userProfile) return;
    const newAvatar = getRandomAvatar(Date.now().toString());
    setUserProfile({ ...userProfile, avatar: newAvatar });
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const handleSave = () => {
    if (!userProfile) return;
    setIsSaving(true);
    
    // Simulate API delay
    setTimeout(() => {
      setUserProfile({ ...userProfile, name });
      setUserState(prev => ({ ...prev, twoFactorPhone: phone }));
      setIsSaving(false);
      if (navigator.vibrate) navigator.vibrate(20);
      alert("Sincronización de Perfil Exitosa");
    }, 800);
  };

  const toggleNotifications = () => {
    setUserState(prev => ({ ...prev, notificationsEnabled: !prev.notificationsEnabled }));
    if (navigator.vibrate) navigator.vibrate(5);
  };

  const toggle2FA = () => {
    setUserState(prev => ({ ...prev, is2FAEnabled: !prev.is2FAEnabled }));
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const set2FAMethod = (method: 'EMAIL' | 'SMS') => {
    setUserState(prev => ({ ...prev, twoFactorMethod: method }));
    if (navigator.vibrate) navigator.vibrate(5);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 min-h-screen pb-32">
      <div className="crystal-header relative h-64">
        <img src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1200" alt="Profile Background" />
        <div className="overlay">
          <button onClick={() => navigate(-1)} className="absolute top-8 left-6 p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl text-white">
            <ChevronLeft size={20} />
          </button>
          <div className="flex flex-col items-center">
            <div className="relative group mb-4">
              <div className="absolute -inset-4 bg-neon-cyan/20 blur-2xl rounded-full group-hover:bg-neon-cyan/40 transition-all duration-700"></div>
              <div className="relative w-32 h-32 rounded-full border-4 border-neon-cyan/50 overflow-hidden shadow-[0_0_30px_rgba(0,255,255,0.3)]">
                <img src={userProfile?.avatar} alt="Avatar" className="w-full h-full object-cover" />
                <button 
                  onClick={handleRandomizeAvatar}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                >
                  <RefreshCw className="text-white" size={24} />
                </button>
              </div>
              <button 
                onClick={handleRandomizeAvatar}
                className="absolute bottom-0 right-0 p-2 bg-neon-cyan text-black rounded-full shadow-lg transform translate-x-1/4"
              >
                <Camera size={16} />
              </button>
            </div>
            <h1 className="text-3xl font-display font-black text-white italic tracking-tighter uppercase">ID: {userProfile?.id.slice(0, 8)}</h1>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8 -mt-8 relative z-20">
        {/* Basic Info Section */}
        <div className="neon-glass p-8 rounded-[40px] border border-white/10 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <User className="text-neon-cyan" size={20} />
            <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Identidad del Piloto</h2>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1 block ml-2">Nombre en el Nexo</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm focus:border-neon-cyan outline-none transition-all font-bold"
                placeholder="Nombre del Piloto"
              />
            </div>
            <div className="relative opacity-60">
              <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1 block ml-2">Enlace de Correo</label>
              <input 
                type="text" 
                value={userProfile?.email}
                disabled
                className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 px-6 text-gray-500 text-sm cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* 2FA Section */}
        <div className="neon-glass p-8 rounded-[40px] border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="text-neon-cyan" size={20} />
              <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Seguridad 2FA</h2>
            </div>
            <button 
              onClick={toggle2FA}
              className={`w-12 h-6 rounded-full transition-all relative p-1 ${userState.is2FAEnabled ? 'bg-neon-cyan' : 'bg-gray-700'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-all shadow-md ${userState.is2FAEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>

          {userState.is2FAEnabled && (
            <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => set2FAMethod('EMAIL')}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${userState.twoFactorMethod === 'EMAIL' ? 'bg-neon-cyan/10 border-neon-cyan text-neon-cyan' : 'bg-black/20 border-white/5 text-gray-500'}`}
                >
                  <Mail size={20} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Correo</span>
                </button>
                <button 
                  onClick={() => set2FAMethod('SMS')}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${userState.twoFactorMethod === 'SMS' ? 'bg-neon-cyan/10 border-neon-cyan text-neon-cyan' : 'bg-black/20 border-white/5 text-gray-500'}`}
                >
                  <Smartphone size={20} />
                  <span className="text-[9px] font-black uppercase tracking-widest">SMS</span>
                </button>
              </div>

              {userState.twoFactorMethod === 'SMS' && (
                <div className="animate-in fade-in duration-300">
                  <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1 block ml-2">Número de Móvil</label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+52 000 000 0000"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:border-neon-cyan outline-none transition-all font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Preferences Section */}
        <div className="neon-glass p-8 rounded-[40px] border border-white/10 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="text-neon-pink" size={20} />
            <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Protocolos de Alerta</h2>
          </div>

          <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${userState.notificationsEnabled ? 'bg-neon-pink/10 text-neon-pink' : 'bg-gray-800 text-gray-500'}`}>
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Notificaciones Neurales</p>
                <p className="text-[9px] text-gray-500 uppercase">Alertas de red y recompensas</p>
              </div>
            </div>
            <button 
              onClick={toggleNotifications}
              className={`w-14 h-8 rounded-full transition-all relative p-1 ${userState.notificationsEnabled ? 'bg-neon-pink' : 'bg-gray-700'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transition-all shadow-md ${userState.notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>
        </div>

        {/* Security / Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="neon-glass p-6 rounded-[35px] border border-white/10 flex flex-col items-center text-center">
            <ShieldCheck className="text-neon-green mb-2" size={24} />
            <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Nivel de Seguridad</p>
            <p className="text-white font-black italic">ULTRA_SAFE</p>
          </div>
          <div className="neon-glass p-6 rounded-[35px] border border-white/10 flex flex-col items-center text-center">
            <Zap className="text-neon-orange mb-2" size={24} />
            <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Estado de Nodo</p>
            <p className="text-white font-black italic">SINCRONIZADO</p>
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full py-6 bg-white text-black font-black text-xs uppercase tracking-[0.3em] rounded-[30px] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          {isSaving ? <RefreshCw className="animate-spin" /> : <Save size={18} />}
          {isSaving ? 'SINCRONIZANDO...' : 'GUARDAR PROTOCOLO'}
        </button>
      </div>
    </div>
  );
};
