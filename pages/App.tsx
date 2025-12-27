
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { Earn } from './Earn';
import { NewsFeed } from './NewsFeed';
import { AIStudio } from './AIStudio';
import { Arena } from './Arena';
import { Login } from './Login';
import { AdsManager } from './AdsManager';
import { SeasonPass } from './SeasonPass';
import { Forums } from './Forums';
import { ProfileSettings } from './ProfileSettings';
import { Onboarding } from '../components/Onboarding';
import { InterstitialAd } from '../components/InterstitialAd';
import { UserState, UserProfile, ActiveTournamentState } from '../types';
import { LayoutGrid, Rocket, Newspaper, LogOut, Wand2, Gamepad2, MessageSquare, Crown, Briefcase, Sparkles, Zap, User, WifiOff, Globe, Wifi } from 'lucide-react';
import { getRandomAvatar } from '../services/auth';
import { auth, isFirebaseConfigured } from '../services/firebaseConfig';
import { onAuthStateChanged } from "firebase/auth";
import { getUserStateFromFireStore } from '../services/userService';

const GlobalClickEffect = () => {
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const p = document.createElement('div');
            p.className = 'click-particle';
            p.style.left = `${e.clientX}px`;
            p.style.top = `${e.clientY}px`;
            p.style.background = '#00FFFF';
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 600);
        };
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);
    return null;
};

const DEFAULT_USER_STATE: UserState = {
    balance: 0.00,
    salsaBalance: 0,
    monthlyBonus: 0.00,
    lastBonusResetMonth: new Date().getMonth(),
    streak: 1,
    plan: 'FREE',
    isPro: false,
    backgroundMode: false,
    runnerModeEnabled: false,
    referralCount: 0,
    lifetimePro: false,
    unlockedNfts: [],
    inventoryCards: [],
    subscriptions: [],
    isCreator: false,
    is18Verified: false,
    theme: 'DEFAULT',
    language: 'ES',
    notificationsEnabled: true,
    tasksCompleted: 0,
    seasonLevel: 1,
    seasonXp: 0,
    hasSeasonPass: false,
    myAds: [],
    chatHistory: [],
    joinedForums: [],
    adsWatchedToday: 0,
    lastAdWatchTimestamp: 0,
    ledger: [],
    friends: [],
    blockedUsers: [],
    chatMode: 'GLOBAL',
    is2FAEnabled: false,
    twoFactorMethod: 'EMAIL'
};

