import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore/lite'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Sin configuración en .env.local el portal usa la orden de demostración
export const db = config.apiKey && config.projectId ? getFirestore(initializeApp(config)) : null
