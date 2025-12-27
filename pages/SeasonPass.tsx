
import React, { useState } from 'react';
import { UserState, SeasonLevel } from '../types';
import { processPayment } from '../services/billing';
import { Crown, Lock, Unlock, Star, Gift, CheckCircle, ChevronRight, Zap, Shirt, Rocket, Ghost, Loader2, CreditCard, X, ShieldCheck, Coins, ShoppingBag, ExternalLink, Flame, DollarSign } from 'lucide-react';
import { ECONOMY_RULES } from '../config';
import { createTransaction, getLatestHash } from '../services/ledgerService';

interface SeasonPassProps {
  userState: UserState;
  setUserState: React.Dispatch<React.SetStateAction<UserState>>;
}

const SEASON_COST_PZC = 150.00;

const COIN_PACKS = [
    { id: 'pack_pzc_xs', priceMXN: 39.00, amountPZC: 20, label: 'Starter Pack', bonus: '' }, 
    { id: 'pack_pzc_s', priceMXN: 156.00, amountPZC: 100, label: 'Bolsa Pitzza', bonus: '' }, 
    { id: 'pack_pzc_m', priceMXN: 479.00, amountPZC: 320, label: 'Caja Fuerte', bonus: '+20 PZC EXTRA' }, 
    { id: 'pack_pzc_l', priceMXN: 1599.00, amountPZC: 1100, label: 'Banco Central', bonus: '+100 PZC EXTRA' }, 
];

const SEASON_LEVELS: SeasonLevel[] = [
    { level: 1, freeReward: 'Sticker: Novato', premiumReward: '10 PZC', type: 'CURRENCY_PZC', isClaimed: false },
    { level: 2, freeReward: 'XP Booster 1h', premiumReward: 'Skin: Neon Runner', type: 'SKIN', isClaimed: false },
    { level: 3, freeReward: 'Skin: Bot Básico', premiumReward: '25 PZC', type: 'CURRENCY_PZC', isClaimed: false },
    { level: 4, freeReward: 'Sticker: Pizza', premiumReward: 'Efecto Visual', type: 'ITEM', isClaimed: false },
    { level: 5, freeReward: 'XP Booster 2h', premiumReward: '50 PZC', type: 'CURRENCY_PZC', isClaimed: false },
    { level: 6, freeReward: 'Sticker: Alien', premiumReward: 'Skin: Void Walker', type: 'SKIN_LEGENDARY', isClaimed: false },
    { level: 7, freeReward: 'Caja Común', premiumReward: '75 PZC', type: 'CURRENCY_PZC', isClaimed: false },
    { level: 8, freeReward: 'Sticker: UFO', premiumReward: 'Skin: Cyber Samurai', type: 'SKIN_LEGENDARY', isClaimed: false },
    { level: 9, freeReward: 'Caja Rara', premiumReward: '100 PZC', type: 'CURRENCY_PZC', isClaimed: false },
    { level: 10, freeReward: 'Insignia Épica', premiumReward: 'Skin: Emperador Galáctico', type: 'SKIN_MYTHIC', isClaimed: false },
];

const RedirectPaymentModal = ({ isOpen, onClose, item, price, onSuccess }: { isOpen: boolean, onClose: () => void, item: string, price: number, onSuccess: () => void }) => {
    const [isRedirecting, setIsRedirecting] = useState(false);

    if (!isOpen) return null;

    const handleRedirect = async () => {
        setIsRedirecting(true);
        const result = await processPayment(item, price);
        setIsRedirecting(false);
        if (result.success) {
            onSuccess();
            onClose();
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-surface border border-green-500 rounded-2xl w-full max-w-sm overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.3)] relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20}/></button>
                <div className="p-6 text-center">
                    <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4 border border-green-500">
                        <DollarSign className="text-green-500" size={32} />
                    </div>
                    <h3 className="text-xl font-display font-bold text-white mb-2">TIENDA GLOBAL</h3>
                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                        Adquiriendo <strong>{item}</strong> por <strong>${price.toFixed(2)} MXN</strong>.
                        <br/>
                        <span className="text-[10px] text-gray-500">(Transacción procesada por Google Play)</span>
                    </p>
                    <button onClick={handleRedirect} disabled={isRedirecting} className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-black font-display rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg">
                        {isRedirecting ? (<><Loader2 className="animate-spin" /> CONECTANDO...</>) : (<>PAGAR AHORA <ChevronRight size={16} /></>)}
                    </button>
                    <p className="text-[10px] text-gray-500 mt-4">Tus PitzzaCoins se añadirán al instante.</p>
                </div>
            </div>
        </div>
    );
};

