import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/server/firebaseAdmin";
import { requireAdmin } from "@/lib/server/adminGuard";

const PLACES_COL = "adminPlaces";
const CATEGORIES_COL = "adminCategories";
const TRANSIT_COL = "transit";
const EVENTS_COL = "events";

export async function GET(req: Request) {
  try {
    await requireAdmin(req);

    const [placesSnap, categoriesSnap, eventsSnap, transitSnap, featuredSnap, recentSnap] =
      await Promise.all([
        getAdminDb().collection(PLACES_COL).get(),
        getAdminDb().collection(CATEGORIES_COL).get(),
        getAdminDb().collection(EVENTS_COL).get(),
        getAdminDb().collection(TRANSIT_COL).get(),
        getAdminDb().collection(PLACES_COL).where("isFeatured", "==", true).get(),
        getAdminDb().collection(PLACES_COL).orderBy("createdAt", "desc").limit(5).get(),
      ]);

    const recentPlaces = recentSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return NextResponse.json({
      totalPlaces: placesSnap.size,
      totalCategories: categoriesSnap.size,
      totalEvents: eventsSnap.size,
      totalTransit: transitSnap.size,
      featuredPlaces: featuredSnap.size,
      recentPlaces,
    });
  } catch (e: any) {
    const msg = String(e?.message || e);
    const status = msg.toLowerCase().includes("forbidden") ? 403 : 401;
    return NextResponse.json({ error: msg }, { status });
  }
}

