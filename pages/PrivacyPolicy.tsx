
import React from 'react';
import { ShieldCheck, Lock, EyeOff, Server, Mail, ArrowLeft, FileText, UserCheck, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PRIVACY_POLICY_TEXT } from '../services/auth';

export const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans p-6 md:p-12 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="border-b-2 border-gray-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-black text-white p-3 rounded-xl">
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-black tracking-tight">Privacidad y Normas</h1>
                            <p className="text-sm text-gray-500 font-medium">Pitzza Free Planet • Actualizado</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-sm font-bold bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <ArrowLeft size={16} /> Volver a la App
                    </button>
                </div>

                {/* Key Highlights (Resumen Visual) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4">
                        <UserCheck className="text-blue-600 shrink-0" size={32} />
                        <div>
                            <h3 className="font-bold text-blue-900 mb-1">Anonimato (Nicknames)</h3>
                            <p className="text-xs text-blue-700 leading-relaxed">
                                Recomendamos usar un <strong>Apodo o Seudónimo</strong>. No exigimos tu nombre real para jugar, protegiendo así tu identidad personal ante otros jugadores.
                            </p>
                        </div>
                    </div>
                    <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex gap-4">
                        <AlertTriangle className="text-red-600 shrink-0" size={32} />
                        <div>
                            <h3 className="font-bold text-red-900 mb-1">Tolerancia Cero</h3>
                            <p className="text-xs text-red-700 leading-relaxed">
                                Prohibimos estrictamente la violencia, discriminación, racismo y contenido sexual. Mantenemos un entorno seguro y limpio.
                            </p>
                        </div>
                    </div>
                    <div className="bg-green-50 p-6 rounded-2xl border border-green-100 flex gap-4">
                        <EyeOff className="text-green-600 shrink-0" size={32} />
                        <div>
                            <h3 className="font-bold text-green-900 mb-1">Sin Venta de Datos</h3>
                            <p className="text-xs text-green-700 leading-relaxed">
                                <strong>NO vendemos</strong> ni compartimos tu información personal con terceros, anunciantes externos ni brokers de datos.
                            </p>
                        </div>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 flex gap-4">
                        <Server className="text-purple-600 shrink-0" size={32} />
                        <div>
                            <h3 className="font-bold text-purple-900 mb-1">Infraestructura Segura</h3>
                            <p className="text-xs text-purple-700 leading-relaxed">
                                Tus PitzzaCoins e inventario viven en servidores encriptados de Google Firebase.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Full Text Content */}
                <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                        {PRIVACY_POLICY_TEXT}
                    </div>
                </div>

                {/* Contact Footer */}
                <div className="bg-black text-white p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
                    <div className="flex items-center gap-3">
                        <Mail className="text-yellow-400" />
                        <div>
                            <h4 className="font-bold text-sm">¿Tienes dudas sobre tus datos?</h4>
                            <p className="text-xs text-gray-400">Nuestro equipo de soporte está disponible para ayudarte.</p>
                        </div>
                    </div>
                    <a 
                        href="mailto:pitzzafreeplanet.proyecto@gmail.com"
                        className="bg-white text-black font-bold py-2 px-6 rounded-full text-xs hover:bg-gray-200 transition-colors"
                    >
                        pitzzafreeplanet.proyecto@gmail.com
                    </a>
                </div>

                <div className="text-center text-[10px] text-gray-400 pt-8">
                    &copy; {new Date().getFullYear()} Pitzza Free Planet Project. Todos los derechos reservados.
                </div>

            </div>
        </div>
    );
};
