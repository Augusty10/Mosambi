import { NextRequest, NextResponse } from "next/server";
import { ensureUser } from "@/lib/ensureUser";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const ctx = await ensureUser();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.challenge.findFirst({ where: { id: params.id, userId: ctx.user.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.challenge.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
