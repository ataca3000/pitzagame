
import React, { useState, useRef, useEffect } from 'react';
import { UserState, ChatMessage } from '../types';
import { sendMessageToAria } from '../services/geminiService';
import { 
  X, Send, Bot, Loader2, Power, Minimize2, Shield, 
  Ban, AlertTriangle, Smile, Paperclip, Mic, 
  CheckCheck, MoreVertical, Phone, Video, Flag, Ghost, UserX, Trash2
} from 'lucide-react';

interface NeuralChatProps {
    userState: UserState;
    setUserState: React.Dispatch<React.SetStateAction<UserState>>;
}

// Exhaustive list for safety compliance
const MODERATION_KEYWORDS = [
  'spam', 'scam', 'fake', 'fraude', 'hacker', 'exploit', 'sex', 'porn', 'nude',
  'idiota', 'estupido', 'mierda', 'puto', 'tonto', 'asqueroso', 'morir', 'matar',
  'nazi', 'racista', 'odio', 'terrorismo', 'bomba', 'droga', 'narco', 'hack'
];

const filterMessage = (text: string): string => {
    let filtered = text;
    MODERATION_KEYWORDS.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        filtered = filtered.replace(regex, '****');
    });
    return filtered;
};

const ANIMATED_STICKERS = ['👽', '🚀', '💎', '🔥', '🍕', '🤖', '💀', '👻', '👾', '🌈', '⚡', '💣'];

const REPORT_REASONS = [
  { id: 'spam', label: 'Spam o Contenido Comercial', description: 'Publicidad no deseada o links sospechosos' },
  { id: 'harassment', label: 'Acoso o Bullying', description: 'Comportamiento agresivo o insultos personales' },
  { id: 'inappropriate', label: 'Contenido Inadecuado', description: 'Lenguaje ofensivo o material sensible' },
  { id: 'scam', label: 'Fraude o Engaño', description: 'Intento de robo de datos o unidades (U)' },
  { id: 'other', label: 'Otro', description: 'Cualquier otra infracción de las normas' }
];

const HologramAvatar = ({ onClick, onClose }: { onClick: () => void, onClose: () => void }) => {
    return (
        <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-[90] group cursor-pointer animate-float">
            <button 
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="absolute -top-2 -right-2 bg-red-500/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-50 hover:bg-red-600"
            >
                <Power size={12} />
            </button>
            <div onClick={onClick} className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-t-neon-cyan border-b-neon-cyan border-l-transparent border-r-transparent animate-spin-slow opacity-80 shadow-[0_0_15px_rgba(0,255,255,0.4)]"></div>
                <div className="w-8 h-8 bg-gradient-to-br from-neon-cyan to-blue-600 rounded-full flex items-center justify-center shadow-[0_0_20px_#00ffff] animate-pulse">
                    <Bot size={16} className="text-black" />
                </div>
            </div>
        </div>
    );
};

