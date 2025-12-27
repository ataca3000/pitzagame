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
import { Onboarding } from '../components/Onboarding';
import { UserState, UserProfile, ActiveTournamentState } from '../types';
import { LayoutGrid, Rocket, Newspaper, LogOut, Wand2, Gamepad2, Settings, RefreshCw, MessageSquare, Crown, Briefcase, Sparkles, Zap } from 'lucide-react';
import { getRandomAvatar } from '../services/auth';
import { isFirebaseConfigured, auth } from '../services/firebaseConfig';
import { validateWalletIntegrity } from '../services/securityService'; 
import { onAuthStateChanged } from "firebase/auth";
import { getUserStateFromFireStore, saveUserStateToFireStore } from '../services/userService';

// --- EFECTO DE CLIC ---
const GlobalClickEffect = () => {
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const p = document.createElement('div');
            p.className = 'click-particle';
            p.style.left = `${e.clientX}px`;
            p.style.top = `${e.clientY}px`;
            if (document.body.classList.contains('theme-girl')) p.style.background = '#FF69B4';
            else p.style.background = '#00FFFF';
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 600);
        };
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);
    return null;
};

// Fixed DEFAULT_USER_STATE to match the UserState interface requirements
// Removed bandwidthSharingEnabled and sharedDataGB as they are not defined in the UserState interface
const DEFAULT_USER_STATE: UserState = {
    balance: 0.00, salsaBalance: 50, monthlyBonus: 0.00, lastBonusResetMonth: new Date().getMonth(), streak: 1, plan: 'FREE', isPro: false, backgroundMode: false, runnerModeEnabled: false, referralCount: 0, lifetimePro: false, unlockedNfts: [], inventoryCards: [], subscriptions: [], isCreator: false, is18Verified: false, theme: 'DEFAULT', language: 'ES', notificationsEnabled: true, tasksCompleted: 0, seasonLevel: 1, seasonXp: 0, hasSeasonPass: false, myAds: [], chatHistory: [], joinedForums: [], adsWatchedToday: 0, lastAdWatchTimestamp: 0, ledger: [], friends: [], blockedUsers: [], chatMode: 'GLOBAL', is2FAEnabled: false, twoFactorMethod: 'EMAIL'
};

