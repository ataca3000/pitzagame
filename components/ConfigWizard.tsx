
import React, { useState, useEffect } from 'react';
import { Check, X, ExternalLink, Settings, Mic, Bell, DollarSign, Database, AlertTriangle, Rocket, Smartphone, ShieldCheck } from 'lucide-react';
import { APP_CONFIG } from '../config';
import { isFirebaseConfigured } from '../services/firebaseConfig';

interface ConfigWizardProps {
    onClose: () => void;
}

export const ConfigWizard: React.FC<ConfigWizardProps> = ({ onClose }) => {
    const [micStatus, setMicStatus] = useState<'granted' | 'denied' | 'prompt'>('prompt');
    const [notifStatus, setNotifStatus] = useState<NotificationPermission>('default');

    useEffect(() => {
        setNotifStatus(Notification.permission);
        navigator.permissions?.query({ name: 'microphone' as any })
            .then(p => setMicStatus(p.state as any))
            .catch(() => setMicStatus('prompt'));
    }, []);

    const requestMic = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(() => { setMicStatus('granted'); alert("Microphone Access Granted!"); })
            .catch(() => { setMicStatus('denied'); alert("Access Denied. Check browser settings."); });
    };

    const requestNotif = () => {
        Notification.requestPermission().then(p => setNotifStatus(p));
    };

    // --- CHECKLIST LOGIC ---
    const checks = [
        {
            id: 'api_keys',
            label: 'Google Gemini AI',
            status: APP_CONFIG.GEMINI_API_KEY ? 'OK' : 'MISSING',
            details: 'Necesario para ARIA y Generación de Noticias.'
        },
        {
            id: 'ads',
            label: 'Google AdMob',
            status: APP_CONFIG.ENABLE_REAL_ADS && !APP_CONFIG.ADSENSE_CLIENT_ID.includes('0000') ? 'OK' : 'MOCK',
            details: 'Si está en MOCK, no ganarás dinero real, solo simulación.'
        },
        {
            id: 'db',
            label: 'Firebase Database',
            status: isFirebaseConfigured ? 'OK' : 'OFFLINE',
            details: 'Necesario para Login Social y Torneos Multiplayer.'
        }
    ];

    const readinessScore = checks.filter(c => c.status === 'OK').length;
    const isReadyForStore = readinessScore === 3;

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-in fade-in">
            <div className="w-full max-w-lg bg-surface border border-neon-cyan/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-6 border-b border-gray-800 bg-black/40 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-display font-black text-white flex items-center gap-2">
                            <Rocket className={isReadyForStore ? "text-green-500 animate-bounce" : "text-yellow-500"} /> 
                            PRE-FLIGHT CHECK
                        </h2>
                        <p className="text-xs text-gray-400 mt-1 font-mono">Estado del Sistema para Lanzamiento</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white"><X size={20}/></button>
                </div>

                {/* Status Banner */}
                <div className={`p-4 text-center border-b border-gray-800 ${isReadyForStore ? 'bg-green-900/20' : 'bg-yellow-900/20'}`}>
                    <h3 className={`font-black text-lg ${isReadyForStore ? 'text-green-400' : 'text-yellow-500'}`}>
                        {isReadyForStore ? 'LISTO PARA GOOGLE PLAY 🚀' : 'MODO DESARROLLO / DEMO 🛠️'}
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-1">
                        {isReadyForStore 
                            ? 'Todos los sistemas vitales están conectados.' 
                            : 'Faltan claves reales. La app funcionará en modo simulación.'}
                    </p>
                </div>

                {/* Checklist */}
                <div className="p-6 overflow-y-auto space-y-4">
                    {checks.map(check => (
                        <div key={check.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-xl border border-gray-800">
                            <div>
                                <h4 className="text-sm font-bold text-white">{check.label}</h4>
                                <p className="text-[10px] text-gray-500">{check.details}</p>
                            </div>
                            <div className={`px-3 py-1 rounded text-[10px] font-black border ${
                                check.status === 'OK' ? 'bg-green-500/20 text-green-400 border-green-500/50' : 
                                check.status === 'MOCK' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' :
                                'bg-red-500/20 text-red-500 border-red-500/50'
                            }`}>
                                {check.status}
                            </div>
                        </div>
                    ))}

                    <div className="border-t border-gray-800 pt-4 mt-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Permisos del Dispositivo</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={requestMic} className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold ${micStatus === 'granted' ? 'bg-green-900/20 border-green-500 text-green-400' : 'bg-gray-800 border-gray-600 text-gray-400'}`}>
                                <Mic size={14}/> MICROPHONE
                            </button>
                            <button onClick={requestNotif} className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold ${notifStatus === 'granted' ? 'bg-green-900/20 border-green-500 text-green-400' : 'bg-gray-800 border-gray-600 text-gray-400'}`}>
                                <Bell size={14}/> NOTIFICATIONS
                            </button>
                        </div>
                    </div>
                </div>

                {/* Action Footer */}
                <div className="p-4 border-t border-gray-800 bg-black/40">
                    <a 
                        href="https://www.pwabuilder.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                    >
                        <Smartphone size={18} /> GENERAR APK (PWABUILDER)
                    </a>
                    <p className="text-[9px] text-center text-gray-500 mt-2">
                        <ShieldCheck size={10} className="inline mr-1"/>
                        Asegúrate de actualizar 'metadata.json' antes de construir.
                    </p>
                </div>
            </div>
        </div>
    );
};
