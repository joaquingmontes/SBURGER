/**
 * Crea cuentas en Firebase Authentication para los usuarios ya cargados en Data Connect.
 *
 * Requisitos:
 * 1. Email/Password habilitado en Firebase Console → Authentication → Sign-in method
 * 2. Credenciales de admin (una de estas opciones):
 *    - Variable FIREBASE_SERVICE_ACCOUNT con ruta a un service account JSON
 *    - Variable GOOGLE_APPLICATION_CREDENTIALS apuntando a un service account JSON
 *    - O haber corrido: gcloud auth application-default login
 *
 * Uso:
 *   cd scripts
 *   npm install
 *   node migrate-firebase-auth-users.mjs
 *
 * Después del script, cada usuario debe iniciar sesión una vez en la app.
 * LinkMyAccount vincula automáticamente authUid con su fila en PostgreSQL.
 */

import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const PROJECT_ID = 'sburger-a3265';

/** Usuarios existentes en la tabla Usuario (seed + registros manuales). */
const EXISTING_USERS = [
  { email: 'yamil@gmail.com', password: 'Yamil123!', displayName: 'Yamil Tundis' },
  { email: 'juan.perez@gmail.com', password: 'Juan123!', displayName: 'Juan Pérez' },
  { email: 'maria.lopez@gmail.com', password: 'Maria123!', displayName: 'María López' },
  { email: 'admin@stackburger.com', password: 'Admin123!', displayName: 'Admin StackBurger' },
  { email: 'pepe@gmail.com', password: 'Pepe123!', displayName: 'Pepito' },
  { email: 'julian@gmail.com', password: 'Julian123!', displayName: 'Julian' },
  { email: 'leo@gmail.com', password: 'Leo123!', displayName: 'Leonel' },
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

const ensureAuthUser = async (user) => {
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

let created = 0;
let skipped = 0;
let failed = 0;

for (const user of EXISTING_USERS) {
  try {
    const before = await auth.getUserByEmail(user.email.toLowerCase()).catch(() => null);
    await ensureAuthUser(user);
    if (before) {
      skipped += 1;
    } else {
      created += 1;
    }
  } catch (error) {
    failed += 1;
    console.error(`✗ Error con ${user.email}:`, error.message ?? error);
  }
}

console.log('\n--- Resumen ---');
console.log(`Creados: ${created}`);
console.log(`Ya existían: ${skipped}`);
console.log(`Errores: ${failed}`);
console.log(
  '\nPróximo paso: abrí la app e iniciá sesión con cualquier usuario.\n' +
    'La app vincula authUid automáticamente en el primer login (LinkMyAccount).',
);
