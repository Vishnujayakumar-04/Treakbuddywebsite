import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/server/firebaseAdmin";
import { requireAdmin } from "@/lib/server/adminGuard";

const COL = "events";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(_req);
    const { id } = await ctx.params;
    const snap = await getAdminDb().collection(COL).doc(id).get();
    if (!snap.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ id: snap.id, ...snap.data() });
  } catch (e: any) {
    const msg = String(e?.message || e);
    const status = msg.toLowerCase().includes("forbidden") ? 403 : 401;
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(req);
    const { id } = await ctx.params;
    const body = await req.json();
    const now = new Date();
    await getAdminDb().collection(COL).doc(id).set({ ...body, updatedAt: now }, { merge: true });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    const msg = String(e?.message || e);
    const status =
      msg.toLowerCase().includes("missing authorization") ? 401 :
        msg.toLowerCase().includes("forbidden") ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(_req);
    const { id } = await ctx.params;
    await getAdminDb().collection(COL).doc(id).delete();
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    const msg = String(e?.message || e);
    const status =
      msg.toLowerCase().includes("missing authorization") ? 401 :
        msg.toLowerCase().includes("forbidden") ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

