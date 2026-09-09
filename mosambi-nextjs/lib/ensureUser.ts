import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

/**
 * Makes sure a User row exists in Neon for the signed-in Clerk user.
 * Called at the top of every API route and the dashboard page.
 */
export async function ensureUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses?.[0]?.emailAddress ?? null;

  const user = await prisma.user.upsert({
    where: { id: clerkUser.id },
    update: { email },
    create: { id: clerkUser.id, email },
  });

  return { user, clerkUser };
}
