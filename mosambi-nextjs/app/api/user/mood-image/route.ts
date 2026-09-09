import { NextRequest, NextResponse } from "next/server";
import { ensureUser } from "@/lib/ensureUser";
import { prisma } from "@/lib/prisma";

// GET /api/user/mood-image?mood=happy  -> { dataUrl }
export async function GET(req: NextRequest) {
  const ctx = await ensureUser();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const mood = req.nextUrl.searchParams.get("mood");
  if (!mood) return NextResponse.json({ error: "mood is required" }, { status: 400 });

  const img = await prisma.moodImage.findUnique({
    where: { userId_mood: { userId: ctx.user.id, mood } },
  });
  return NextResponse.json({ dataUrl: img?.dataUrl ?? null });
}

// POST { mood, dataUrl } -> upsert
export async function POST(req: NextRequest) {
  const ctx = await ensureUser();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { mood, dataUrl } = await req.json();
  if (!mood || !dataUrl) return NextResponse.json({ error: "mood and dataUrl are required" }, { status: 400 });

  // Guard against oversized payloads (compress client-side before calling this route)
  if (dataUrl.length > 6 * 1024 * 1024) {
    return NextResponse.json({ error: "Image too large" }, { status: 413 });
  }

  await prisma.moodImage.upsert({
    where: { userId_mood: { userId: ctx.user.id, mood } },
    update: { dataUrl },
    create: { userId: ctx.user.id, mood, dataUrl },
  });

  return NextResponse.json({ ok: true });
}
