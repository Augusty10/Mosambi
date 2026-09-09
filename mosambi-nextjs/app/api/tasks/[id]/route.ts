import { NextRequest, NextResponse } from "next/server";
import { ensureUser } from "@/lib/ensureUser";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const ctx = await ensureUser();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.task.findFirst({ where: { id: params.id, userId: ctx.user.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const done = !!body.done;

  const task = await prisma.task.update({
    where: { id: params.id },
    data: { done, completedAt: done ? new Date() : null },
  });

  // Award XP only on the transition to completed
  let xpAwarded = 0;
  if (done && !existing.done) {
    xpAwarded = existing.type === "task" ? 10 : 5;
    let onTime = true;
    if (existing.time) {
      const [h, m] = existing.time.split(":").map(Number);
      const due = new Date(`${existing.date}T00:00:00`);
      due.setHours(h, m, 0, 0);
      onTime = new Date() <= due;
    }
    if (onTime) xpAwarded += 5;

    await prisma.user.update({
      where: { id: ctx.user.id },
      data: { xp: { increment: xpAwarded } },
    });
  }

  return NextResponse.json({ task, xpAwarded });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const ctx = await ensureUser();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.task.findFirst({ where: { id: params.id, userId: ctx.user.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.task.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
