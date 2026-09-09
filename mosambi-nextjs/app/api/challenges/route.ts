import { NextRequest, NextResponse } from "next/server";
import { ensureUser } from "@/lib/ensureUser";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const ctx = await ensureUser();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const challenges = await prisma.challenge.findMany({
    where: { userId: ctx.user.id },
    include: { checkins: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ challenges });
}

export async function POST(req: NextRequest) {
  const ctx = await ensureUser();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, duration, startDate } = body;
  if (!title || !duration || !startDate) {
    return NextResponse.json({ error: "title, duration and startDate are required" }, { status: 400 });
  }

  const challenge = await prisma.challenge.create({
    data: { userId: ctx.user.id, title, duration: Number(duration), startDate },
    include: { checkins: true },
  });
  return NextResponse.json({ challenge });
}
