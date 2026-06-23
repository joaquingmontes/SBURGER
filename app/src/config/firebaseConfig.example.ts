/**
 * Plantilla de configuración Firebase Web.
 * Copiá este archivo como firebaseConfig.ts y completá con tus valores
 * desde Firebase Console → Project settings → Your apps → Web app.
 */
export const firebaseConfig = {
  apiKey: 'REEMPLAZAR_CON_TU_API_KEY',
  authDomain: 'sburger-a3265.firebaseapp.com',
  projectId: 'sburger-a3265',
  storageBucket: 'sburger-a3265.firebasestorage.app',
  messagingSenderId: 'REEMPLAZAR_CON_TU_SENDER_ID',
  appId: 'REEMPLAZAR_CON_TU_APP_ID',
};

export const isFirebaseConfigured = (): boolean =>
  !firebaseConfig.apiKey.startsWith('REEMPLAZAR');
