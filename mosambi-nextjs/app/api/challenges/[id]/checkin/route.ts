import { NextRequest, NextResponse } from "next/server";
import { ensureUser } from "@/lib/ensureUser";
import { prisma } from "@/lib/prisma";

function todayKey() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const ctx = await ensureUser();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const challenge = await prisma.challenge.findFirst({
    where: { id: params.id, userId: ctx.user.id },
    include: { checkins: true },
  });
  if (!challenge) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const key = todayKey();
  const already = challenge.checkins.some((c) => c.date === key);
  if (already || challenge.checkins.length >= challenge.duration) {
    return NextResponse.json({ error: "Already checked in or completed" }, { status: 400 });
  }

  const checkin = await prisma.challengeCheckin.create({
    data: { challengeId: challenge.id, date: key },
  });

  const xpAwarded = 25;
  await prisma.user.update({ where: { id: ctx.user.id }, data: { xp: { increment: xpAwarded } } });

  return NextResponse.json({ checkin, xpAwarded });
}
