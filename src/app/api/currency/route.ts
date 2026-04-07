import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from') || 'INR';

  try {
    const res = await fetch(`https://api.frankfurter.app/latest?from=${from}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 }, // Cache for 1 hour on server
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Frankfurter API returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Currency API Route] Fetch failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rates from upstream' },
      { status: 502 }
    );
  }
}
