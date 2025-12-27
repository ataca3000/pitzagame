
import { UserProfile } from '../types';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "./firebaseConfig";

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
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
};

export const registerWithEmail = async (email: string, pass: string): Promise<UserProfile> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const randomId = Math.random().toString(36).substr(2, 9);
            resolve({
                id: `u_${randomId}`,
                name: email.split('@')[0], 
                email: email,
                avatar: getRandomAvatar(randomId),
                originalAvatar: getRandomAvatar(randomId),
                plan: 'FREE',
                provider: 'email'
            });
        }, 1500);
    });
};

export const loginWithEmail = async (email: string, pass: string): Promise<UserProfile> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (pass.length < 6) {
                reject(new Error("Contraseña incorrecta"));
            } else {
                const randomId = Math.random().toString(36).substr(2, 9);
                resolve({
                    id: `u_${randomId}`,
                    name: email.split('@')[0],
                    email: email,
                    avatar: getRandomAvatar(randomId),
                    originalAvatar: getRandomAvatar(randomId),
                    plan: 'FREE',
                    provider: 'email'
                });
            }
        }, 1500);
    });
};

export const mockSignIn = async (provider: 'google' | 'facebook' | 'email'): Promise<UserProfile> => {
  if (provider === 'google' && isFirebaseConfigured) {
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
          console.warn("Firebase Auth fallido.", error);
      }
  }

  return new Promise((resolve) => {
    const randomId = Math.random().toString(36).substr(2, 9);
    const mockAvatar = getRandomAvatar(randomId);
    setTimeout(() => {
      resolve({
        id: `user_${randomId}`,
        name: getRandomName(),
        email: `pilot_${randomId}@neuralnode.net`,
        avatar: mockAvatar,
        originalAvatar: mockAvatar,
        plan: 'FREE',
        provider: provider
      });
    }, 1500);
  });
};

export const PRIVACY_POLICY_TEXT = `
**POLÍTICA DE PRIVACIDAD Y TÉRMINOS DE SERVICIO**
*NeuralNode Ecosystem - Versión Final de Seguridad (2025)*

**1. RECOPILACIÓN DE INFORMACIÓN**
Recopilamos información limitada necesaria para el funcionamiento del servicio: Identificadores de dispositivo, datos de autenticación (correo electrónico) y métricas de rendimiento del "nodo" simulado. No recopilamos datos personales sensibles sin consentimiento explícito.

**2. USO DE PUBLICIDAD (ADMOB COMPLIANCE)**
NeuralNode utiliza Google AdMob para la monetización. Los anuncios son claramente identificados como tales. Queda prohibida cualquier interacción fraudulenta o incentivada forzada. La moneda del juego (U) se otorga por la visualización voluntaria de anuncios en video.

**3. CENSURA Y NORMAS DE CONDUCTA**
Mantenemos una política de TOLERANCIA CERO ante:
- Discurso de odio, racismo o discriminación.
- Contenido sexual explícito o pornografía.
- Promoción de actividades ilegales o violencia.
Cualquier infracción resultará en la eliminación permanente de la cuenta sin derecho a reembolso de activos virtuales.

**4. ELIMINACIÓN DE DATOS**
Los usuarios pueden solicitar la eliminación total de su información a través del menú de "Borrado de Datos" en la aplicación o mediante correo electrónico.

**5. NATURALEZA DEL SOFTWARE**
NeuralNode es una aplicación de simulación y entretenimiento. Los términos "Minería", "Nodo" y "Carga" son elementos narrativos y mecánicas de juego. Los activos digitales dentro de la app no tienen valor en moneda fiduciaria real fuera del ecosistema NeuralNode.
`;
