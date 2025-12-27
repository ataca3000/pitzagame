
import React from 'react';
import { Trash2, Mail, ShieldAlert, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DataDeletion = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-black text-gray-300 font-sans p-6 md:p-12 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="border-b border-gray-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-black text-white text-neon-pink mb-2">ELIMINACIÓN DE DATOS</h1>
                        <p className="text-sm font-mono text-gray-500">Cumplimiento de Seguridad de Datos (Google Play)</p>
                    </div>
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-xs font-bold bg-gray-900 border border-gray-700 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <ArrowLeft size={14} /> VOLVER A LA APP
                    </button>
                </div>

                {/* Intro */}
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                    <p className="text-sm leading-relaxed">
                        En <strong>Pitzza Free Planet</strong>, valoramos tu privacidad. Tienes el derecho absoluto a solicitar la eliminación completa de tu cuenta y todos los datos asociados (historial de chat, saldo de PitzzaCoins, cartas NFT y registros de actividad).
                    </p>
                </div>

                {/* Method 1: Automatic */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Trash2 className="text-neon-cyan" /> Método 1: Eliminación Automática (Recomendado)
                    </h2>
                    <p className="text-sm">Si aún tienes acceso a la aplicación, puedes borrar todo instantáneamente:</p>
                    
                    <div className="grid gap-3 md:grid-cols-3">
                        <div className="bg-black border border-gray-700 p-4 rounded-xl text-center">
                            <div className="font-black text-2xl text-gray-600 mb-2">1</div>
                            <p className="text-xs font-bold">Abre "Ajustes"</p>
                            <p className="text-[10px] text-gray-500 mt-1">(Icono de engranaje ⚙️)</p>
                        </div>
                        <div className="bg-black border border-gray-700 p-4 rounded-xl text-center">
                            <div className="font-black text-2xl text-gray-600 mb-2">2</div>
                            <p className="text-xs font-bold">Baja a "Zona de Peligro"</p>
                            <p className="text-[10px] text-gray-500 mt-1">(Al final del menú)</p>
                        </div>
                        <div className="bg-black border border-gray-700 p-4 rounded-xl text-center border-red-900/50">
                            <div className="font-black text-2xl text-red-900 mb-2">3</div>
                            <p className="text-xs font-bold text-red-400">Pulsa "Borrar Cuenta"</p>
                            <p className="text-[10px] text-gray-500 mt-1">Confirma la acción</p>
                        </div>
                    </div>
                </div>

                {/* Method 2: Manual Request */}
                <div className="space-y-4 pt-6 border-t border-gray-800">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Mail className="text-yellow-500" /> Método 2: Solicitud por Correo (Soporte)
                    </h2>
                    <p className="text-sm">Si has desinstalado la app o no puedes acceder, procesaremos tu baja manualmente:</p>

                    <div className="bg-blue-900/10 border border-blue-500/30 p-6 rounded-xl">
                        <ol className="list-decimal list-inside space-y-3 text-sm">
                            <li>Envía un correo a <strong className="text-white">pitzzafreeplanet.proyecto@gmail.com</strong></li>
                            <li>En el asunto escribe: <span className="font-mono bg-black px-2 py-0.5 rounded text-yellow-400">SOLICITUD BORRADO DE DATOS</span></li>
                            <li>Incluye tu <strong>ID de Usuario</strong> o el <strong>Email</strong> con el que te registraste.</li>
                        </ol>
                        
                        <div className="mt-6">
                            <a 
                                href="mailto:pitzzafreeplanet.proyecto@gmail.com?subject=SOLICITUD BORRADO DE DATOS&body=Hola, solicito la eliminación de mi cuenta asociada a este correo."
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg"
                            >
                                <Mail size={18} /> ENVIAR SOLICITUD AHORA
                            </a>
                        </div>
                    </div>
                </div>

                {/* Consequences */}
                <div className="bg-red-900/10 border border-red-500/30 p-6 rounded-xl flex gap-4 items-start">
                    <ShieldAlert className="text-red-500 shrink-0" size={24} />
                    <div>
                        <h3 className="font-bold text-red-400 text-sm mb-1">CONSECUENCIAS IRREVERSIBLES</h3>
                        <ul className="text-xs text-gray-400 list-disc list-inside space-y-1">
                            <li>Se eliminarán todos tus <strong>PitzzaCoins (PZC)</strong> y <strong>SalsaCoins</strong>.</li>
                            <li>Se destruirán tus <strong>Cartas NFT</strong> y progreso de nivel.</li>
                            <li>Tu nombre de usuario quedará libre para otros.</li>
                            <li>No podremos recuperar tu cuenta una vez procesada la solicitud.</li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
};
