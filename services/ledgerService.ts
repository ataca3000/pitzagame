
import { LedgerTransaction } from "../types";

// --- PITZZA CHAIN VALIDATOR ---
// Simulamos una cadena de bloques interna. 
// Cada transacción depende del hash anterior para garantizar integridad visual.

const GENESIS_HASH = "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f";

async function sha256(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const createTransaction = async (
    type: LedgerTransaction['type'],
    amount: number,
    previousHash: string = GENESIS_HASH,
    blockIndex: number
): Promise<LedgerTransaction> => {
    const timestamp = Date.now();
    const id = `tx_${timestamp}_${Math.random().toString(36).substring(2, 9)}`;
    
    // El payload incluye el hash anterior, creando una "cadena"
    const payload = `${previousHash}:${type}:${amount.toFixed(8)}:${timestamp}:${id}`;
    const hash = await sha256(payload);

    return {
        id,
        type,
        amount,
        timestamp,
        hash,
        blockIndex: blockIndex + 1,
        status: 'VERIFIED'
    };
};

export const getLatestHash = (ledger: LedgerTransaction[]): string => {
    if (ledger.length === 0) return GENESIS_HASH;
    return ledger[ledger.length - 1].hash;
};
