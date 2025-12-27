
import { UserProfile } from '../types';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebaseConfig";

// --- FUNNY NAME GENERATOR ---
const ADJECTIVES = ['Cosmic', 'Glitchy', 'Neon', 'Hyper', 'Lazy', 'Radioactive', 'Quantum', 'Spicy', 'Turbo', 'Cyber', 'Mega', 'Ultra'];
const NOUNS = ['Potato', 'Ninja', 'Toaster', 'Wizard', 'Hamster', 'Cyborg', 'Pilot', 'Taco', 'Jedi', 'Panda', 'Unicorn', 'Cactus'];
const AVATAR_STYLES = ['bottts', 'pixel-art', 'fun-emoji', 'lorelei', 'adventurer', 'big-smile'];

const getRandomName = () => {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    return `${adj} ${noun}`;
};

export const getRandomAvatar = (seed: string) => {
    const style = AVATAR_STYLES[Math.floor(Math.random() * AVATAR_STYLES.length)];
    // Usa DiceBear API (Servicio seguro y permitido)
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
};

// --- AUTH HANDLERS ---

// 1. Social Login (Google/Facebook)
export const mockSignIn = async (provider: 'google' | 'facebook' | 'email'): Promise<UserProfile> => {
  if (provider === 'google' && auth.config.apiKey && !auth.config.apiKey.includes("TU_API_KEY")) {
      try {
          const result = await signInWithPopup(auth, googleProvider);
          const user = result.user;
          return {
              id: user.uid,
              name: user.displayName || getRandomName(),
              email: user.email || '',
              avatar: user.photoURL || getRandomAvatar(user.uid),
              originalAvatar: user.photoURL || undefined,
              plan: 'FREE',
              provider: 'google'
          };
      } catch (error) {
          console.warn("Firebase Auth cancelado o fallido. Usando modo Demo.", error);
      }
  }

  // Fallback Demo
  return new Promise((resolve) => {
    const randomId = Math.random().toString(36).substr(2, 9);
    const mockAvatar = getRandomAvatar(randomId);
    setTimeout(() => {
      resolve({
        id: `user_${randomId}`,
        name: getRandomName(),
        email: `pilot_${randomId}@pitzza.net`,
        avatar: mockAvatar,
        originalAvatar: mockAvatar,
        plan: 'FREE',
        provider: provider
      });
    }, 1500);
  });
};

// --- POLÍTICA BLINDADA PARA GOOGLE PLAY ---
export const PRIVACY_POLICY_TEXT = `
**POLÍTICA DE PRIVACIDAD Y TÉRMINOS DE USO**
*Última actualización: Febrero 2025*

**1. DESCARGO DE RESPONSABILIDAD (SIMULACIÓN)**
Pitzza Free Planet es una aplicación de entretenimiento y simulación estratégica.
*   **NO ES MINERÍA:** Esta app no utiliza el CPU/GPU de su dispositivo para minar criptomonedas. La "velocidad de red" y el "ancho de banda compartido" son métricas simuladas del juego.
*   **MONEDA VIRTUAL:** Los "PitzzaCoins" (PZC) son puntos de fidelidad virtuales sin valor monetario intrínseco fuera de la plataforma.

**2. RECOPILACIÓN Y USO DE DATOS**
Para brindar el servicio, recopilamos:
*   **Identificadores:** ID de dispositivo, correo electrónico (para login) y datos de perfil público.
*   **Uso de la App:** Interacciones, visualización de anuncios y progreso de juego para mejorar la experiencia.
*   **Publicidad:** Usamos Google AdMob. Google puede recopilar datos para mostrar anuncios personalizados.

**3. PERMISOS DEL DISPOSITIVO**
*   **Internet:** Necesario para conectar con el servidor de juego.
*   **Micrófono (Opcional):** Solo se usa si participas en chats de voz en torneos. No se graba audio en segundo plano.

**4. SEGURIDAD**
Sus datos están protegidos y no se venden a terceros no afiliados. Cumplimos con las normativas de Google Play Developer Program Policies.

**5. BORRADO DE CUENTA**
Puede solicitar la eliminación total de sus datos contactando a soporte o desde el menú de Ajustes dentro de la app.

Al hacer clic en "Aceptar", usted confirma que es mayor de 18 años y acepta estos términos.
`;
