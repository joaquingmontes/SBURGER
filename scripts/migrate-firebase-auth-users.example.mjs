/**
 * Crea cuentas en Firebase Authentication para usuarios de Data Connect.
 *
 * Copiá este archivo como scripts/migrate-firebase-auth-users.mjs
 * y completá PROJECT_ID y EXISTING_USERS con tus datos locales.
 *
 * Requisitos:
 * - Email/Password habilitado en Firebase Console
 * - GOOGLE_APPLICATION_CREDENTIALS o FIREBASE_SERVICE_ACCOUNT
 *
 * Uso:
 *   cd scripts
 *   npm install
 *   node migrate-firebase-auth-users.mjs
 */

import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID ?? 'TU_PROYECTO_FIREBASE';

const EXISTING_USERS = [
  { email: 'cliente1@example.com', password: 'CAMBIAR_PASSWORD', displayName: 'Cliente Uno' },
  { email: 'admin@example.com', password: 'CAMBIAR_PASSWORD', displayName: 'Admin' },
];

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT;

if (serviceAccountPath) {
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: PROJECT_ID,
  });
} else {
  admin.initializeApp({ projectId: PROJECT_ID });
}

const auth = admin.auth();

const ensureAuthUser = async user => {
  const email = user.email.toLowerCase();

  try {
    const existing = await auth.getUserByEmail(email);
    console.log(`✓ Ya existe en Firebase Auth: ${email} (uid: ${existing.uid})`);
    return existing;
  } catch (error) {
    if (error.code !== 'auth/user-not-found') {
      throw error;
    }
  }

  const created = await auth.createUser({
    email,
    password: user.password,
    displayName: user.displayName,
    emailVerified: true,
  });

  console.log(`+ Creado en Firebase Auth: ${email} (uid: ${created.uid})`);
  return created;
};

console.log(`Migrando ${EXISTING_USERS.length} usuarios a Firebase Auth (${PROJECT_ID})...\n`);

for (const user of EXISTING_USERS) {
  try {
    await ensureAuthUser(user);
  } catch (error) {
    console.error(`✗ Error con ${user.email}:`, error.message ?? error);
  }
}
