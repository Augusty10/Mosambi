import { NextRequest, NextResponse } from "next/server";
import { ensureUser } from "@/lib/ensureUser";
import { prisma } from "@/lib/prisma";

function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [headers.join(",")];
  for (const row of rows) lines.push(headers.map((h) => escape(row[h])).join(","));
  return lines.join("\n");
}

export async function GET(req: NextRequest) {
  const ctx = await ensureUser();
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const format = req.nextUrl.searchParams.get("format") === "csv" ? "csv" : "json";

  const [tasks, challenges] = await Promise.all([
    prisma.task.findMany({ where: { userId: ctx.user.id }, orderBy: { date: "desc" } }),
    prisma.challenge.findMany({
      where: { userId: ctx.user.id },
      include: { checkins: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (format === "json") {
    const body = JSON.stringify({ exportedAt: new Date().toISOString(), tasks, challenges }, null, 2);
    return new NextResponse(body, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="mosambi-export-${Date.now()}.json"`,
      },
    });
  }

  // CSV: two sections combined into one file, task rows then challenge rows
  const taskRows = tasks.map((t) => ({
    kind: "task",
    id: t.id,
    title: t.title,
    type: t.type,
    date: t.date,
    time: t.time ?? "",
    done: t.done,
    completedAt: t.completedAt?.toISOString() ?? "",
  }));
  const challengeRows = challenges.map((c) => ({
    kind: "challenge",
    id: c.id,
    title: c.title,
    duration: c.duration,
    startDate: c.startDate,
    checkins: c.checkins.length,
    lastCheckin: c.checkins.map((k) => k.date).sort().at(-1) ?? "",
  }));

  const csv = [
    "-- Tasks & Reminders --",
    toCsv(taskRows),
    "",
    "-- Challenges --",
    toCsv(challengeRows),
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="mosambi-export-${Date.now()}.csv"`,
    },
  });
}