export const SeasonPass: React.FC<SeasonPassProps> = ({ userState, setUserState }) => {
  const currentLevel = userState.seasonLevel || 1;
  const [activeTab, setActiveTab] = useState<'PASS' | 'SHOP'>('SHOP');
  const [showPayment, setShowPayment] = useState(false);
  const [pendingItem, setPendingItem] = useState<{ name: string, price: number, amountPZC: number } | null>(null);
  
  const handleBuyPass = async () => {
      if (userState.balance < SEASON_COST_PZC) {
          const confirm = window.confirm(`Necesitas ${SEASON_COST_PZC} PZC. Tienes ${userState.balance.toFixed(2)}. ¿Ir a la tienda?`);
          if (confirm) setActiveTab('SHOP');
          return;
      }

      const confirm = window.confirm(`¿Activar Pase Premium por ${SEASON_COST_PZC} PZC?`);
      if (confirm) {
          const prevHash = getLatestHash(userState.ledger || []);
          const tx = await createTransaction('ITEM_BUY', -SEASON_COST_PZC, prevHash, userState.ledger?.length || 0);

          setUserState(prev => ({
              ...prev,
              balance: prev.balance - SEASON_COST_PZC,
              hasSeasonPass: true,
              ledger: [...(prev.ledger || []), tx]
          }));
          alert("¡Pase Premium Activado! Disfruta las recompensas exclusivas.");
      }
  };

  const handleBuyPack = (pack: typeof COIN_PACKS[0]) => {
      setPendingItem({ name: `${pack.amountPZC} PZC`, price: pack.priceMXN, amountPZC: pack.amountPZC });
      setShowPayment(true);
  };

  const onPaymentSuccess = async () => {
      if (pendingItem) {
          const prevHash = getLatestHash(userState.ledger || []);
          const tx = await createTransaction('CASHOUT', pendingItem.amountPZC, prevHash, userState.ledger?.length || 0);

          setUserState(prev => ({
              ...prev,
              balance: prev.balance + pendingItem.amountPZC,
              ledger: [...(prev.ledger || []), tx]
          }));
          alert(`¡Compra Exitosa! +${pendingItem.amountPZC} PZC añadidos.`);
      }
  };

  const handleClaim = async (level: number, type: 'FREE' | 'PREMIUM', rewardText: string) => {
      alert(`Recompensa Reclamada: ${rewardText}`);
      if (rewardText.includes('PZC')) {
          const amount = parseInt(rewardText.split(' ')[0]);
          const prevHash = getLatestHash(userState.ledger || []);
          const tx = await createTransaction('AIRDROP', amount, prevHash, userState.ledger?.length || 0);

          setUserState(prev => ({ 
              ...prev, 
              balance: prev.balance + amount,
              ledger: [...(prev.ledger || []), tx]
          }));
      }
  };

  const getRewardIcon = (text: string, type: string) => {
      if (type.includes('SKIN')) return <Shirt size={18} className={type.includes('MYTHIC') ? 'text-neon-pink' : 'text-neon-cyan'} />;
      if (type.includes('CURRENCY_PZC')) return <DollarSign size={18} className="text-green-500" />;
      if (type.includes('ITEM')) return <Zap size={18} className="text-yellow-400" />;
      return <Gift size={18} className="text-gray-400" />;
  };

  return (
    <div className="pb-24 space-y-6">
        <RedirectPaymentModal isOpen={showPayment} onClose={() => setShowPayment(false)} item={pendingItem?.name || ''} price={pendingItem?.price || 0} onSuccess={onPaymentSuccess} />

        <div className="flex justify-end gap-3 px-2">
            <div className="bg-green-900/40 border border-green-500/50 px-3 py-1 rounded-full flex items-center gap-2">
                <DollarSign className="text-green-500" size={16} />
                <span className="font-bold text-white text-sm">{userState.balance.toFixed(2)} PZC</span>
            </div>
        </div>

        <div className="flex bg-gray-900/50 p-1 rounded-xl border border-gray-700 backdrop-blur-sm sticky top-16 z-20">
            <button onClick={() => setActiveTab('SHOP')} className={`flex-1 py-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${activeTab === 'SHOP' ? 'bg-surface text-green-400 shadow-md border border-green-500/30' : 'text-gray-500 hover:text-white'}`}><ShoppingBag size={14} /> TIENDA PZC</button>
            <button onClick={() => setActiveTab('PASS')} className={`flex-1 py-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${activeTab === 'PASS' ? 'bg-surface text-yellow-400 shadow-md border border-yellow-500/30' : 'text-gray-500 hover:text-white'}`}><Crown size={14} /> BATTLE PASS</button>
        </div>

        {activeTab === 'SHOP' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="text-center mb-4">
                    <h2 className="text-2xl font-display font-black text-white">RECARGAR <span className="text-green-500">SALDO</span></h2>
                    <p className="text-xs text-gray-400">Impuestos de Google incluidos.</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {COIN_PACKS.map(pack => (
                        <div key={pack.id} className="bg-surface border border-gray-700 rounded-xl p-4 flex items-center justify-between relative overflow-hidden group hover:border-green-500/50 transition-all shadow-lg">
                            {pack.bonus && (<div className="absolute top-0 right-0 bg-green-600 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-lg z-10 animate-pulse">{pack.bonus}</div>)}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center border border-gray-600 group-hover:border-green-500 transition-colors"><DollarSign className="text-green-500" size={24} /></div>
                                <div><h3 className="font-black text-white text-lg">{pack.amountPZC} PZC</h3><p className="text-xs text-gray-500 font-mono">{pack.label}</p></div>
                            </div>
                            <button onClick={() => handleBuyPack(pack)} className="bg-white text-black font-bold px-6 py-3 rounded-lg text-sm hover:bg-green-500 hover:text-white hover:scale-105 transition-all shadow-lg">${pack.priceMXN}</button>
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-xl text-center"><p className="text-[10px] text-yellow-200">⚠ Las compras de PitzzaCoins son finales. Úsalas para potenciar tus foros, comprar items o participar en torneos.</p></div>
            </div>
        )}

        {activeTab === 'PASS' && (
            <div className="animate-in fade-in slide-in-from-left-4 space-y-6">
                <div className="relative rounded-2xl overflow-hidden border border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-900 to-black z-0"></div>
                    <div className="absolute top-0 right-0 p-4 opacity-20"><Crown size={120} /></div>
                    <div className="relative z-10 p-6">
                        <div className="flex justify-between items-start">
                            <div><div className="inline-flex items-center gap-2 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold mb-2 shadow-lg shadow-yellow-500/20"><Rocket size={12} fill="black" /> SEASON 1: GENESIS</div><h1 className="text-3xl font-display font-black text-white italic">PITZZA PASS</h1></div>
                            <div className="text-right bg-black/40 p-3 rounded-xl border border-yellow-500/30 backdrop-blur-md"><div className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">NIVEL</div><div className="text-4xl font-black text-white">{currentLevel}</div></div>
                        </div>
                        {!userState.hasSeasonPass && (
                            <div className="mt-6 flex flex-col gap-2">
                                <button onClick={handleBuyPass} className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-black font-black font-display text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.4)] transform transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"><Crown size={24} fill="black" /> ACTIVAR ({SEASON_COST_PZC} PZC)</button>
                                {userState.balance < SEASON_COST_PZC && (<p className="text-[10px] text-red-400 text-center font-bold flex items-center justify-center gap-1 cursor-pointer hover:underline" onClick={() => setActiveTab('SHOP')}>Saldo insuficiente. <span className="text-white">Ir a la Tienda</span></p>)}
                            </div>
                        )}
                    </div>
                </div>
                <div className="space-y-3">
                    {SEASON_LEVELS.map((tier) => {
                        const isUnlocked = currentLevel >= tier.level;
                        const canClaimPremium = isUnlocked && userState.hasSeasonPass;
                        return (
                            <div key={tier.level} className="flex gap-2">
                                <div className="flex flex-col items-center justify-center w-12 shrink-0">
                                    <div className={`w-0.5 h-full ${isUnlocked ? 'bg-yellow-500' : 'bg-gray-800'}`}></div>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${isUnlocked ? 'bg-yellow-500 border-yellow-500 text-black' : 'bg-gray-900 border-gray-700 text-gray-500'}`}>{tier.level}</div>
                                    <div className={`w-0.5 h-full ${isUnlocked ? 'bg-yellow-500' : 'bg-gray-800'}`}></div>
                                </div>
                                <div className="flex-1 grid grid-cols-2 gap-2 pb-4">
                                    <div onClick={() => isUnlocked && handleClaim(tier.level, 'FREE', tier.freeReward)} className={`relative p-3 rounded-xl border flex flex-col items-center text-center cursor-pointer transition-all ${isUnlocked ? 'bg-gray-800 border-gray-600 hover:bg-gray-700' : 'bg-black/40 border-gray-800 opacity-50'}`}>
                                        <span className="absolute top-2 left-2 text-[9px] font-bold text-gray-500">GRATIS</span>
                                        <div className="my-2">{getRewardIcon(tier.freeReward, 'ITEM')}</div>
                                        <span className="text-xs font-bold text-white">{tier.freeReward}</span>
                                        {isUnlocked && <div className="absolute top-2 right-2 text-green-500"><CheckCircle size={12}/></div>}
                                    </div>
                                    <div onClick={() => canClaimPremium && handleClaim(tier.level, 'PREMIUM', tier.premiumReward)} className={`relative p-3 rounded-xl border flex flex-col items-center text-center cursor-pointer transition-all overflow-hidden group ${userState.hasSeasonPass ? (isUnlocked ? 'bg-yellow-900/20 border-yellow-500/50 hover:bg-yellow-900/40' : 'bg-black/40 border-gray-800 opacity-50') : 'bg-black/40 border-gray-800'}`}>
                                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent"></div>
                                        <span className="absolute top-2 left-2 text-[9px] font-bold text-yellow-500 flex items-center gap-1"><Crown size={8}/> PREMIUM</span>
                                        {!userState.hasSeasonPass && <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 backdrop-blur-[1px]"><Lock size={16} className="text-gray-400" /></div>}
                                        <div className="relative z-0 mt-2 transform group-hover:scale-110 transition-transform">{getRewardIcon(tier.premiumReward, tier.type)}</div>
                                        <span className={`text-xs font-bold mt-2 ${tier.type?.includes('MYTHIC') ? 'text-neon-pink' : tier.type?.includes('CURRENCY_PZC') ? 'text-green-400' : 'text-yellow-100'}`}>{tier.premiumReward}</span>
                                        {canClaimPremium && <div className="absolute top-2 right-2 text-yellow-500"><Unlock size={12}/></div>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}
    </div>
  );
};
