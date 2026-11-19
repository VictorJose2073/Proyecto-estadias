import { initializeApp } from 'firebase/app'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

function crear() {
  if (!config.apiKey || !config.projectId) return null
  const db = getFirestore(initializeApp(config))
  // Solo en desarrollo: VITE_FIRESTORE_EMULATOR=localhost:8080 usa el emulador local
  const emulador = import.meta.env.DEV && import.meta.env.VITE_FIRESTORE_EMULATOR
  if (emulador) {
    const [host, port] = emulador.split(':')
    connectFirestoreEmulator(db, host, Number(port))
  }
  return db
}

// Sin configuración en .env.local el portal usa la orden de demostración
export const db = crear()
