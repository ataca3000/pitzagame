
# 🍕 Pitzza Free Planet - MANUAL DE OPERACIONES & RECURSOS

## 🛡️ PROTOCOLO DE SEGURIDAD (ANTI-BAN)
**LEER OBLIGATORIAMENTE ANTES DE SUBIR A GOOGLE PLAY**

Para evitar que suspendan tu cuenta de AdMob o Play Console, sigue estas reglas estrictas:

1.  **NO INCENTIVES CLICS EN BANNERS:**
    *   ❌ Incorrecto: "Haz clic en el anuncio de abajo para ganar 10 monedas." (BAN INMEDIATO).
    *   ✅ Correcto: "Mira este video recompensado para ganar 10 monedas." (PERMITIDO).
    *   Los Banners e Interstitials deben recibir clics solo por interés genuino del usuario.

2.  **NO ES MINERÍA REAL:**
    *   La app debe describirse como "Juego de Simulación" o "Estrategia".
    *   Nunca prometas minería de cripto en segundo plano real (está prohibido por Google).

---

## 💰 ¿DÓNDE CONSIGO LOS LINKS DE APPS PROMOCIONADAS?
En la sección `Misiones` (Earn.tsx), necesitas enlaces reales para que cuando el usuario instale, tú cobres. Regístrate en estas redes **CPA (Cost Per Action)**:

1.  **CPAGrip / OGAds:**
    *   Excelentes para "Instalar App y abrir".
    *   Te dan un "Offer Wall" o enlaces directos.
    *   *Uso:* Pega el enlace que te den en `EXTERNA_GAMES` dentro de `Earn.tsx`.

2.  **Adsterra / Monetag:**
    *   Buenos para "Smart Links" y tráfico directo.

3.  **Impact.com / Partnerize:**
    *   Aquí encuentras campañas oficiales de marcas grandes (Uber, Disney+, etc).

---

## 🎨 RECURSOS DE IMÁGENES Y BANNERS (GRATIS Y LEGALES)
No descargues imágenes de Google Imágenes (tienen Copyright). Usa estos bancos:

*   **Pexels.com** (Fotos futuristas, tecnología).
*   **Unsplash.com** (Texturas cyberpunk, neón).
*   **Freepik.com** (Vectores, iconos de monedas).
*   **DiceBear API** (Avatares generados por código, ya integrado en la app).

---

## 🛠️ PASOS PARA COMPILAR (APK)

1.  Edita `config.ts` y pon tus IDs de AdMob.
2.  Edita `services/firebaseConfig.ts` con tus llaves de Firebase.
3.  Sube el código a un host (Vercel/Netlify).
4.  Usa **PWABuilder.com** para convertir la URL en un archivo `.aab` para Android.
5.  Sube a Google Play Console bajo la categoría: **Entretenimiento / Simulación**.

¡Buena suerte, Piloto! 🚀
