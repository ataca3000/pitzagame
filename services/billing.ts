
import { APP_CONFIG } from '../config';

export const processPayment = async (productId: string, price: number): Promise<{ success: boolean }> => {
    console.log(`Iniciando Pasarela de Pago Externa para ${productId}`);
    
    // Obtener el link genérico o específico
    const gatewayUrl = APP_CONFIG.PAYMENT_GATEWAY_URL;

    if (gatewayUrl && gatewayUrl.startsWith('http')) {
        // Redirigir al usuario
        window.open(gatewayUrl, '_blank');
        
        // Retornamos éxito simulado (esperando que el usuario complete allá)
        // En un sistema real, usaríamos webhooks.
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 1000);
        });
    }

    // Fallback si no hay link
    console.warn("No hay link de pago configurado.");
    alert("Error de conexión con la pasarela externa. Contacta soporte.");
    return { success: false };
};

export const restorePurchases = async (): Promise<string[]> => {
    return [];
};