const MacDock = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const links = [
        { path: '/', label: 'HOME', icon: LayoutGrid, color: 'text-neon-cyan' },
        { path: '/earn', label: 'EARN', icon: Rocket, color: 'text-neon-green' },
        { path: '/arena', label: 'ARENA', icon: Gamepad2, color: 'text-red-500' },
        { path: '/forums', label: 'FORUMS', icon: MessageSquare, color: 'text-neon-pink' },
        { path: '/season', label: 'PASS', icon: Crown, color: 'text-neon-orange' },
        { path: '/studio', label: 'LAB', icon: Wand2, color: 'text-white' },
        { path: '/feed', label: 'FEED', icon: Newspaper, color: 'text-neon-blue' },
        { path: '/ads', label: 'BIZ', icon: Briefcase, color: 'text-yellow-400' },
    ];
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-4 w-full max-w-md">
            <div className="bg-black/30 backdrop-blur-2xl border border-white/20 rounded-[32px] p-2 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                {links.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <button 
                            key={link.path}
                            onClick={() => { navigate(link.path); if(navigator.vibrate) navigator.vibrate(5); }} 
                            className={`relative p-3.5 rounded-2xl transition-all duration-500 ease-out flex items-center justify-center group ${isActive ? 'bg-white/20 -translate-y-4 scale-125 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'hover:bg-white/10 hover:-translate-y-2'}`}
                        >
                            <link.icon size={22} className={`${link.color} transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                            {isActive && <div className="absolute -bottom-1.5 w-1 h-1 bg-white rounded-full shadow-[0_0_8px_white]"></div>}
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">{link.label}</div>
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const touchStart = useRef({ x: 0, y: 0 });
  const touchEnd = useRef({ x: 0, y: 0 });

  const [userState, setUserState] = useState<UserState>(() => {
      const saved = localStorage.getItem('PITZZA_USER_STATE'); 
      if (saved) {
          const parsed = JSON.parse(saved);
          const integrity = validateWalletIntegrity(parsed);
          return integrity.isValid ? parsed : { ...parsed, balance: integrity.realBalance };
      } 
      return DEFAULT_USER_STATE;
  });

  useEffect(() => {
    if (userState.theme === 'GIRL') document.body.classList.add('theme-girl');
    else document.body.classList.remove('theme-girl');
  }, [userState.theme]);

  useEffect(() => {
      if (isFirebaseConfigured) {
          onAuthStateChanged(auth, async (user) => {
              if (user) {
                  setUserProfile({ id: user.uid, name: user.displayName || 'Pilot', email: user.email || '', avatar: user.photoURL || getRandomAvatar(user.uid), plan: 'FREE', provider: 'google' });
                  const cloud = await getUserStateFromFireStore(user.uid);
                  if (cloud) setUserState(prev => ({ ...prev, ...cloud }));
                  if (!localStorage.getItem('PITZZA_ONBOARDED')) setShowOnboarding(true);
              }
          });
      }
  }, []);

  const [activeTournament, setActiveTournament] = useState<ActiveTournamentState>({ joinedRoomId: null, isReady: false, gameType: null, isSpectating: false, lives: 3 });

  return (
    <div 
        onTouchStart={e => { touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
        onTouchMove={e => { touchEnd.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
        onTouchEnd={() => {
            const deltaY = touchEnd.current.y - touchStart.current.y; 
            if (window.scrollY <= 0 && deltaY > 180) {
                 setIsRefreshing(true);
                 if (navigator.vibrate) navigator.vibrate(20);
                 setTimeout(() => window.location.reload(), 800);
            }
        }}
        className="min-h-screen"
    >
        <GlobalClickEffect />
        <Routes>
          <Route path="/login" element={userProfile ? <Navigate to="/" /> : <Login onLogin={setUserProfile} />} />
          <Route path="*" element={
            <div className="min-h-screen font-sans pb-32 md:pb-0 overflow-x-hidden relative bg-transparent text-gray-200">
              
              {/* LÍNEA DE CARGA NEÓN */}
              <div className={`fixed top-0 left-0 h-[3px] z-[1000] bg-neon-cyan shadow-[0_0_15px_#00ffff] transition-all duration-700 ease-out ${isRefreshing ? 'w-full opacity-100' : 'w-0 opacity-0'}`}></div>

              {/* HEADER SUPERIOR FLOTANTE */}
              <div className="fixed top-4 left-4 right-4 z-[90] flex justify-between items-center pointer-events-none">
                  <div className="bg-black/40 backdrop-blur-xl p-2 rounded-2xl border border-white/10 pointer-events-auto flex items-center gap-3">
                      <div className="w-8 h-8 bg-neon-cyan rounded-full flex items-center justify-center text-black font-black">P</div>
                      <span className="font-display font-black text-[10px] tracking-[0.2em] text-white">PIZZA<span className="text-neon-cyan italic">FREE</span></span>
                  </div>
                  <div className="flex gap-2 pointer-events-auto">
                      <button onClick={() => setUserState(prev => ({...prev, theme: prev.theme === 'GIRL' ? 'DEFAULT' : 'GIRL'}))} className="p-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl text-neon-pink active:scale-90 transition-all">
                        <Sparkles size={18} />
                      </button>
                      <button onClick={() => auth.signOut().then(() => setUserProfile(null))} className="p-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl text-red-500 active:scale-90 transition-all">
                        <LogOut size={18} />
                      </button>
                  </div>
              </div>

              <MacDock />
              <main className="relative z-10">
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