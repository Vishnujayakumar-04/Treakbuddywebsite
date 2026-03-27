import "server-only";

import { getAdminAuth, getAdminDb } from "@/lib/server/firebaseAdmin";

export type AdminRole = "admin" | "superadmin";

export type AdminPrincipal = {
  uid: string;
  role: AdminRole;
  email?: string;
};

function getBearerToken(req: Request): string | null {
  const raw = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!raw) return null;
  const m = raw.match(/^Bearer\s+(.+)$/i);
  return m?.[1] ?? null;
}

export async function requireAdmin(req: Request): Promise<AdminPrincipal> {
  const token = getBearerToken(req);
  if (!token) throw new Error("Missing Authorization bearer token");

  const decoded = await getAdminAuth().verifyIdToken(token);

  const userSnap = await getAdminDb().collection("users").doc(decoded.uid).get();
  const role = userSnap.get("role");

  if (role !== "admin" && role !== "superadmin") {
    throw new Error("Forbidden: admin role required");
  }

  return {
    uid: decoded.uid,
    role,
    email: decoded.email,
  };
}

