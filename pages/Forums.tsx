
import React, { useState, useEffect, useRef } from 'react';
import { UserState, Forum } from '../types';
import { MessageSquare, Gift, TrendingUp, Users, DollarSign, Plus, Trophy, AlertCircle, Heart, Send, Clock, Sparkles, Newspaper, Globe2, Radio, ArrowLeft, MoreVertical, Flag, ThumbsUp, Smile, Lock, EyeOff, Mic, Paperclip, CheckCheck, Skull, Video, Ghost, Coins, BarChart3 } from 'lucide-react';
import { ECONOMY_RULES } from '../config';

interface ForumsProps {
    userState: UserState;
    setUserState: React.Dispatch<React.SetStateAction<UserState>>;
}

interface ForumMessage {
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: number;
    reactions: Record<string, number>;
    isAnonymous: boolean;
    replyTo?: string;
}

const BAD_WORDS = ['estafa', 'fraude', 'robo', 'idiota', 'estupido', 'mierda', 'puto', 'tonto', 'basura', 'asqueroso', 'morir', 'matar'];

// Actualizados con nombres de "Chismes y Dinero"
const INITIAL_FORUMS: Forum[] = [
    {
        id: 'f_rain',
        title: '☔ LLUVIA DE DINERO',
        description: 'Aquí caen los airdrops más grandes. ¡Actívate!',
        creatorName: 'System',
        createdAt: Date.now(),
        memberCount: 5420,
        maxMembers: 10000,
        airdropAmount: 0, 
        pot: 12500.00,
        views: 8500,
        tags: ['Dinero', 'Oficial']
    },
    {
        id: 'f_gossip',
        title: '🔥 CHISMES & TENDENCIAS',
        description: '¿Qué influencer cayó hoy? Filtra todo aquí.',
        creatorName: 'Holo_Paparazzi',
        createdAt: Date.now(),
        memberCount: 3200,
        maxMembers: 5000,
        airdropAmount: 0,
        pot: 8400.50,
        views: 3200,
        tags: ['Viral', 'Salseo']
    },
    {
        id: 'f_vip',
        title: '💎 SOLO VIPs',
        description: 'Estrategias de alto nivel para Ballenas.',
        creatorName: 'Crypto_King',
        createdAt: Date.now(),
        memberCount: 800,
        maxMembers: 1000,
        airdropAmount: 0,
        pot: 25000.00, 
        views: 1200,
        tags: ['Exclusivo', 'Whales']
    },
    {
        id: 'f_conspiracy',
        title: '👽 ÁREA 51 (TEORÍAS)',
        description: 'La verdad está ahí fuera... y en este chat.',
        creatorName: 'Fox_Mulder',
        createdAt: Date.now(),
        memberCount: 1500,
        maxMembers: 2000,
        airdropAmount: 0,
        pot: 3200.00, 
        views: 1200,
        tags: ['Aliens', 'Misterio']
    }
];

const MOCK_MESSAGES: ForumMessage[] = [
    { id: 'm1', senderId: 'u1', senderName: 'CyberNinja', text: '¡Acabo de donar 50 PZC! Vamos a por el Top 1.', timestamp: Date.now() - 100000, reactions: {'🔥': 5}, isAnonymous: false },
    { id: 'm2', senderId: 'u2', senderName: 'Anon_88', text: 'Este foro va a ganar la semana, lo presiento.', timestamp: Date.now() - 80000, reactions: {'🚀': 12}, isAnonymous: true },
    { id: 'm3', senderId: 'u3', senderName: 'PopQueen', text: 'Recuerden que solo los activos reciben el premio.', timestamp: Date.now() - 50000, reactions: {'👀': 3}, isAnonymous: false },
];

// Helper for random gradient
const getGradient = (index: number) => {
    const gradients = [
        'from-blue-900 to-indigo-900',
        'from-red-900 to-orange-900',
        'from-purple-900 to-pink-900',
        'from-green-900 to-emerald-900'
    ];
    return gradients[index % gradients.length];
};

const getBgImage = (index: number) => {
    const images = [
        'https://images.unsplash.com/photo-1621504450168-b8c4375361bc?auto=format&fit=crop&q=80&w=400', // Money
        'https://images.unsplash.com/photo-1495001258031-d1b407bc1776?auto=format&fit=crop&q=80&w=400', // News
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=400', // VIP
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400'  // Alien
    ];
    return images[index % images.length];
}

