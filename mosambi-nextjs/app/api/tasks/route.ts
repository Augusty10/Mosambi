import { NextRequest, NextResponse } from "next/server";
import { ensureUser } from "@/lib/ensureUser";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const ctx = await ensureUser();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tasks = await prisma.task.findMany({
    where: { userId: ctx.user.id },
    orderBy: [{ date: "desc" }, { time: "desc" }],
  });
  return NextResponse.json({ tasks });
}

export async function POST(req: NextRequest) {
  const ctx = await ensureUser();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, type, date, time } = body;
  if (!title || !type || !date) {
    return NextResponse.json({ error: "title, type and date are required" }, { status: 400 });
  }

  const task = await prisma.task.create({
    data: { userId: ctx.user.id, title, type, date, time: time || null },
  });
  return NextResponse.json({ task });
}
