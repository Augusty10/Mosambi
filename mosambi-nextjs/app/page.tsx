import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();
  if (user) redirect("/dashboard");

  return (
    <main className="app-shell" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center" }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 32% 28%, #FFD8A8 0%, var(--orange-1) 45%, var(--orange-2) 78%, var(--peel) 100%)",
          marginBottom: 18,
        }}
      />
      <h1 className="font-display" style={{ fontSize: 34, fontWeight: 700, margin: 0 }}>
        Mosambi
      </h1>
      <p style={{ color: "var(--muted)", marginTop: 8, maxWidth: 380 }}>
        Tasks, challenges & reminders — with streaks, XP and rewards. One juicy day at a time.
      </p>
      <div style={{ display: "flex", gap: 12, marginTop: 26 }}>
        <Link href="/sign-up" className="btn-primary" style={{ textDecoration: "none" }}>
          Sign up
        </Link>
        <Link href="/sign-in" className="btn-ghost" style={{ textDecoration: "none" }}>
          Log in
        </Link>
      </div>
    </main>
  );
}
