
import { UserCard, UserState } from "../types";
import { APP_CONFIG } from "../config";

// --- INTERNAL SECRET KEY (OBFUSCATED IN BUILD) ---
const GENESIS_SALT = "PITZZA_PLANET_X_AE_A-12_SECURE_HASH_V99";

// --- SHA-256 HASHING FUNCTION ---
async function sha256(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// --- GENERATE SIGNATURE ---
export const signCardData = async (card: Partial<UserCard>): Promise<string> => {
    const payload = `${card.id}:${card.rarity}:${card.stats?.atk}:${card.stats?.def}:${card.originalOwnerId}:${GENESIS_SALT}`;
    return await sha256(payload);
};

// --- VERIFY CARD INTEGRITY ---
export const verifyCardIntegrity = async (card: UserCard): Promise<boolean> => {
    const calculatedSig = await signCardData(card);
    if (calculatedSig !== card.signature) {
        console.error(`[SECURITY] Card forged/tampered detected: ${card.id}`);
        return false;
    }
    return true;
};

// --- MINT NEW CARD ---
export const mintSecureCard = async (baseCard: Omit<UserCard, 'signature' | 'integrityHash' | 'isVerified'>): Promise<UserCard> => {
    const signature = await signCardData(baseCard);
    const integrityHash = await sha256(`BLOCK:${Date.now()}:${signature}`);

    return {
        ...baseCard,
        signature,
        integrityHash,
        isVerified: true
    };
};

// --- DOMAIN LOCK ---
export const checkDomainIntegrity = (): boolean => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return true;
    const officialDomain = APP_CONFIG.OFFICIAL_DOMAIN || '';
    if (!officialDomain) return true;
    if (!window.location.hostname.includes(officialDomain)) return false;
    return true;
};

// --- WALLET INTEGRITY CHECK (ANTI-LEAK) ---
export const validateWalletIntegrity = (state: UserState): { isValid: boolean; realBalance: number } => {
    // New users start clean
    if (!state.ledger || state.ledger.length === 0) {
        // If balance is > 5 without history, it's suspicious (unless it's a legacy user)
        // We'll be lenient for now but strict in production
        return { isValid: true, realBalance: state.balance };
    }

    let calculatedBalance = 0;
    
    // Replay transactions
    state.ledger.forEach(tx => {
        if (tx.status === 'VERIFIED') {
            calculatedBalance += tx.amount;
        }
    });

    // Floating point margin
    const diff = Math.abs(state.balance - calculatedBalance);
    
    if (diff > 0.5) { // Allow 0.5 PZC margin for rounding errors
        console.warn(`[SECURITY ALERT] Wallet Tampering Detected! State: ${state.balance}, Ledger: ${calculatedBalance}`);
        return { isValid: false, realBalance: calculatedBalance };
    }

    return { isValid: true, realBalance: state.balance };
};
