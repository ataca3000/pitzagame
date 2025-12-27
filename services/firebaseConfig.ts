
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// =====================================================================
// 🍕 CONFIGURACIÓN DE FIREBASE (PRODUCCIÓN) 🍕
// =====================================================================

const firebaseConfig = {
  apiKey: "AIzaSyDLc7mtQNRT74F_JWhVql7ujUG7H-7WZtE",
  authDomain: "studio-3564355691-31347.firebaseapp.com",
  projectId: "studio-3564355691-31347",
  storageBucket: "studio-3564355691-31347.firebasestorage.app",
  messagingSenderId: "693335023766",
  appId: "1:693335023766:web:d56dacfdb46a5ea138e2"
};

// ACTIVADO: Indicamos a la app que Firebase está listo para usarse.
export const isFirebaseConfigured = true;

// Inicialización del App
let app;
let authInstance;
let dbInstance;

try {
    app = initializeApp(firebaseConfig);
    authInstance = getAuth(app);
    dbInstance = getFirestore(app);
    console.log("✅ Pizza Free Planet: Firebase Conectado (Mode: Production)");
} catch (e) {
    console.error("❌ Error Crítico de Conexión Firebase:", e);
}

// Exportaciones
export const auth = authInstance; 
export const googleProvider = new GoogleAuthProvider();
export const db = dbInstance;
