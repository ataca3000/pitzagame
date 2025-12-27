
import React, { useState, useEffect } from 'react';
import { UserState, TournamentRoom, ActiveTournamentState, UserProfile } from '../types';
import { Trophy, Swords, Zap, Loader2, Users, ChevronLeft, Radio, Plus, Flame, DollarSign, Target, Video, Share2, Star } from 'lucide-react';
import { createTransaction, getLatestHash } from '../services/ledgerService';
import { ECONOMY_RULES } from '../config';

interface ArenaProps {
  userState: UserState;
  setUserState: React.Dispatch<React.SetStateAction<UserState>>;
  activeTournament: ActiveTournamentState;
  setActiveTournament: React.Dispatch<React.SetStateAction<ActiveTournamentState>>;
  userProfile: UserProfile | null;
}

const HOUSE_RAKE = ECONOMY_RULES.DEV_COMMISSION_PERCENTAGE; 

const GAMES_CATALOG = [
    { id: 'ff', name: 'FREE FIRE', color: 'text-orange-500', icon: Flame },
    { id: 'cod', name: 'CALL OF DUTY', color: 'text-green-500', icon: Target },
    { id: 'fifa', name: 'EA SPORTS FC', color: 'text-blue-500', icon: Trophy },
    { id: 'ml', name: 'MOBILE LEGENDS', color: 'text-purple-500', icon: Swords },
];

