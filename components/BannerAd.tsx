
import React, { useState, useEffect } from 'react';
import { X, Smartphone, AlertTriangle, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { APP_CONFIG } from '../config';

export const BannerAd: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);
  
  const isRealAd = APP_CONFIG.ENABLE_REAL_ADS;

  useEffect(() => {
      if (isRealAd && APP_CONFIG.ADSENSE_CLIENT_ID.includes("00000000")) {
          setConfigError("IDS DE ADSENSE FALTANTES");
      } else {
          setConfigError(null);
      }
  }, [isRealAd]);

  useEffect(() => {
    if (isRealAd && !configError) {
      try {
        // @ts-ignore
        const adsbygoogle = window.adsbygoogle || [];
        adsbygoogle.push({});
      } catch (e) {
        console.error("AdSense error", e);
      }
    }
  }, [isRealAd, configError]);

  if (!visible) return null;

  return (
    <div className="w-full flex flex-col items-center my-6">
      <div className="w-full bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative min-h-[120px] group">
          
          {/* Header de Transparencia (Pro-Google) */}
          <div className="px-4 py-2 bg-black/40 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-1.5 opacity-50">
                  <ShieldCheck size={12} className="text-green-500" />
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Contenido Patrocinado</span>
              </div>
              <div className="flex items-center gap-2">
                  <span className="text-[8px] font-mono text-gray-600">Verificado por NeuralAds</span>
                  <ExternalLink size={10} className="text-gray-600" />
              </div>
          </div>

          <div className="p-4 flex items-center justify-center">
              {configError ? (
                  <div className="flex items-center gap-3 text-red-500/80 animate-pulse">
                      <AlertTriangle size={20} />
                      <p className="text-[10px] font-black uppercase tracking-widest">Error de Configuración de Red</p>
                  </div>
              ) : isRealAd ? (
                <div className="w-full flex justify-center">
                    <ins className="adsbygoogle"
                        style={{ display: 'block', width: '100%', minHeight: '90px' }}
                        data-ad-client={APP_CONFIG.ADSENSE_CLIENT_ID}
                        data-ad-slot={APP_CONFIG.ADSENSE_SLOT_ID}
                        data-ad-format="auto"
                        data-full-width-responsive="true"></ins>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-neon-cyan to-blue-600 rounded-2xl flex items-center justify-center text-black font-black text-xl shadow-lg">?</div>
                        <div>
                            <h4 className="text-white font-black text-sm uppercase italic">Espacio Publicitario</h4>
                            <p className="text-[10px] text-gray-500 font-mono tracking-widest mt-1">Sincronizando con Google Ad Network...</p>
                        </div>
                    </div>
                    <div className="bg-white text-black text-[9px] font-black px-4 py-2 rounded-xl">MOCK_AD</div>
                </div>
              )}
          </div>

          {/* Footer de transparencia */}
          <div className="px-4 py-1.5 bg-black/20 flex justify-center">
              <p className="text-[7px] text-gray-700 font-mono uppercase tracking-[0.3em]">Google AdChoices • Privacy Guaranteed</p>
          </div>
      </div>
    </div>
  );
};
