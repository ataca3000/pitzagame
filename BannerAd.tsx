
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export const BannerAd: React.FC = () => {
  const [visible, setVisible] = useState(true);
  
  // [CONFIGURACION DE CUENTA] PASO 2: ACTIVAR ANUNCIOS REALES
  // Cambia esto a 'true' cuando hayas configurado index.html y tengas tus IDs.
  const isRealAd = false; 

  // [CONFIGURACION DE CUENTA] PASO 3: ID DEL BLOQUE DE ANUNCIOS
  // Pega aquí tu 'data-ad-slot' de Google AdSense.
  const AD_SLOT_ID = "XXXXXXXXXX"; 
  const AD_CLIENT_ID = "ca-pub-XXXXXXXXXXXXXXXX"; // Debe coincidir con index.html

  // Este efecto intenta cargar los anuncios de Google si el script está presente
  useEffect(() => {
    if (isRealAd) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error", e);
      }
    }
  }, [isRealAd]);

  if (!visible) return null;

  return (
    <div className="w-full bg-gradient-to-r from-gray-900 to-black border-t border-b border-neon-cyan/20 flex items-center justify-center px-4 relative overflow-hidden my-4 rounded-lg min-h-[90px]">
      
      {/* Botón de cerrar (Solo permitido en mocks, AdSense no permite botones de cierre superpuestos propios) */}
      {!isRealAd && (
        <button 
          onClick={() => setVisible(false)}
          className="absolute top-1 right-1 z-20 text-gray-500 hover:text-white transition-colors bg-black/50 rounded-full p-1"
        >
          <X size={12} />
        </button>
      )}

      {isRealAd ? (
        /* ================================================================== 
           AREA DE ANUNCIO REAL (GOOGLE ADSENSE)
           ================================================================== */
        <div className="w-full text-center">
             <ins className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={AD_CLIENT_ID}
                data-ad-slot={AD_SLOT_ID}
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
        </div>
      ) : (
        /* ================================================================== 
           ANUNCIO SIMULADO (MOCK)
           Esto es lo que se muestra hasta que configures AdSense
           ================================================================== */
        <>
            <div className="absolute inset-0 bg-neon-pink/5 animate-pulse"></div>
            <div className="z-10 flex items-center gap-4 w-full justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-yellow-500 text-black text-[10px] font-bold px-1 rounded shadow-lg shadow-yellow-500/50">AD</div>
                    <div className="flex flex-col">
                        <p className="text-gray-200 text-xs md:text-sm font-bold font-display">
                        <span className="text-neon-cyan">Hyperspace VPN</span>
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono">Navega anónimamente a velocidad luz.</p>
                    </div>
                </div>
                <button className="bg-white text-black text-[10px] font-bold px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors">
                    INSTALAR
                </button>
            </div>
        </>
      )}
    </div>
  );
};
