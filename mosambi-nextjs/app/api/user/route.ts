import { NextRequest, NextResponse } from "next/server";
import { ensureUser } from "@/lib/ensureUser";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const ctx = await ensureUser();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const moodImages = await prisma.moodImage.findMany({
    where: { userId: ctx.user.id },
    select: { mood: true }, // don't ship full base64 blobs on every load
  });

  return NextResponse.json({
    user: ctx.user,
    clerkImageUrl: ctx.clerkUser.imageUrl,
    moodsWithImages: moodImages.map((m) => m.mood),
  });
}

export async function PATCH(req: NextRequest) {
  const ctx = await ensureUser();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (typeof body.theme === "string") data.theme = body.theme;
  if (typeof body.mood === "string") data.mood = body.mood;
  if (Array.isArray(body.badges)) data.badges = body.badges;
  if (typeof body.xpDelta === "number") data.xp = { increment: body.xpDelta };

  const user = await prisma.user.update({ where: { id: ctx.user.id }, data });
  return NextResponse.json({ user });
}