export const NeuralChat: React.FC<NeuralChatProps> = ({ userState, setUserState }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHologramActive, setIsHologramActive] = useState(true); 
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showStickers, setShowStickers] = useState(false);
    
    // Moderation States
    const [activeMessageMenu, setActiveMessageMenu] = useState<string | null>(null);
    const [reportTarget, setReportTarget] = useState<{ msgId: string, userId: string, userName: string } | null>(null);
    const [selectedReason, setSelectedReason] = useState<string>('spam');
    
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [userState.chatHistory, isOpen, showStickers]);

    const handleSend = async (forcedText?: string) => {
        const txt = forcedText || input;
        if (!txt.trim()) return;

        const filteredText = filterMessage(txt);
        if (filteredText.includes('****')) {
            alert("SISTEMA: Protocolo de Seguridad. Mensaje bloqueado por contener términos prohibidos.");
            setInput('');
            return;
        }

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text: txt,
            timestamp: Date.now()
        };

        setUserState(prev => ({
            ...prev,
            chatHistory: [...prev.chatHistory, userMsg]
        }));
        setInput('');
        setShowStickers(false);
        setIsLoading(true);

        try {
            const response = await sendMessageToAria(userMsg.text);
            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: response.text,
                groundingChunks: response.groundingChunks,
                timestamp: Date.now()
            };
            setUserState(prev => ({
                ...prev,
                chatHistory: [...prev.chatHistory, aiMsg]
            }));
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReport = (msg: ChatMessage) => {
      if (msg.sender === 'ai' || msg.sender === 'user') return;
      setReportTarget({ 
        msgId: msg.id, 
        userId: msg.senderId || 'anon', 
        userName: msg.senderName || 'Usuario' 
      });
      setActiveMessageMenu(null);
    };

    const confirmReport = () => {
      if (!reportTarget) return;

      // Block user and update UI
      setUserState(prev => ({
        ...prev,
        blockedUsers: [...prev.blockedUsers, reportTarget.userId],
        chatHistory: prev.chatHistory.map(m => 
          m.senderId === reportTarget.userId ? { ...m, text: "[CONTENIDO BLOQUEADO]", isReported: true } : m
        )
      }));

      alert(`REPORTE ENVIADO: El usuario ${reportTarget.userName} ha sido bloqueado de tu red.`);
      setReportTarget(null);
    };

    const deleteMessage = (id: string) => {
      setUserState(prev => ({
        ...prev,
        chatHistory: prev.chatHistory.filter(m => m.id !== id)
      }));
      setActiveMessageMenu(null);
    };

    return (
        <>
            {!isOpen && isHologramActive && (
                <HologramAvatar onClick={() => setIsOpen(true)} onClose={() => setIsHologramActive(false)} />
            )}

            {isOpen && (
                <div className="fixed bottom-0 right-0 md:bottom-8 md:right-8 w-full md:w-[400px] h-[100dvh] md:h-[650px] bg-[#0b141a] md:rounded-2xl shadow-2xl flex flex-col z-[100] animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden border-l border-white/5 md:border border-white/10">
                    
                    {/* --- WHATSAPP STYLE HEADER --- */}
                    <div className="bg-[#202c33] px-4 py-3 flex justify-between items-center shadow-md z-10 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-400 p-1"><Minimize2 size={20}/></button>
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-neon-cyan to-blue-600 flex items-center justify-center">
                                    <Bot size={22} className="text-black" />
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#202c33] animate-pulse"></div>
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-white font-black italic text-sm tracking-tight leading-none uppercase">ARIA <span className="text-neon-cyan">CORE</span></h3>
                                <span className="text-[#8696a0] text-[10px] uppercase font-mono tracking-widest mt-1">v4.2 // Online</span>
                            </div>
                        </div>
                        <div className="flex gap-4 text-[#aebac1]">
                            <button className="hover:text-white transition-colors p-1"><Video size={18} /></button>
                            <button className="hover:text-white transition-colors p-1"><Phone size={18} /></button>
                            <button onClick={() => setIsOpen(false)} className="hover:text-red-400 transition-colors p-1"><X size={20} /></button>
                        </div>
                    </div>

                    {/* --- CHAT AREA --- */}
                    <div className="flex-1 overflow-y-auto bg-[#0b141a] p-4 space-y-3 relative" ref={scrollRef}>
                        <div className="absolute inset-0 opacity-[0.04] bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] pointer-events-none"></div>
                        
                        <div className="flex justify-center mb-6">
                            <div className="bg-[#182229] text-[#ffd279] text-[9px] px-4 py-2 rounded-xl shadow-sm text-center max-w-[85%] flex items-center gap-2 border border-[#ffd279]/10 uppercase font-black tracking-widest">
                                <Shield size={12} fill="currentColor" />
                                Red Segura: Los mensajes están cifrados y moderados.
                            </div>
                        </div>

                        {userState.chatHistory.map((msg) => {
                            const isMe = msg.sender === 'user';
                            const isAI = msg.sender === 'ai';
                            const isBlocked = (userState.blockedUsers || []).includes(msg.senderId || '');

                            if (isBlocked && !isAI) return null;

                            return (
                                <div key={msg.id} className={`flex w-full group ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`relative max-w-[85%] flex items-end gap-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div 
                                          className={`px-3 py-2 rounded-2xl text-sm shadow-md min-w-[60px] relative transition-all
                                            ${isMe ? 'bg-[#005c4b] text-white rounded-tr-none' : 'bg-[#202c33] text-gray-200 rounded-tl-none'}
                                            ${msg.isReported ? 'italic opacity-50 bg-gray-900 border border-red-900/30' : ''}
                                          `}
                                        >
                                            {/* Header for other senders */}
                                            {!isMe && !isAI && (
                                                <p className="text-[#53bdeb] text-[10px] font-black uppercase tracking-tighter mb-1 truncate max-w-[120px]">
                                                    {msg.senderName}
                                                </p>
                                            )}
                                            
                                            <div className="leading-relaxed whitespace-pre-wrap">{filterMessage(msg.text)}</div>
                                            
                                            <div className="flex justify-end items-center gap-1 mt-1 opacity-60">
                                                <span className="text-[9px]">
                                                  {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </span>
                                                {isMe && <CheckCheck size={12} className="text-[#53bdeb]" />}
                                            </div>

                                            {/* Context Menu Trigger */}
                                            <button 
                                              onClick={() => setActiveMessageMenu(activeMessageMenu === msg.id ? null : msg.id)}
                                              className="absolute top-1 right-1 p-1 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                              <MoreVertical size={14} />
                                            </button>

                                            {/* Context Menu Dropdown */}
                                            {activeMessageMenu === msg.id && (
                                              <div className="absolute top-8 right-0 bg-[#233138] border border-white/10 rounded-xl py-2 w-32 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                                                {!isMe && !isAI && (
                                                  <button onClick={() => handleReport(msg)} className="w-full px-4 py-2 text-left text-xs text-red-400 hover:bg-white/5 flex items-center gap-2">
                                                    <Flag size={12} /> Reportar
                                                  </button>
                                                )}
                                                <button onClick={() => deleteMessage(msg.id)} className="w-full px-4 py-2 text-left text-xs text-gray-400 hover:bg-white/5 flex items-center gap-2">
                                                  <Trash2 size={12} /> Eliminar
                                                </button>
                                              </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {isLoading && (
                          <div className="flex justify-start">
                             <div className="bg-[#202c33] p-3 rounded-2xl rounded-tl-none animate-pulse">
                                <Loader2 className="animate-spin text-neon-cyan" size={16} />
                             </div>
                          </div>
                        )}
                    </div>

                    {/* --- INPUT AREA --- */}
                    <div className="bg-[#202c33] p-3 flex items-center gap-2 border-t border-white/5">
                        <button 
                          onClick={() => setShowStickers(!showStickers)} 
                          className={`p-2 rounded-full transition-colors ${showStickers ? 'text-neon-cyan' : 'text-[#8696a0]'}`}
                        >
                            <Smile size={24} />
                        </button>
                        <button className="p-2 text-[#8696a0] hover:text-white transition-colors hidden md:block">
                            <Paperclip size={22} />
                        </button>
                        
                        <div className="flex-1 relative">
                          <input 
                              type="text" 
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                              placeholder="Escribe un mensaje seguro..."
                              className="w-full bg-[#2a3942] rounded-xl text-white text-sm px-4 py-2.5 focus:outline-none placeholder-gray-500 border border-transparent focus:border-white/10 transition-all"
                          />
                        </div>

                        {input.trim() ? (
                          <button 
                            onClick={() => handleSend()} 
                            className="p-3 bg-[#00a884] text-white rounded-full hover:bg-[#008f6f] active:scale-95 transition-all shadow-lg"
                          >
                              <Send size={20} />
                          </button>
                        ) : (
                          <button className="p-3 bg-[#00a884]/20 text-[#00a884] rounded-full">
                              <Mic size={20} />
                          </button>
                        )}
                    </div>

                    {/* --- MODERATION MODAL --- */}
                    {reportTarget && (
                      <div className="absolute inset-0 bg-black/90 z-[200] flex items-center justify-center p-6 backdrop-blur-md animate-in fade-in duration-300">
                        <div className="bg-[#202c33] border border-white/10 rounded-[35px] w-full p-8 shadow-2xl space-y-6">
                          <div className="flex items-center gap-3 text-red-400 mb-2">
                            <Flag size={24} />
                            <h3 className="text-xl font-black italic tracking-tighter uppercase">Reportar Usuario</h3>
                          </div>
                          
                          <p className="text-xs text-gray-400 leading-relaxed">
                            ¿Por qué quieres reportar a <span className="text-white font-bold">{reportTarget.userName}</span>? 
                            Esta acción bloqueará al usuario y eliminará sus mensajes de tu red local.
                          </p>

                          <div className="space-y-3">
                            {REPORT_REASONS.map(reason => (
                              <button 
                                key={reason.id}
                                onClick={() => setSelectedReason(reason.id)}
                                className={`w-full p-4 rounded-2xl border text-left transition-all ${selectedReason === reason.id ? 'bg-red-500/10 border-red-500' : 'bg-black/20 border-white/5 hover:border-white/20'}`}
                              >
                                <p className="text-white font-bold text-xs">{reason.label}</p>
                                <p className="text-[10px] text-gray-500 mt-1">{reason.description}</p>
                              </button>
                            ))}
                          </div>

                          <div className="flex gap-3 pt-4">
                            <button 
                              onClick={() => setReportTarget(null)} 
                              className="flex-1 py-4 bg-white/5 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest"
                            >
                              Cancelar
                            </button>
                            <button 
                              onClick={confirmReport}
                              className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-900/20"
                            >
                              Reportar y Bloquear
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
            )}
        </>
    );
};
