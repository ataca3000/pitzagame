
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp, updateDoc, increment } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { UserState, UserProfile } from "../types";

// Recuperar estado desde la nube (Login)
export const getUserStateFromFireStore = async (userId: string): Promise<UserState | null> => {
    if (!db) return null;
    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as UserState;
        }
        return null;
    } catch (e) {
        console.error("[CLOUD] Error recuperando datos:", e);
        return null;
    }
};

// Guardar estado en la nube (Auto-Save)
export const saveUserStateToFireStore = async (userId: string, state: UserState) => {
    if (!db) return;
    try {
        const docRef = doc(db, "users", userId);
        await setDoc(docRef, state, { merge: true });
    } catch (e) {
        console.error("[CLOUD] Error guardando datos:", e);
    }
};

// --- NUEVO: REGISTRAR SOLICITUD DE PAGO ---
export const createPayoutRequest = async (userId: string, email: string, amount: number) => {
    if (!db) return false;
    try {
        await addDoc(collection(db, "payout_requests"), {
            userId,
            email,
            amount,
            status: "PENDING",
            createdAt: serverTimestamp(),
            method: "Amazon/Google Play Gift Card"
        });
        return true;
    } catch (e) {
        console.error("[CLOUD] Error creando solicitud de pago:", e);
        return false;
    }
};

// --- NUEVO: LÓGICA DE REFERIDOS ---
export const applyReferralCode = async (targetUserId: string, referralCode: string) => {
    if (!db || !referralCode) return { success: false, message: "Código inválido" };
    
    try {
        // En este sistema el referralCode es el UID del usuario que invita
        const inviterRef = doc(db, "users", referralCode);
        const inviterSnap = await getDoc(inviterRef);

        if (!inviterSnap.exists()) {
            return { success: false, message: "El código de referido no existe." };
        }

        // Premiar al invitado (usuario actual)
        const bonusAmount = 5.00; // 5 PZC de regalo
        
        // El usuario que invita gana 2 PZC y aumenta su contador
        await updateDoc(inviterRef, {
            balance: increment(2.00),
            referralCount: increment(1)
        });

        return { success: true, bonus: bonusAmount };
    } catch (e) {
        return { success: false, message: "Error de red." };
    }
};
