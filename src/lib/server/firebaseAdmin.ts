import "server-only";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getEnv(name: string): string | null {
  return process.env[name] || null;
}

function ensureAdminApp(): void {
  if (getApps().length) return;

  // IMPORTANT: do not throw at import-time. Next build may evaluate modules
  // while collecting route data. We only enforce env presence when the admin
  // APIs are actually invoked.
  const projectId = getEnv("FIREBASE_ADMIN_PROJECT_ID");
  const clientEmail = getEnv("FIREBASE_ADMIN_CLIENT_EMAIL");
  const privateKeyRaw = getEnv("FIREBASE_ADMIN_PRIVATE_KEY");

  if (!projectId || !clientEmail || !privateKeyRaw) {
    throw new Error(
      "Firebase Admin env missing. Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY."
    );
  }

  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

export function getAdminAuth() {
  ensureAdminApp();
  return getAuth();
}

export function getAdminDb() {
  ensureAdminApp();
  return getFirestore();
}

