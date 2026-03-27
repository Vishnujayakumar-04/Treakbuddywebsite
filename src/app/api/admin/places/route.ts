import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/server/firebaseAdmin";
import { requireAdmin } from "@/lib/server/adminGuard";

const COL = "adminPlaces";

export async function GET(req: Request) {
  try {
    await requireAdmin(req);
    const snap = await getAdminDb().collection(COL).orderBy("createdAt", "desc").get();
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json(data);
  } catch (e: any) {
    const msg = String(e?.message || e);
    const status = msg.toLowerCase().includes("forbidden") ? 403 : 401;
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin(req);
    const body = await req.json();

    // Minimal validation — the admin UI should enforce stricter checks client-side too.
    if (!body?.name || !body?.description || !body?.category || !body?.location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const now = new Date();
    const ref = await getAdminDb().collection(COL).add({
      ...body,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ id: ref.id }, { status: 201 });
  } catch (e: any) {
    const msg = String(e?.message || e);
    const status =
      msg.toLowerCase().includes("missing authorization") ? 401 :
        msg.toLowerCase().includes("forbidden") ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

