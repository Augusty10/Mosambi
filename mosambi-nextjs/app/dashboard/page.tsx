import { UserButton } from "@clerk/nextjs";
import { ensureUser } from "@/lib/ensureUser";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const ctx = await ensureUser();
  if (!ctx) return null; // middleware already redirects unauthenticated users

  const [tasks, challenges, moodImages] = await Promise.all([
    prisma.task.findMany({ where: { userId: ctx.user.id }, orderBy: [{ date: "desc" }, { time: "desc" }] }),
    prisma.challenge.findMany({
      where: { userId: ctx.user.id },
      include: { checkins: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.moodImage.findMany({ where: { userId: ctx.user.id }, select: { mood: true } }),
  ]);

  return (
    <main className="app-shell">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
        {/* Clicking the avatar opens Clerk's account panel, where the user can upload/change their DP */}
        <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: { width: 38, height: 38 } } }} />
      </div>
      <DashboardClient
        initialTasks={tasks}
        initialChallenges={challenges}
        initialUser={ctx.user}
        moodsWithImages={moodImages.map((m) => m.mood)}
        clerkImageUrl={ctx.clerkUser.imageUrl}
        clerkName={ctx.clerkUser.firstName || ctx.clerkUser.username || "there"}
      />
    </main>
  );
}
