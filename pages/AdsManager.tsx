
import React, { useState, useEffect } from 'react';
import { UserState, UserAd } from '../types';
import { Megaphone, DollarSign, Eye, MousePointer, Plus, AlertTriangle, CheckCircle, BarChart, X, Globe, Layout, ShieldCheck, Zap, Radio, Briefcase, TrendingUp, Info, Image as ImageIcon, Link as LinkIcon, FileText, Rocket, Trash2, Target, CreditCard, Lock, Trophy, AlertCircle } from 'lucide-react';
import { createTransaction, getLatestHash } from '../services/ledgerService';

interface AdsManagerProps {
  userState: UserState;
  setUserState: React.Dispatch<React.SetStateAction<UserState>>;
}

interface FormErrors {
    title?: string;
    description?: string;
    targetUrl?: string;
    imageUrl?: string;
}

export const AdsManager: React.FC<AdsManagerProps> = ({ userState, setUserState }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAd, setNewAd] = useState({
    title: '',
    description: '',
    imageUrl: '',
    targetUrl: '',
    impressionsPack: 1000 
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const COST_PER_1K = 100.00; 

  useEffect(() => {
      const interval = setInterval(() => {
          setUserState(prev => {
              if (!prev.myAds || prev.myAds.length === 0) return prev;
              const updatedAds = prev.myAds.map(ad => {
                  if (ad.status !== 'ACTIVE' || ad.spent >= ad.budget) return ad;
                  
                  const newImpressions = ad.impressions + Math.floor(Math.random() * 5);
                  const clickChance = Math.random();
                  const newClicks = ad.clicks + (clickChance > 0.97 ? 1 : 0);
                  const addedImpressions = newImpressions - ad.impressions;
                  const costIncurred = (addedImpressions / 1000) * ad.cpm;
                  
                  let newSpent = ad.spent + costIncurred;
                  let newStatus: UserAd['status'] = ad.status;
                  
                  if (newSpent >= ad.budget) {
                      newSpent = ad.budget;
                      newStatus = 'COMPLETED';
                  }

                  return { ...ad, impressions: newImpressions, clicks: newClicks, spent: newSpent, status: newStatus };
              });
              if (JSON.stringify(updatedAds) === JSON.stringify(prev.myAds)) return prev;
              return { ...prev, myAds: updatedAds };
          });
      }, 3000); 
      return () => clearInterval(interval);
  }, [setUserState]);

  const validateUrl = (url: string) => {
      const pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      return pattern.test(url);
  };

  const handleCreateAd = async () => {
    const errors: FormErrors = {};
    let isValid = true;

    if (!newAd.title.trim()) { errors.title = "El título es obligatorio."; isValid = false; } 
    else if (newAd.title.length < 5) { errors.title = "El título debe tener al menos 5 caracteres."; isValid = false; }
    
    if (!newAd.description.trim()) { errors.description = "La descripción es obligatoria."; isValid = false; }
    
    if (!newAd.targetUrl.trim()) { errors.targetUrl = "El enlace de destino es obligatorio."; isValid = false; }
    else if (!validateUrl(newAd.targetUrl)) { errors.targetUrl = "Formato de URL inválido."; isValid = false; }

    if (newAd.imageUrl.trim() && !validateUrl(newAd.imageUrl)) { errors.imageUrl = "Formato de URL de imagen inválido."; isValid = false; }

    setFormErrors(errors);
    if (!isValid) return;

    const pricePer1k = newAd.impressionsPack >= 10000 ? 90.00 : 100.00;
    const totalCost = (newAd.impressionsPack / 1000) * pricePer1k;

    if (userState.balance < totalCost) {
        alert(`Saldo insuficiente. Requieres ${totalCost.toFixed(2)} PZC.`);
        return;
    }
    
    const ad: UserAd = {
        id: `ad_${Date.now()}`,
        title: newAd.title,
        description: newAd.description,
        imageUrl: newAd.imageUrl || 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=400',
        targetUrl: newAd.targetUrl,
        budget: totalCost,
        spent: 0,
        impressions: 0,
        clicks: 0,
        status: 'ACTIVE',
        cpm: pricePer1k
    };

    const prevHash = getLatestHash(userState.ledger || []);
    const tx = await createTransaction('ITEM_BUY', -totalCost, prevHash, userState.ledger?.length || 0);

    setUserState(prev => ({
        ...prev,
        balance: prev.balance - totalCost,
        myAds: [ad, ...(prev.myAds || [])],
        ledger: [...(prev.ledger || []), tx]
    }));
    setShowCreateModal(false);
    setNewAd({ title: '', description: '', imageUrl: '', targetUrl: '', impressionsPack: 1000 });
    setFormErrors({});
    alert(`¡Campaña Lanzada! "${ad.title}" ahora está visible en el Galaxy Feed.`);
  };

  const handleDeleteAd = (id: string) => {
      if (window.confirm("¿Detener y eliminar esta campaña?")) {
          setUserState(prev => ({
              ...prev,
              myAds: prev.myAds.filter(ad => ad.id !== id)
          }));
      }
  };

  return (
    <div className="pb-24 space-y-6 animate-in fade-in duration-500">
       <div className="flex justify-between items-center">
            <div><h1 className="text-3xl font-display font-black text-white uppercase italic tracking-tighter flex items-center gap-2"><Briefcase className="text-blue-500" size={32} /> Pitzza <span className="text-blue-500">Ads</span></h1><p className="text-gray-400 text-sm font-mono">Circulación Interna de Red</p></div>
            <div className="text-right"><p className="text-[10px] text-gray-500 font-bold uppercase">SALDO DISPONIBLE</p><p className="text-xl font-black text-neon-green">{userState.balance.toFixed(2)} PZC</p></div>
       </div>

       <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-2xl p-6 relative overflow-hidden shadow-xl">
           <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
               <div className="flex items-center gap-2"><Megaphone className="text-neon-cyan" /><h3 className="font-bold text-white">MIS CAMPAÑAS ACTIVAS</h3></div>
               <button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"><Plus size={14}/> NUEVA CAMPAÑA</button>
           </div>
           
           {(!userState.myAds || userState.myAds.length === 0) ? (
               <div className="text-center py-12 border-2 border-dashed border-gray-800 rounded-xl bg-black/30 flex flex-col items-center">
                   <div className="bg-gray-800 p-4 rounded-full mb-3"><Zap className="text-yellow-500" size={32} /></div>
                   <p className="text-white font-bold text-base">Sin campañas activas</p>
                   <p className="text-xs text-gray-400 mt-1 max-w-xs">Promociona tu perfil o contenido dentro de la app usando tus PitzzaCoins ganados.</p>
                   <button onClick={() => setShowCreateModal(true)} className="mt-4 text-blue-400 text-xs font-bold hover:text-white underline">Comenzar ahora</button>
               </div>
           ) : (
               <div className="space-y-4">
                   {userState.myAds.map(ad => {
                       const progress = Math.min((ad.spent / ad.budget) * 100, 100); 
                       const rank = Math.floor((1 - (progress/100)) * 99) + 1; 
                       return (
                           <div key={ad.id} className="bg-surface border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start relative group hover:border-blue-500/30 transition-all">
                               <button onClick={() => handleDeleteAd(ad.id)} className="absolute top-2 right-2 text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 z-10 bg-black/50 p-1 rounded"><Trash2 size={16} /></button>
                               <div className="w-full md:w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-black border border-gray-700 relative">
                                   <img src={ad.imageUrl} alt="Ad Creative" className="w-full h-full object-cover opacity-80" />
                                   <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-[9px] text-white p-1 text-center font-mono truncate px-2">INTERNAL</div>
                               </div>
                               <div className="flex-1 w-full">
                                   <div className="flex justify-between items-start mb-2 pr-8">
                                       <div>
                                           <h4 className="font-bold text-white text-sm flex items-center gap-2">{ad.title} {ad.status === 'COMPLETED' ? <span className="text-[9px] bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded border border-gray-600">FINALIZADA</span> : <span className="text-[9px] bg-green-900/50 text-green-400 px-1.5 py-0.5 rounded border border-green-900">EN RED</span>}</h4>
                                           <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{ad.description}</p>
                                       </div>
                                   </div>
                                   <div className="grid grid-cols-2 gap-2 mb-3">
                                       <div className="bg-black/40 p-2 rounded border border-gray-800 text-center"><div className="text-gray-500 text-[9px] font-bold uppercase flex items-center justify-center gap-1"><Trophy size={10} className="text-yellow-500"/> Ranking</div><div className="text-white font-mono font-bold text-lg">{ad.status === 'COMPLETED' ? '-' : `${rank}/100`}</div></div>
                                       <div className="bg-black/40 p-2 rounded border border-gray-800 text-center"><div className="text-gray-500 text-[9px] font-bold uppercase flex items-center justify-center gap-1"><Eye size={10} className="text-blue-400"/> Impacto</div><div className="text-white font-mono font-bold text-lg">{ad.impressions.toLocaleString()}</div></div>
                                   </div>
                                   <div>
                                       <div className="flex justify-between text-[9px] text-gray-500 mb-1"><span>Progreso de Campaña</span><span>{progress.toFixed(0)}%</span></div>
                                       <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden border border-gray-800"><div className={`h-full transition-all duration-500 ${progress >= 100 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${progress}%` }}></div></div>
                                   </div>
                               </div>
                           </div>
                       );
                   })}
               </div>
           )}
       </div>

       {showCreateModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in zoom-in">
               <div className="bg-surface border border-gray-700 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl overflow-y-auto max-h-[90vh]">
                   <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20}/></button>
                   <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2"><Rocket className="text-blue-500"/> Lanzar Campaña</h3>
                   <p className="text-xs text-gray-400 mb-6">Configura los detalles de tu anuncio. Se mostrará en la red interna de PitzzaPlanet.</p>
                   <div className="space-y-4">
                       <div className="grid grid-cols-1 gap-3">
                           <div><label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Título del Anuncio *</label><div className="relative"><FileText className="absolute left-3 top-2.5 text-gray-600" size={14} /><input type="text" placeholder="Ej: Únete a mi Clan" className={`w-full bg-black border rounded-lg py-2 pl-9 pr-3 text-white text-sm focus:outline-none transition-colors ${formErrors.title ? 'border-red-500' : 'border-gray-700 focus:border-blue-500'}`} value={newAd.title} onChange={e => setNewAd({...newAd, title: e.target.value})} maxLength={40}/>{formErrors.title && <div className="text-red-500 text-[9px] mt-1 flex items-center gap-1"><AlertCircle size={10}/> {formErrors.title}</div>}</div></div>
                           <div><label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Descripción Corta *</label><textarea placeholder="Explica brevemente tu oferta (Max 120 caracteres)" className={`w-full bg-black border rounded-lg p-3 text-white text-sm focus:outline-none resize-none h-20 transition-colors ${formErrors.description ? 'border-red-500' : 'border-gray-700 focus:border-blue-500'}`} value={newAd.description} onChange={e => setNewAd({...newAd, description: e.target.value})} maxLength={120}/>{formErrors.description && <div className="text-red-500 text-[9px] mt-1 flex items-center gap-1"><AlertCircle size={10}/> {formErrors.description}</div>}</div>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                           <div><label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">URL de Destino *</label><div className="relative"><LinkIcon className="absolute left-3 top-2.5 text-gray-600" size={14} /><input type="text" placeholder="https://..." className={`w-full bg-black border rounded-lg py-2 pl-9 pr-3 text-white text-sm focus:outline-none transition-colors ${formErrors.targetUrl ? 'border-red-500' : 'border-gray-700 focus:border-blue-500'}`} value={newAd.targetUrl} onChange={e => setNewAd({...newAd, targetUrl: e.target.value})} />{formErrors.targetUrl && <div className="text-red-500 text-[9px] mt-1 flex items-center gap-1"><AlertCircle size={10}/> {formErrors.targetUrl}</div>}</div></div>
                           <div><label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">URL de Imagen (Opcional)</label><div className="relative"><ImageIcon className="absolute left-3 top-2.5 text-gray-600" size={14} /><input type="text" placeholder="https://imgur.com/..." className={`w-full bg-black border rounded-lg py-2 pl-9 pr-3 text-white text-sm focus:outline-none transition-colors ${formErrors.imageUrl ? 'border-red-500' : 'border-gray-700 focus:border-blue-500'}`} value={newAd.imageUrl} onChange={e => setNewAd({...newAd, imageUrl: e.target.value})} />{formErrors.imageUrl && <div className="text-red-500 text-[9px] mt-1 flex items-center gap-1"><AlertCircle size={10}/> {formErrors.imageUrl}</div>}</div></div>
                       </div>
                       <div className="bg-blue-900/10 p-4 rounded-xl border border-blue-500/30 mt-2">
                           <div className="flex justify-between items-center mb-3"><label className="text-xs text-blue-400 font-bold flex items-center gap-2"><Globe size={14}/> ALCANCE DE LA CAMPAÑA</label><span className="text-xs font-mono text-gray-400">Saldo: {userState.balance.toFixed(2)} PZC</span></div>
                           <select className="w-full bg-black border border-blue-500/50 rounded-lg p-3 text-white text-sm focus:outline-none" value={newAd.impressionsPack} onChange={(e) => setNewAd({...newAd, impressionsPack: parseInt(e.target.value)})}>
                               <option value={1000}>1,000 Impresiones - 100 PZC</option>
                               <option value={5000}>5,000 Impresiones - 500 PZC</option>
                               <option value={10000}>10,000 Impresiones - 900 PZC (Descuento 10%)</option>
                               <option value={50000}>50,000 Impresiones - 4,500 PZC (Pro)</option>
                           </select>
                           <div className="flex justify-between items-center mt-3 text-[10px] text-gray-400"><span className="text-blue-300">Garantía de Circulación Interna</span><span>Costo Total: {((newAd.impressionsPack / 1000) * (newAd.impressionsPack >= 10000 ? 90 : 100)).toFixed(2)} PZC</span></div>
                       </div>
                       <button onClick={handleCreateAd} className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-3.5 rounded-xl mt-2 hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all flex items-center justify-center gap-2"><Zap size={18} fill="white" /> PUBLICAR EN LA RED</button>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};