const MacDock = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const links = [
        { path: '/', label: 'INICIO', icon: LayoutGrid, color: 'text-neon-cyan' },
        { path: '/earn', label: 'GANAR', icon: Rocket, color: 'text-gray-400' },
        { path: '/arena', label: 'JUGAR', icon: Gamepad2, color: 'text-gray-400' },
        { path: '/forums', label: 'FOROS', icon: MessageSquare, color: 'text-gray-400' },
        { path: '/season', label: 'PREMIUM', icon: Crown, color: 'text-gray-400' },
        { path: '/studio', label: 'IA LAB', icon: Wand2, color: 'text-gray-400' },
        { path: '/feed', label: 'NOTICIAS', icon: Newspaper, color: 'text-gray-400' },
        { path: '/ads', label: 'NEGOCIO', icon: Briefcase, color: 'text-gray-400' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] pb-2 px-1">
            <div className="bg-[#0b141a]/95 backdrop-blur-3xl border-t border-white/10 flex items-center justify-between px-2 py-3 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
                {links.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <button 
                            key={link.path}
                            onClick={() => { navigate(link.path); if(navigator.vibrate) navigator.vibrate(5); }} 
                            className={`flex flex-col items-center justify-center flex-1 gap-1 transition-all duration-300 ${isActive ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
                        >
                            <div className={`p-1.5 rounded-xl ${isActive ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-gray-400'}`}>
                                <link.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-tighter ${isActive ? 'text-white' : 'text-gray-600'}`}>
                                {link.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showGlobalAd, setShowGlobalAd] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const navigate = useNavigate();

  // Gestión de estado Online/Offline
  useEffect(() => {
    const handleOnline = () => {
        setIsOnline(true);
        if (navigator.vibrate) navigator.vibrate([10, 50, 10]);
    };
    const handleOffline = () => {
        setIsOnline(false);
        if (navigator.vibrate) navigator.vibrate(50);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const [userState, setUserState] = useState<UserState>(() => {
      const saved = localStorage.getItem('PITZZA_USER_STATE'); 
      if (saved) {
          try {
            const parsed = JSON.parse(saved);
            return parsed;
          } catch(e) {
            return DEFAULT_USER_STATE;
          }
      } 
      return DEFAULT_USER_STATE;
  });

  useEffect(() => {
    localStorage.setItem('PITZZA_USER_STATE', JSON.stringify(userState));
  }, [userState]);

  useEffect(() => {
      if (isFirebaseConfigured) {
          onAuthStateChanged(auth, async (user) => {
              if (user) {
                  setUserProfile({ id: user.uid, name: user.displayName || 'Pilot', email: user.email || '', avatar: user.photoURL || getRandomAvatar(user.uid), plan: 'FREE', provider: 'google' });
                  if (!localStorage.getItem('PITZZA_ONBOARDED')) setShowOnboarding(true);
              }
          });
      }
  }, []);

  const [activeTournament, setActiveTournament] = useState<ActiveTournamentState>({ joinedRoomId: null, isReady: false, gameType: null, isSpectating: false, lives: 3 });

  if (showGlobalAd) {
      return (
          <InterstitialAd 
            onClose={() => {
                setShowGlobalAd(false);
                setUserState(prev => ({ ...prev, balance: prev.balance + 0.05 }));
            }} 
            title="SINCRONIZANDO PLANET PITZZA..." 
          />
      );
  }

  return (
    <div className="min-h-screen bg-[#050B14]">
        <GlobalClickEffect />
        
        {/* INDICADOR DE RED DINÁMICO */}
        <div className={`fixed top-0 left-0 right-0 z-[200] h-6 flex items-center justify-center transition-all duration-500 overflow-hidden ${isOnline ? 'h-0 opacity-0' : 'h-6 bg-red-600 opacity-100 shadow-lg'}`}>
            <div className="flex items-center gap-2">
                <WifiOff size={10} className="text-white animate-pulse" />
                <span className="text-[8px] font-black text-white uppercase tracking-widest">Nexo Desconectado • Modo Offline Activo</span>
            </div>
        </div>

        <Routes>
          <Route path="/login" element={userProfile ? <Navigate to="/" /> : <Login onLogin={setUserProfile} />} />
          <Route path="*" element={
            <div className="min-h-screen font-sans overflow-x-hidden relative text-gray-200">
              {showOnboarding && <Onboarding onComplete={() => { setShowOnboarding(false); localStorage.setItem('PITZZA_ONBOARDED', 'true'); }} />}
              
              <div className="fixed top-8 left-4 right-4 z-[90] flex justify-between items-center pointer-events-none transition-all duration-300">
                  <div className="bg-[#0A1120]/80 backdrop-blur-xl p-2.5 rounded-2xl border border-white/10 pointer-events-auto flex items-center gap-3 shadow-2xl">
                      <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-xl shadow-lg border border-orange-300/30">🍕</div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                            <span className="font-display font-black text-[11px] tracking-tight text-white uppercase leading-none italic">PITZZA<span className="text-neon-cyan">PLANET</span></span>
                            {isOnline ? <Wifi size={10} className="text-neon-green" /> : <WifiOff size={10} className="text-red-500" />}
                        </div>
                        <span className="text-[7px] text-gray-500 font-mono tracking-[0.3em] mt-1 uppercase leading-none">GATEWAY V2.1</span>
                      </div>
                  </div>
                  <div className="flex gap-2 pointer-events-auto">
                      <button onClick={() => navigate('/profile')} className="p-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl text-neon-cyan shadow-xl">
                        <User size={18} />
                      </button>
                      <button onClick={() => auth.signOut().then(() => setUserProfile(null))} className="p-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl text-red-500 shadow-xl">
                        <LogOut size={18} />
                      </button>
                  </div>
              </div>

              <MacDock />
              <main className="relative z-10 pb-20 pt-4">
                <Suspense fallback={null}>
                  <Routes>
                    <Route path="/" element={<Dashboard userState={userState} setUserState={setUserState} userProfile={userProfile} />} />
                    <Route path="/earn" element={<Earn userState={userState} setUserState={setUserState} userProfile={userProfile} />} />
                    <Route path="/arena" element={<Arena userState={userState} setUserState={setUserState} activeTournament={activeTournament} setActiveTournament={setActiveTournament} userProfile={userProfile} />} />
                    <Route path="/forums" element={<Forums userState={userState} setUserState={setUserState} />} />
                    <Route path="/studio" element={<AIStudio userState={userState} setUserState={setUserState} />} />
                    <Route path="/feed" element={<NewsFeed userState={userState} setUserState={setUserState} />} />
                    <Route path="/ads" element={<AdsManager userState={userState} setUserState={setUserState} />} />
                    <Route path="/season" element={<SeasonPass userState={userState} setUserState={setUserState} />} />
                    <Route path="/profile" element={<ProfileSettings userProfile={userProfile} setUserProfile={setUserProfile} userState={userState} setUserState={setUserState} />} />
                  </Routes>
                </Suspense>
              </main>
            </div>
          } />
        </Routes>
    </div>
  );
};

export default App;