export const Arena: React.FC<ArenaProps> = ({ userState, setUserState, userProfile, setActiveTournament }) => {
  const [viewState, setViewState] = useState<'LOBBY' | 'CREATE_ROOM' | 'SQUAD_ROOM' | 'STREAM_CENTER'>('LOBBY');
  const [selectedGame, setSelectedGame] = useState(GAMES_CATALOG[0]);
  const [entryFee, setEntryFee] = useState(50);
  const [roomName, setRoomName] = useState('');
  const [rooms, setRooms] = useState<TournamentRoom[]>([]);

  useEffect(() => {
    setRooms([
        { id: 101, name: 'SQUAD PRO LATAM', players: 45, spectators: 120, maxPlayers: 50, status: 'WAITING', gameType: 'FREE FIRE', entryFee: 10, isCustom: true },
        { id: 102, name: 'TORNEO DE RELÁMPAGO', players: 2, spectators: 45, maxPlayers: 10, status: 'OPEN', gameType: 'COD MOBILE', entryFee: 25, isCustom: true }
    ]);
  }, []);

  const handleCreateRoom = async () => {
    if (!roomName.trim()) return alert("Ponle un nombre épico a tu sala.");
    if (userState.balance < entryFee) return alert("Falta carga (PZC) para abrir esta sala.");

    const prevHash = getLatestHash(userState.ledger || []);
    const tx = await createTransaction('TOURNAMENT_CREATE', -entryFee, prevHash, userState.ledger?.length || 0);

    setUserState(prev => ({
        ...prev,
        balance: prev.balance - entryFee,
        ledger: [...(prev.ledger || []), tx]
    }));

    setActiveTournament(prev => ({ ...prev, joinedRoomId: Date.now(), gameType: selectedGame.name }));
    setViewState('SQUAD_ROOM');
  };

  const LobbyView = () => (
    <div className="flex flex-col h-full animate-in fade-in duration-700 bg-black">
        <div className="h-[45%] relative overflow-hidden flex flex-col items-center justify-center pt-20">
            <div className="absolute inset-0 bg-gradient-to-b from-orange-600/10 via-black to-black"></div>
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-orange-500/20 to-transparent"></div>
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="absolute -bottom-10 w-64 h-24 bg-orange-500/10 blur-2xl rounded-full"></div>
                <img 
                    src={userProfile?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=pilot'} 
                    className="w-52 h-52 object-contain drop-shadow-[0_0_35px_rgba(255,165,0,0.5)] animate-float"
                    alt="Player Avatar"
                />
                <div className="mt-4 px-6 py-1 bg-black/60 border border-orange-500/40 rounded-full backdrop-blur-xl">
                    <span className="text-white font-black italic text-xs tracking-widest uppercase">
                        {userProfile?.name || 'OPERADOR'} <span className="text-orange-500 ml-2">LVL {userState.seasonLevel}</span>
                    </span>
                </div>
            </div>

            <div className="absolute top-24 right-6 space-y-3 z-20">
                <div className="bg-black/40 p-3 rounded-2xl border border-white/5 text-right backdrop-blur-md">
                    <p className="text-[8px] text-gray-500 font-bold uppercase">Victorias</p>
                    <p className="text-white font-black italic text-lg tracking-tighter">42</p>
                </div>
                <div className="bg-black/40 p-3 rounded-2xl border border-white/5 text-right backdrop-blur-md">
                    <p className="text-[8px] text-gray-500 font-bold uppercase">Racha</p>
                    <p className="text-orange-500 font-black italic text-lg tracking-tighter">x12</p>
                </div>
            </div>
        </div>

        <div className="flex-1 bg-surface/90 backdrop-blur-3xl rounded-t-[50px] border-t border-white/10 p-8 space-y-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-display font-black text-white italic tracking-tighter">SALA DE ESPERA</h2>
                <div className="px-3 py-1 bg-red-600/20 text-red-500 rounded-full text-[9px] font-black border border-red-500/30 animate-pulse flex items-center gap-1">
                    <Radio size={10} /> EN VIVO
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={() => setViewState('CREATE_ROOM')}
                    className="h-32 bg-gradient-to-br from-orange-600 to-red-800 rounded-[35px] relative overflow-hidden group active:scale-95 transition-all shadow-2xl border border-white/20"
                >
                    <Plus className="absolute -right-2 -top-2 text-white/10" size={80} />
                    <div className="p-6 flex flex-col justify-end h-full">
                        <Plus size={24} className="text-white mb-2" />
                        <h3 className="text-white font-black italic text-left leading-none uppercase">Crear<br/>Torneo</h3>
                    </div>
                </button>

                <button 
                    onClick={() => setViewState('STREAM_CENTER')}
                    className="h-32 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[35px] relative overflow-hidden group active:scale-95 transition-all shadow-2xl border border-white/20"
                >
                    <Video className="absolute -right-2 -top-2 text-white/10" size={80} />
                    <div className="p-6 flex flex-col justify-end h-full">
                        <Video size={24} className="text-white mb-2" />
                        <h3 className="text-white font-black italic text-left leading-none uppercase">Streams</h3>
                    </div>
                </button>
            </div>

            <div className="space-y-4 pt-4">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Salas Disponibles</p>
                {rooms.map(room => (
                    <div key={room.id} className="neon-glass p-5 rounded-[25px] flex justify-between items-center group cursor-pointer hover:border-orange-500/50 transition-all active:scale-95">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-orange-500 border border-white/10">
                                <Users size={24} />
                            </div>
                            <div>
                                <h4 className="text-white font-black uppercase text-xs italic">{room.name}</h4>
                                <p className="text-[9px] text-gray-500 font-mono tracking-widest">{room.gameType} • {room.entryFee} PZC</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-white font-black text-sm italic">{room.players}/{room.maxPlayers}</div>
                            <div className="text-[8px] text-green-500 uppercase font-bold tracking-widest">UNIÉNDOSE</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  const CreateRoomView = () => (
    <div className="p-8 pt-24 space-y-8 animate-in slide-in-from-bottom-10 duration-500 h-full overflow-y-auto bg-black text-white">
        <div className="flex items-center gap-4 mb-4">
            <button onClick={() => setViewState('LOBBY')} className="p-3 bg-white/5 rounded-2xl text-white"><ChevronLeft/></button>
            <h2 className="text-3xl font-display font-black text-white italic tracking-tighter">CONFIG SALA</h2>
        </div>

        <div className="space-y-6">
            <div className="neon-glass p-8 rounded-[40px] border border-white/20">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 block">Nombre del Torneo</label>
                <input 
                    type="text" 
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Ej: GRAN FINAL DIAMANTE"
                    className="w-full bg-black/40 border-b-2 border-orange-500 py-4 text-white font-black italic text-xl outline-none focus:border-neon-cyan transition-all"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="neon-glass p-6 rounded-[35px]">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Entrada (PZC)</label>
                    <div className="flex items-center gap-2">
                        <DollarSign size={20} className="text-green-500" />
                        <input 
                            type="number" 
                            value={entryFee}
                            onChange={(e) => setEntryFee(Number(e.target.value))}
                            className="bg-transparent text-white font-black text-2xl w-full outline-none"
                        />
                    </div>
                </div>
                <div className="neon-glass p-6 rounded-[35px] border-l-4 border-l-orange-500">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Tú ganas</label>
                    <div className="text-orange-500 font-black text-2xl uppercase italic">
                        {HOUSE_RAKE * 100}%
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Seleccionar Juego</label>
                <div className="grid grid-cols-2 gap-3">
                    {GAMES_CATALOG.map(game => (
                        <button 
                            key={game.id}
                            onClick={() => setSelectedGame(game)}
                            className={`p-5 rounded-[25px] border transition-all flex flex-col items-center gap-2 ${selectedGame.id === game.id ? 'bg-orange-500 text-black border-white' : 'bg-black/40 text-gray-400 border-white/10'}`}
                        >
                            <game.icon size={24} />
                            <span className="text-[9px] font-black uppercase tracking-tighter">{game.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <button 
                onClick={handleCreateRoom}
                className="w-full py-6 bg-white text-black font-black text-sm uppercase tracking-[0.3em] rounded-[30px] shadow-2xl active:scale-95 transition-all"
            >
                DESPLEGAR SALA
            </button>
        </div>
    </div>
  );

  return (
    <div className="h-screen bg-black text-white fixed inset-0 z-50 overflow-hidden font-sans">
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black to-transparent z-[60] px-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/20 border border-orange-500/40 rounded-xl flex items-center justify-center">
                    <Swords size={20} className="text-orange-500" />
                </div>
                <span className="text-xs font-black italic tracking-widest text-white uppercase">Arena <span className="text-orange-500">Global</span></span>
            </div>
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl">
                <p className="text-orange-500 font-black text-sm italic">{userState.balance.toFixed(2)} PZC</p>
            </div>
        </div>

        {viewState === 'LOBBY' && <LobbyView />}
        {viewState === 'CREATE_ROOM' && <CreateRoomView />}
        
        {viewState === 'SQUAD_ROOM' && (
            <div className="flex flex-col items-center justify-center h-full bg-black p-8 text-center space-y-8 animate-in zoom-in duration-500">
                <div className="relative">
                    <div className="absolute -inset-10 bg-orange-500/10 blur-3xl animate-pulse"></div>
                    <img src={userProfile?.avatar || ''} className="w-48 h-48 relative z-10 drop-shadow-[0_0_20px_#ffa500]" alt="Player Avatar" />
                    <div className="flex gap-2 justify-center mt-6">
                        {[1,2,3].map(i => (
                            <div key={i} className="w-12 h-12 bg-white/5 border border-dashed border-white/20 rounded-xl flex items-center justify-center text-gray-600">
                                <Users size={20} />
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h2 className="text-3xl font-display font-black text-white italic tracking-tighter">{roomName.toUpperCase()}</h2>
                    <p className="text-xs text-orange-500 font-mono animate-pulse mt-2 uppercase">Matchmaking iniciado... (1/4)</p>
                </div>
                <div className="flex gap-4 w-full">
                    <button onClick={() => setViewState('LOBBY')} className="flex-1 py-4 bg-red-600/20 text-red-500 border border-red-500/30 rounded-2xl font-black text-xs uppercase tracking-widest">CANCELAR</button>
                    <button className="flex-[2] py-4 bg-orange-500 text-black rounded-2xl font-black text-xs uppercase tracking-widest">INVITAR ESCUADRA</button>
                </div>
            </div>
        )}
    </div>
  );
};
