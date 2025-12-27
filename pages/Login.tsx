
import React, { useState } from 'react';
import { loginWithEmail, registerWithEmail, PRIVACY_POLICY_TEXT } from '../services/auth';
import { UserProfile } from '../types';
import { Loader2, Mail, Key, Shield, Chrome, Facebook, X, Info } from 'lucide-react';
import { TwoFactorModal } from '../components/TwoFactorModal';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('REGISTER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedPolicy, setAcceptedPolicy] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [show2FA, setShow2FA] = useState(false);
  const [pendingUser, setPendingUser] = useState<UserProfile | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setErrorMsg(null);
      try {
          let user = mode === 'REGISTER' ? await registerWithEmail(email, password) : await loginWithEmail(email, password);
          onLogin(user);
      } catch (err) {
          setErrorMsg("ERROR: CREDENCIALES INVÁLIDAS");
          setLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-[#050B14] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Fondo de Nebulosa Dinámico */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-[420px] relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-[#0A1120]/80 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-center">
          
          {/* Logo Circular Naranja de las imágenes */}
          <div className="w-24 h-24 mx-auto mb-6 relative group">
             <div className="absolute inset-0 bg-orange-500 blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
             <div className="relative w-full h-full bg-gradient-to-br from-orange-400 to-orange-700 rounded-full flex items-center justify-center shadow-2xl border border-orange-300/30">
                <span className="text-4xl">🍕</span>
             </div>
          </div>

          <h1 className="text-4xl font-display font-black text-white tracking-tighter italic flex flex-col leading-none mb-1">
            PITZZA<span className="text-neon-cyan">PLANET</span>
          </h1>
          <p className="text-[10px] text-gray-500 font-mono tracking-[0.3em] uppercase mb-8">
            SECURE IDENTITY GATEWAY V2.1
          </p>

          {/* Selector Iniciar Sesión / Crear Cuenta (Igual a la captura) */}
          <div className="flex bg-black/60 p-1 rounded-xl border border-white/5 mb-6">
              <button 
                type="button" 
                onClick={() => setMode('LOGIN')} 
                className={`flex-1 py-2.5 text-[10px] font-black uppercase rounded-lg transition-all ${mode === 'LOGIN' ? 'bg-[#182229] text-white' : 'text-gray-600'}`}
              >
                INICIAR SESIÓN
              </button>
              <button 
                type="button" 
                onClick={() => setMode('REGISTER')} 
                className={`flex-1 py-2.5 text-[10px] font-black uppercase rounded-lg transition-all ${mode === 'REGISTER' ? 'bg-neon-cyan text-black shadow-[0_0_15px_rgba(0,255,255,0.4)]' : 'text-gray-600'}`}
              >
                CREAR CUENTA
              </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input 
                  type="email" 
                  placeholder="Correo Electrónico" 
                  className="w-full bg-black/60 border border-white/10 rounded-xl py-4 pl-12 pr-6 text-white text-sm focus:border-neon-cyan outline-none transition-all placeholder-gray-700" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input 
                  type="password" 
                  placeholder="Contraseña Maestra" 
                  className="w-full bg-black/60 border border-white/10 rounded-xl py-4 pl-12 pr-6 text-white text-sm focus:border-neon-cyan outline-none transition-all placeholder-gray-700" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                />
              </div>

              {errorMsg && <p className="text-red-500 text-[10px] font-bold uppercase animate-pulse">{errorMsg}</p>}

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20"
              >
                  {loading ? <Loader2 className="animate-spin" /> : mode === 'REGISTER' ? 'CREAR USUARIO' : 'SINCRO ACCESO'}
              </button>
          </form>

          <div className="mt-8">
              <p className="text-[9px] text-gray-600 font-mono tracking-widest uppercase mb-4">O CONECTA CON</p>
              <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-2 py-3 bg-[#182229] border border-white/5 rounded-xl text-white text-[10px] font-bold hover:bg-gray-800 transition-all">
                      <Chrome size={14} /> Google
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 bg-[#1B3057] border border-white/5 rounded-xl text-white text-[10px] font-bold hover:bg-[#254178] transition-all">
                      <Facebook size={14} /> Facebook
                  </button>
              </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2">
              <input type="checkbox" checked={acceptedPolicy} onChange={e => setAcceptedPolicy(e.target.checked)} className="accent-neon-cyan" />
              <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Acepto <button onClick={() => setShowPolicy(true)} className="text-neon-cyan hover:underline">Términos y Privacidad</button>.</span>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-center gap-2 opacity-40">
              <Shield size={12} className="text-green-500" />
              <span className="text-[8px] text-gray-600 font-mono uppercase tracking-[0.2em]">SSL ENCRYPTED</span>
          </div>
        </div>
      </div>

      {showPolicy && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl p-6 flex items-center justify-center animate-in fade-in">
            <div className="bg-[#0A1120] border border-white/10 rounded-[32px] max-w-2xl w-full p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-display font-black text-white italic">PROTOCOLO PITZZA</h2>
                    <button onClick={() => setShowPolicy(false)} className="text-gray-400 hover:text-white"><X /></button>
                </div>
                <div className="text-[10px] text-gray-500 leading-relaxed font-mono h-64 overflow-y-auto pr-4">{PRIVACY_POLICY_TEXT}</div>
                <button onClick={() => setShowPolicy(false)} className="w-full mt-8 py-4 bg-neon-cyan text-black font-black rounded-xl text-[10px] uppercase">CERRAR PROTOCOLO</button>
            </div>
        </div>
      )}
    </div>
  );
};
