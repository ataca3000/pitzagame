
// ==================================================================================
// 💰 CENTRAL DE COBROS Y MONETIZACIÓN - NEURAL NODE PRO-SAFETY 💰
// ==================================================================================

export const APP_CONFIG = {
  // --------------------------------------------------------------------------------
  // 1. PUBLICIDAD (EL MOTOR DEL DINERO - MAX COMPLIANCE)
  // --------------------------------------------------------------------------------
  ADSENSE_CLIENT_ID: "ca-pub-1708711002405208", 
  ADSENSE_SLOT_ID: "1533951162",                
  ADSENSE_INTERSTITIAL_SLOT_ID: "1533951162",   
  
  ENABLE_REAL_ADS: true, 

  // --------------------------------------------------------------------------------
  // 2. CONFIGURACIÓN DE NAVEGACIÓN (MARGEN PARA GOOGLE)
  // --------------------------------------------------------------------------------
  ADS_PER_NAVIGATION_THRESHOLD: 3, // Mostrar anuncio cada 3 navegaciones
  INTERSTITIAL_MIN_VIEW_TIME: 5,   // Segundos mínimos de vista obligatoria

  // --------------------------------------------------------------------------------
  // 3. IA Y SEGURIDAD
  // --------------------------------------------------------------------------------
  PRODUCTION_MODE: true,
  PAYMENT_GATEWAY_URL: "https://tu-link-de-pago.com",
  GEMINI_API_KEY: process.env.API_KEY || "", 
  OFFICIAL_DOMAIN: "pizza-free-planet.vercel.app", 
};

export const ECONOMY_RULES = {
    // --- REGLA SUSTENTABLE (60/40) ---
    USER_VISIBLE_SPLIT: 0.60, // 60% para el usuario
    USER_VAULT_SPLIT: 0.40,   // 40% Retención de Red (Mantenimiento y Estabilidad)

    // Costos de IA (Equilibrados)
    IMAGE_GENERATION_COST: 8.00, 
    VIDEO_GENERATION_COST: 25.00,
    AVATAR_GENERATION_COST: 12.00, 
    
    // Dificultad
    REQUIRED_TASKS_TO_UNLOCK_VAULT: 75, 
    VAULT_MAX_CAPACITY: 3000.00, 

    // Comisiones
    DEV_COMMISSION_PERCENTAGE: 0.20, // 20% para la casa en juegos
};
