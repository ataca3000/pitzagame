
import React, { useState, useEffect } from 'react';
import { Shield, Lock, X, RefreshCw, Smartphone, Mail, AlertTriangle } from 'lucide-react';

interface TwoFactorModalProps {
  method: 'EMAIL' | 'SMS';
  target: string;
  onVerify: (code: string) => Promise<boolean>;
  onCancel: () => void;
  onResend: () => void;
}

export const TwoFactorModal: React.FC<TwoFactorModalProps> = ({ method, target, onVerify, onCancel, onResend }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`2fa-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`2fa-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length < 6) return;

    setIsVerifying(true);
    setError(null);
    const success = await onVerify(fullCode);
    if (!success) {
      setError("CÓDIGO INVÁLIDO. PROTOCOLO DE SEGURIDAD RECHAZADO.");
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    }
    setIsVerifying(false);
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="neon-glass w-full max-w-sm rounded-[45px] p-8 border border-white/20 relative shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <button onClick={onCancel} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="absolute -inset-4 bg-neon-cyan/20 blur-2xl rounded-full animate-pulse"></div>
            <div className="relative w-20 h-20 bg-black/40 border-2 border-neon-cyan rounded-3xl flex items-center justify-center text-neon-cyan shadow-[0_0_20px_rgba(0,255,255,0.3)]">
              {method === 'SMS' ? <Smartphone size={32} /> : <Mail size={32} />}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-display font-black text-white italic tracking-tighter uppercase">VERIFICACIÓN 2FA</h2>
            <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mt-1">
              Enviamos un código al {method === 'SMS' ? `móvil ${target}` : `correo ${target}`}
            </p>
          </div>

          <div className="flex gap-2 justify-center w-full">
            {code.map((digit, i) => (
              <input
                key={i}
                id={`2fa-input-${i}`}
                type="text"
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-10 h-14 bg-black/40 border border-white/10 rounded-xl text-center text-xl font-black text-neon-cyan outline-none focus:border-neon-cyan transition-all"
                autoComplete="one-time-code"
                inputMode="numeric"
              />
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-tighter animate-bounce">
              <AlertTriangle size={14} /> {error}
            </div>
          )}

          <div className="w-full space-y-4">
            <button
              onClick={handleVerify}
              disabled={isVerifying || code.join('').length < 6}
              className="w-full py-5 bg-neon-cyan text-black font-black text-xs uppercase tracking-[0.2em] rounded-3xl active:scale-95 transition-all shadow-[0_0_20px_rgba(0,255,255,0.3)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? <RefreshCw className="animate-spin" /> : <Shield size={18} />}
              {isVerifying ? 'VERIFICANDO...' : 'CONFIRMAR IDENTIDAD'}
            </button>

            <div className="flex justify-between items-center text-[10px] font-bold px-2">
              <button 
                onClick={() => { if(timer === 0) { onResend(); setTimer(60); } }} 
                className={`uppercase tracking-widest ${timer === 0 ? 'text-white' : 'text-gray-600'}`}
              >
                Reenviar Código
              </button>
              <span className="text-gray-500 font-mono">00:{timer < 10 ? `0${timer}` : timer}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
