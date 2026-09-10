import admin from 'firebase-admin';
import { env } from './env.js';

let firebaseApp: admin.app.App | null = null;

export function initializeFirebase(): admin.app.App | null {
  if (firebaseApp) return firebaseApp;

  try {
    if (env.FIREBASE_PRIVATE_KEY && env.FIREBASE_CLIENT_EMAIL) {
      const privateKey = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: env.FIREBASE_PROJECT_ID,
          clientEmail: env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
      });
      console.log('🔥 Firebase Admin SDK initialized with Service Certificate');
    } else if (env.FIREBASE_PROJECT_ID) {
      firebaseApp = admin.initializeApp({
        projectId: env.FIREBASE_PROJECT_ID,
      });
      console.log(`🔥 Firebase Project Connected (${env.FIREBASE_PROJECT_ID})`);
    }
  } catch (err) {
    console.warn('⚠️ Firebase Admin notice:', (err as Error).message);
  }

  return firebaseApp;
}

export const getFirebaseAuth = (): admin.auth.Auth | null => {
  const app = initializeFirebase();
  return app ? admin.auth(app) : null;
};
