
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './pages/App';

/**
 * Registro robusto de Service Worker con gestión de ciclo de vida.
 */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(registration => {
          console.log('PitzzaPlanet: Service Worker activo. Ámbito:', registration.scope);
          
          // Detectar actualizaciones del Nexo
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    console.log('PitzzaPlanet: Nueva versión disponible. Recarga para actualizar.');
                    // Aquí podrías disparar un evento global o un toast en la UI
                  }
                }
              };
            }
          };
        })
        .catch(error => {
          console.warn('PitzzaPlanet: Fallo en registro de SW.', error);
        });
    });
  }
}

registerServiceWorker();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