export const Forums: React.FC<ForumsProps> = ({ userState, setUserState }) => {
    const [forums, setForums] = useState<Forum[]>(INITIAL_FORUMS);
    const [activeForumId, setActiveForumId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ForumMessage[]>(MOCK_MESSAGES);
    const [newMessage, setNewMessage] = useState('');
    const [isAnonymousMode, setIsAnonymousMode] = useState(false);
    const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Ordenar foros por Pozo (Ranking)
    const rankedForums = [...forums].sort((a, b) => b.pot - a.pot);

    useEffect(() => {
        if (activeForumId) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, activeForumId]);

    const cleanText = (text: string) => {
        let cleaned = text;
        BAD_WORDS.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            cleaned = cleaned.replace(regex, '🤬');
        });
        return cleaned;
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        const cleaned = cleanText(newMessage);
        const msg: ForumMessage = {
            id: `msg_${Date.now()}`,
            senderId: userState.isPro ? 'pro_user' : 'free_user', 
            senderName: isAnonymousMode ? 'Fantasma Digital' : (userState.isCreator ? 'Verificado' : userState.isPro ? 'VIP Member' : 'Usuario'),
            text: cleaned,
            timestamp: Date.now(),
            reactions: {},
            isAnonymous: isAnonymousMode
        };
        setMessages([...messages, msg]);
        setNewMessage('');
    };

    const handleJoin = (forumId: string) => {
        if (!userState.joinedForums.includes(forumId)) {
            setUserState(prev => ({
                ...prev,
                joinedForums: [...prev.joinedForums, forumId]
            }));
        }
        setActiveForumId(forumId);
    };

    const handleDonateToForum = (amount: number) => {
        if (userState.balance < amount) {
            alert("No tienes suficientes PZC.");
            return;
        }
        
        setUserState(prev => ({ ...prev, balance: prev.balance - amount }));
        
        setForums(prev => prev.map(f => {
            if (f.id === activeForumId) {
                return { ...f, pot: f.pot + amount };
            }
            return f;
        }));

        setMessages(prev => [...prev, {
            id: `sys_${Date.now()}`,
            senderId: 'system',
            senderName: 'SISTEMA',
            text: `💰 ¡${userState.isPro ? 'Un VIP' : 'Un usuario'} ha donado ${amount} PZC al pozo! El ranking ha subido.`,
            timestamp: Date.now(),
            reactions: {'🔥': 1},
            isAnonymous: false
        }]);
    };

    if (activeForumId) {
        const activeForum = forums.find(f => f.id === activeForumId);
        const rank = rankedForums.findIndex(f => f.id === activeForumId) + 1;
        const isWinning = rank <= 3;

        return (
            <div className="fixed inset-0 z-[60] bg-[#0b141a] flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between shadow-lg border-b border-gray-800">
                    <div className="flex items-center gap-3" onClick={() => setActiveForumId(null)}>
                        <button className="text-gray-400 hover:text-white"><ArrowLeft /></button>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md cursor-pointer border-2 ${isWinning ? 'bg-gradient-to-br from-yellow-500 to-orange-600 border-yellow-400' : 'bg-gray-700 border-gray-600'}`}>
                            {isWinning ? <Trophy size={16}/> : activeForum?.title.charAt(0)}
                        </div>
                        <div className="cursor-pointer">
                            <h3 className="text-white font-bold text-sm truncate max-w-[150px]">{activeForum?.title}</h3>
                            <p className="text-xs text-gray-400 truncate flex items-center gap-1">
                                Rank #{rank} • POZO: {activeForum?.pot.toLocaleString()} PZC
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => handleDonateToForum(10)} className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 animate-pulse">
                            <Plus size={12}/> DONAR
                        </button>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://i.pinimg.com/originals/97/c0/07/97c00759d90d786d9b6096d274ad3e07.png')] bg-opacity-5">
                    {/* Status Banner */}
                    <div className="flex justify-center mb-4">
                        <div className={`text-[10px] px-3 py-1.5 rounded-lg text-center shadow-sm border max-w-xs flex items-center gap-2 ${isWinning ? 'bg-yellow-900/40 border-yellow-500/50 text-yellow-200' : 'bg-red-900/40 border-red-500/50 text-red-200'}`}>
                            {isWinning ? <Trophy size={12}/> : <AlertCircle size={12}/>} 
                            {isWinning ? '¡Este foro está en el TOP 3! El pozo se repartirá entre los activos.' : '¡PELIGRO! Este foro perderá su pozo si no sube al Top 3.'}
                        </div>
                    </div>

                    {messages.map(msg => {
                        const isMe = msg.senderId === (userState.isPro ? 'pro_user' : 'free_user');
                        const isSystem = msg.senderId === 'system';
                        
                        if (isSystem) {
                            return (
                                <div key={msg.id} className="flex justify-center my-2">
                                    <div className="bg-green-900/30 text-green-300 text-[10px] px-2 py-1 rounded-full font-bold border border-green-800">
                                        {msg.text}
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div key={msg.id} className={`flex flex-col max-w-[85%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                                <div 
                                    className={`relative px-3 py-2 rounded-lg shadow-md text-sm group min-w-[100px] ${isMe ? 'bg-[#005c4b] text-white rounded-tr-none' : 'bg-[#202c33] text-gray-200 rounded-tl-none'}`}
                                >
                                    {!isMe && (
                                        <div className={`text-[11px] font-bold mb-1 flex items-center gap-1 ${msg.isAnonymous ? 'text-gray-400 font-mono' : 'text-[#53bdeb]'}`}>
                                            {msg.isAnonymous && <Ghost size={10} />} {msg.senderName}
                                        </div>
                                    )}
                                    <div className="leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                                    <div className="flex justify-end items-center gap-1 mt-1 opacity-70">
                                        <span className="text-[9px]">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        {isMe && <CheckCheck size={12} className="text-blue-400" />}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="bg-[#202c33] px-2 py-2 flex items-end gap-2">
                    <button className="p-3 text-gray-400 hover:text-gray-200 rounded-full"><Smile size={24}/></button>
                    <div className="flex-1 bg-[#2a3942] rounded-2xl flex items-center px-4 py-2">
                        <button onClick={() => setIsAnonymousMode(!isAnonymousMode)} className={`mr-2 transition-colors ${isAnonymousMode ? 'text-neon-cyan animate-pulse' : 'text-gray-500'}`}>
                            {isAnonymousMode ? <EyeOff size={20} /> : <Users size={20} />}
                        </button>
                        <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Escribe aquí..." className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm py-1" onKeyPress={e => e.key === 'Enter' && handleSendMessage()} />
                    </div>
                    <button onClick={handleSendMessage} className={`p-3 rounded-full text-white shadow-lg transition-transform hover:scale-105 ${newMessage.trim() ? 'bg-[#00a884]' : 'bg-[#2a3942]'}`}>
                        <Send size={20} />
                    </button>
                </div>
            </div>
        );
    }

    // --- RENDER: LIST VIEW ---
    return (
        <div className="pb-24 space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="px-2">
                <h1 className="text-3xl font-display font-black text-white italic tracking-tighter flex items-center gap-2">
                    FOROS <span className="text-neon-cyan">ACTIVOS</span>
                </h1>
                <p className="text-xs text-gray-400 font-mono mt-1">Guerra de Pozos: Top 3 reparten, el resto pierde.</p>
            </div>

            {/* Forums List (Cards) */}
            <div className="grid grid-cols-1 gap-4">
                {rankedForums.map((forum, index) => {
                    const rank = index + 1;
                    const isTop3 = rank <= 3;
                    const bgGradient = getGradient(index);
                    const bgImage = getBgImage(index);

                    return (
                        <div key={forum.id} onClick={() => handleJoin(forum.id)} className={`relative h-32 rounded-xl overflow-hidden cursor-pointer shadow-lg group border border-white/10 hover:border-white/30 transition-all ${isTop3 ? 'ring-1 ring-yellow-500/50' : ''}`}>
                            <div className="absolute inset-0">
                                <img src={bgImage} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                                <div className={`absolute inset-0 bg-gradient-to-r ${bgGradient} opacity-90 mix-blend-multiply`}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                            </div>

                            <div className="absolute top-2 right-2">
                                <div className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 ${isTop3 ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400 border border-gray-600'}`}>
                                    {isTop3 && <Trophy size={10} fill="black"/>}
                                    RANK #{rank}
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h3 className="font-bold text-lg text-white leading-tight mb-1">{forum.title}</h3>
                                        <p className="text-[10px] text-gray-300 opacity-80">{forum.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-neon-green font-mono font-black text-lg drop-shadow-md">{forum.pot.toLocaleString()} PZC</div>
                                        <div className="text-[9px] text-gray-400 flex items-center justify-end gap-1"><Users size={8}/> {forum.memberCount}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
