
import React, { useState, useRef, useEffect } from 'react';
import { UserState, ChatMessage } from '../types';
import { sendMessageToAria } from '../services/geminiService';
import { 
  X, Send, Bot, Loader2, Power, Minimize2, Shield, 
  Flag, Smile, Paperclip, Mic, CheckCheck, MoreVertical, 
  Phone, Video, Trash2, Ghost, AlertTriangle, Clock
} from 'lucide-react';

interface NeuralChatProps {
    userState: UserState;
    setUserState: React.Dispatch<React.SetStateAction<UserState>>;
}

const MODERATION_KEYWORDS = [
  'spam', 'scam', 'fake', 'fraude', 'hacker', 'idiota', 'estupido', 'mierda', 'puto', 
  'asqueroso', 'morir', 'matar', 'droga', 'narco'
];

const ANIMATED_STICKERS = ['👽', '🚀', '💎', '🔥', '🍕', '🤖', '💀', '👻', '👾', '🌈', '⚡', '💣'];

const isOnlyEmojis = (str: string) => {
  const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
  const match = str.match(emojiRegex);
  return match && match.join('') === str.trim();
};

const filterMessage = (text: string): string => {
    let filtered = text;
    MODERATION_KEYWORDS.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        filtered = filtered.replace(regex, '****');
    });
    return filtered;
};

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
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [reportModal, setReportModal] = useState<{ msgId: string, userName: string, userId: string } | null>(null);
    
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [userState.chatHistory, isOpen, isLoading, showStickers]);

    const handleSend = async (forcedText?: string) => {
        const txt = forcedText || input;
        if (!txt.trim()) return;

        const filteredText = filterMessage(txt);
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
            const response = await sendMessageToAria(txt);
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
      setReportModal({ msgId: msg.id, userName: msg.senderName || 'Anonymous', userId: msg.senderId || 'anon' });
      setActiveMenuId(null);
    };

    const confirmReport = () => {
      if (!reportModal) return;
      setUserState(prev => ({
        ...prev,
        blockedUsers: [...prev.blockedUsers, reportModal.userId],
        chatHistory: prev.chatHistory.map(m => 
          m.id === reportModal.msgId ? { ...m, isReported: true, text: "[CONTENIDO REPORTADO]" } : m
        )
      }));
      setReportModal(null);
      alert("Reporte enviado. Usuario bloqueado de tu red local.");
    };

    const renderDateHeader = (timestamp: number, prevTimestamp?: number) => {
      const date = new Date(timestamp).toDateString();
      const prevDate = prevTimestamp ? new Date(prevTimestamp).toDateString() : null;
      if (date !== prevDate) {
        return (
          <div className="flex justify-center my-4">
            <div className="bg-[#182229] text-[#8696a0] text-[10px] px-3 py-1 rounded-lg uppercase tracking-widest font-bold">
              {new Date(timestamp).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        );
      }
      return null;
    };

    return (
        <>
            {!isOpen && isHologramActive && (
                <HologramAvatar onClick={() => setIsOpen(true)} onClose={() => setIsHologramActive(false)} />
            )}

            {isOpen && (
                <div className="fixed bottom-0 right-0 md:bottom-8 md:right-8 w-full md:w-[420px] h-[100dvh] md:h-[650px] bg-[#0b141a] md:rounded-2xl shadow-2xl flex flex-col z-[100] animate-in slide-in-from-bottom-10 fade-in duration-300 border-l border-white/5 md:border border-white/10 overflow-hidden">
                    
                    {/* Header */}
                    <div className="bg-[#202c33] px-4 py-3 flex justify-between items-center z-10 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setIsOpen(false)} className="md:hidden text-[#8696a0] p-1"><Minimize2 size={20}/></button>
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-neon-cyan to-blue-600 flex items-center justify-center">
                                    <Bot size={22} className="text-black" />
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#202c33] animate-pulse"></div>
                            </div>
                            <div>
                                <h3 className="text-[#e9edef] font-bold text-sm leading-tight">ARIA <span className="text-neon-cyan text-[10px] ml-1">v4.5</span></h3>
                                <p className="text-[#8696a0] text-[11px]">en línea • cifrado</p>
                            </div>
                        </div>
                        <div className="flex gap-4 text-[#aebac1]">
                            <Video size={18} className="cursor-pointer hover:text-white" />
                            <Phone size={18} className="cursor-pointer hover:text-white" />
                            <MoreVertical size={18} className="cursor-pointer hover:text-white" />
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto bg-[#0b141a] p-4 relative" ref={scrollRef}>
                        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] pointer-events-none"></div>
                        
                        {userState.chatHistory.map((msg, idx) => {
                            const isMe = msg.sender === 'user';
                            const isAI = msg.sender === 'ai';
                            const isEmojiOnly = isOnlyEmojis(msg.text);
                            const prevMsg = userState.chatHistory[idx - 1];
                            const isGrouped = prevMsg && prevMsg.sender === msg.sender && (msg.timestamp - prevMsg.timestamp < 300000);
                            
                            return (
                                <React.Fragment key={msg.id}>
                                    {renderDateHeader(msg.timestamp, prevMsg?.timestamp)}
                                    <div className={`flex w-full mb-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`relative group flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%]`}>
                                            
                                            {/* Chat Bubble */}
                                            <div 
                                                className={`
                                                  px-3 py-1.5 rounded-xl shadow-sm text-sm transition-all
                                                  ${isEmojiOnly ? '!bg-transparent !shadow-none !p-0 text-5xl hover:scale-110' : ''}
                                                  ${!isEmojiOnly && isMe ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none' : ''}
                                                  ${!isEmojiOnly && !isMe ? 'bg-[#202c33] text-[#e9edef] rounded-tl-none' : ''}
                                                  ${isGrouped ? '!rounded-t-xl' : ''}
                                                  ${msg.isReported ? 'italic opacity-50' : ''}
                                                `}
                                            >
                                                {!isMe && !isAI && !isGrouped && (
                                                  <p className="text-[#53bdeb] text-[11px] font-bold mb-0.5">{msg.senderName}</p>
                                                )}

                                                <div className={`${isEmojiOnly ? 'animate-bounce-small' : ''}`}>
                                                  {filterMessage(msg.text)}
                                                </div>

                                                {!isEmojiOnly && (
                                                  <div className="flex justify-end items-center gap-1 mt-1 opacity-60">
                                                    <span className="text-[9px] uppercase font-mono">
                                                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {isMe && <CheckCheck size={12} className="text-[#53bdeb]" />}
                                                  </div>
                                                )}

                                                {/* Context Menu Trigger */}
                                                {!isMe && !isAI && (
                                                  <button 
                                                    onClick={() => setActiveMenuId(activeMenuId === msg.id ? null : msg.id)}
                                                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 bg-black/40 rounded-full"
                                                  >
                                                    <MoreVertical size={12} />
                                                  </button>
                                                )}
                                            </div>

                                            {/* Dropdown Menu */}
                                            {activeMenuId === msg.id && (
                                              <div className="absolute top-8 left-0 z-20 bg-[#233138] border border-white/10 rounded-lg py-1 shadow-2xl w-32 animate-in fade-in zoom-in-95">
                                                <button onClick={() => handleReport(msg)} className="w-full px-3 py-2 text-left text-xs text-red-400 hover:bg-white/5 flex items-center gap-2">
                                                  <Flag size={12}/> Reportar
                                                </button>
                                                <button onClick={() => setActiveMenuId(null)} className="w-full px-3 py-2 text-left text-xs text-[#8696a0] hover:bg-white/5 flex items-center gap-2">
                                                  <Trash2 size={12}/> Ignorar
                                                </button>
                                              </div>
                                            )}
                                        </div>
                                    </div>
                                </React.Fragment>
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

                    {/* Input Area */}
                    <div className="bg-[#202c33] p-3 flex items-center gap-2 border-t border-white/5">
                        <Smile 
                          size={24} 
                          className={`cursor-pointer transition-colors ${showStickers ? 'text-neon-cyan' : 'text-[#8696a0] hover:text-[#e9edef]'}`}
                          onClick={() => setShowStickers(!showStickers)}
                        />
                        <Paperclip size={24} className="text-[#8696a0] hover:text-[#e9edef] cursor-pointer" />
                        
                        <div className="flex-1">
                          <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Escribe un mensaje..."
                            className="w-full bg-[#2a3942] rounded-xl text-[#e9edef] text-sm px-4 py-2.5 focus:outline-none placeholder-[#8696a0]"
                          />
                        </div>

                        {input.trim() ? (
                          <button onClick={() => handleSend()} className="p-3 bg-[#00a884] text-white rounded-full active:scale-95 transition-all shadow-lg">
                            <Send size={20} />
                          </button>
                        ) : (
                          <Mic size={24} className="text-[#8696a0] hover:text-[#e9edef] cursor-pointer" />
                        )}
                    </div>

                    {/* Stickers / Emoji Panel */}
                    {showStickers && (
                      <div className="bg-[#202c33] h-40 border-t border-white/5 p-4 overflow-y-auto">
                        <div className="grid grid-cols-6 gap-4">
                          {ANIMATED_STICKERS.map(s => (
                            <button key={s} onClick={() => handleSend(s)} className="text-3xl hover:bg-white/5 rounded-lg p-2 transition-all">
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Report Modal */}
                    {reportModal && (
                      <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
                        <div className="bg-[#202c33] border border-white/10 rounded-3xl p-6 shadow-2xl w-full max-w-sm">
                          <div className="flex items-center gap-3 text-red-500 mb-4">
                            <AlertTriangle size={24} />
                            <h4 className="font-bold text-lg">Reportar Mensaje</h4>
                          </div>
                          <p className="text-sm text-gray-400 mb-6">
                            ¿Estás seguro de que quieres reportar el mensaje de <span className="text-white font-bold">{reportModal.userName}</span>?
                            Esto bloqueará al usuario permanentemente en tu nodo.
                          </p>
                          <div className="flex gap-3">
                            <button onClick={() => setReportModal(null)} className="flex-1 py-3 bg-white/5 rounded-xl text-xs font-bold uppercase tracking-widest">Cancelar</button>
                            <button onClick={confirmReport} className="flex-1 py-3 bg-red-600 rounded-xl text-xs font-bold uppercase tracking-widest">Confirmar</button>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
            )}
        </>
    );
};
