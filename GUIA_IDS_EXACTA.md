
# 🗺️ GUÍA EXACTA DE IDs Y CONFIGURACIÓN

Sigue estos pasos para monetizar. Pega tus IDs en las líneas indicadas.

## 1. PUBLICIDAD (GOOGLE ADSENSE / ADMOB)

**Archivo:** `config.ts` (Línea 9 aprox)
```typescript
  ADSENSE_CLIENT_ID: "ca-pub-0000000000000000", // <--- PEGA TU PUB ID AQUÍ
  ADSENSE_SLOT_ID: "0000000000",                // <--- PEGA TU SLOT ID AQUÍ
  ENABLE_REAL_ADS: true,                        // <--- CAMBIA A 'true'
```

**Archivo:** `index.html` (Línea 103 aprox)
Busca esto al final del archivo antes de `</body>`:
```html
<!-- <script async src="...crossorigin="anonymous"></script> -->
```
Descomenta esa línea (quita `<!--` y `-->`) y asegúrate de que el `client=ca-pub-XXXX` sea el tuyo.

---

## 2. BASE DE DATOS (FIREBASE)

**Archivo:** `services/firebaseConfig.ts` (Línea 15 aprox)
Sustituye todo el bloque `firebaseConfig` con lo que copiaste de la consola de Firebase:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSy...",       // <--- TU API KEY REAL
  authDomain: "...",
  projectId: "...",
  // ... resto de datos
};
```

---

## 3. INTELIGENCIA ARTIFICIAL (GEMINI)

**Archivo:** `.env` (Crear nuevo archivo en la raíz del proyecto)
```env
VITE_API_KEY=AIzaSy...TuClaveGeminiAqui
```

---

## 4. REDES MÓVILES (UNITY / APPLOVIN) - OPCIONAL

Si vas a usar el Panel de Dios en el móvil para guardar estos IDs, no necesitas tocar código.
Si quieres dejarlos fijos en el código:

**Archivo:** `components/BannerAd.tsx` (Línea 15 aprox)
Puedes cambiar la lógica manual si deseas forzar un ID específico en el código:
```typescript
// Ejemplo manual (opcional):
// const unityId = "1234567";
```

## 5. REGLA DE RETIRO (CANDADO 1.5H)

**Archivo:** `config.ts` (Línea 58 aprox)
Aquí ajustas la dificultad para cobrar la bóveda:
```typescript
    REQUIRED_TASKS_TO_UNLOCK_VAULT: 60, // <--- Cantidad de videos/tareas necesarias para cobrar.
```
