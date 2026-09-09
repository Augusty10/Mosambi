import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="landing-shell" style={{ paddingTop: 40 }}>
        {/* HERO SECTION */}
        <section style={{ textAlign: "center", padding: "40px 10px 60px" }}>
          <div className="hero-badge">
            <span>🍊</span>
            <span>The Citrus-Fresh Daily Productivity OS</span>
          </div>

          <h1 className="hero-title">
            Squeeze Every Drop Out of Your Day.
          </h1>

          <p className="hero-subtitle">
            Mosambi is a daily task tracker, multi-day habit engine, and collaborative sprint platform.
            Choose how you work: instant no-login mode, personal cloud pro, or agency team workspaces.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 36 }}>
            <Link
              href="/try"
              className="btn-primary"
              style={{
                textDecoration: "none",
                fontSize: 16,
                padding: "14px 26px",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>⚡ Start Instant (No Login Required)</span>
            </Link>

            <Link
              href="/dashboard"
              className="btn-ghost"
              style={{
                textDecoration: "none",
                fontSize: 15,
                padding: "13px 22px",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>👤 Personal Hub (Auth)</span>
            </Link>

            <Link
              href="/organization"
              className="btn-ghost"
              style={{
                textDecoration: "none",
                fontSize: 15,
                padding: "13px 22px",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderColor: "var(--leaf)",
                color: "var(--leaf)",
              }}
            >
              <span>🏢 For Agencies & Orgs</span>
            </Link>
          </div>

          {/* Interactive Live Ticker Preview */}
          <div
            className="ticker"
            style={{
              maxWidth: 680,
              margin: "0 auto",
              padding: "14px 20px",
              boxShadow: "0 14px 30px -10px rgba(255, 106, 24, 0.2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>⏱️</span>
              <span className="ticker-quote">&ldquo;Every second counts. Small wins today, big streaks tomorrow.&rdquo;</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 12, background: "var(--gold-soft)", color: "#8A6A00", padding: "3px 9px", borderRadius: 999, fontWeight: 700 }}>
                🔥 14-Day Streak
              </span>
              <span style={{ fontSize: 12, background: "var(--leaf-soft)", color: "var(--leaf)", padding: "3px 9px", borderRadius: 999, fontWeight: 700 }}>
                ⚡ Level 4 &bull; Blossom
              </span>
            </div>
          </div>
        </section>

        {/* 3 APP SECTIONS ARCHITECTURE */}
        <section id="sections" style={{ marginTop: 20 }}>
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <span style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--peel)" }}>
              Choose Your Flow
            </span>
            <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 32, margin: "6px 0 10px", color: "var(--ink)" }}>
              Built in 3 Distinct Sections
            </h2>
            <p style={{ color: "var(--muted)", maxWidth: 560, margin: "0 auto", fontSize: 14 }}>
              Tailored for wherever you are: frictionless instant focus, personal habit transformation, or agency-wide accountability.
            </p>
          </div>

          <div className="sections-grid">
            {/* TIER 1: Normal Use */}
            <div className="tier-card" style={{ borderColor: "var(--orange-2)" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="tier-badge instant">Section 1 &bull; Instant</span>
                  <span style={{ fontSize: 24 }}>⚡</span>
                </div>

                <h3 style={{ fontFamily: "Fraunces, serif", fontSize: 24, margin: "4px 0 10px", color: "var(--ink)" }}>
                  Normal Use
                </h3>
                <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.5, margin: "0 0 18px" }}>
                  Completely <strong>no login required</strong>. Jump straight in, organize daily tasks, set time-stamps, and track progress with zero friction.
                </p>

                <ul style={{ padding: 0, margin: "0 0 24px", listStyle: "none", display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "var(--orange-2)", fontWeight: 800 }}>✓</span>
                    <span>100% Private in-browser storage</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "var(--orange-2)", fontWeight: 800 }}>✓</span>
                    <span>Daily tasks & time-tagged reminders</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "var(--orange-2)", fontWeight: 800 }}>✓</span>
                    <span>Live clock & &ldquo;Every second counts&rdquo; ticker</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "var(--orange-2)", fontWeight: 800 }}>✓</span>
                    <span>Mood color atmospheres & dark mode</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "var(--orange-2)", fontWeight: 800 }}>✓</span>
                    <span>Instant JSON task backup</span>
                  </li>
                </ul>
              </div>

              <div>
                <Link
                  href="/try"
                  className="btn-primary"
                  style={{ textDecoration: "none", display: "block", textAlign: "center", padding: "12px 18px" }}
                >
                  Launch Instant Mode (Free) →
                </Link>
                <div style={{ textAlign: "center", fontSize: 11, color: "var(--muted)", marginTop: 8 }}>
                  Zero sign up &bull; Starts instantly
                </div>
              </div>
            </div>

            {/* TIER 2: Personal Use */}
            <div className="tier-card" style={{ background: "linear-gradient(180deg, var(--card-alpha), #FFF9F2)" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="tier-badge personal">Section 2 &bull; Auth Required</span>
                  <span style={{ fontSize: 24 }}>👤</span>
                </div>

                <h3 style={{ fontFamily: "Fraunces, serif", fontSize: 24, margin: "4px 0 10px", color: "var(--ink)" }}>
                  Personal Pro
                </h3>
                <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.5, margin: "0 0 18px" }}>
                  Sign in with Clerk for continuous habit architecture, long-term multi-day challenges, XP leveling, and cloud synchronization.
                </p>

                <ul style={{ padding: 0, margin: "0 0 24px", listStyle: "none", display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "var(--gold)", fontWeight: 800 }}>✓</span>
                    <span>Multi-day challenges (7, 21, 45, 75, 100, 120d)</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "var(--gold)", fontWeight: 800 }}>✓</span>
                    <span>XP leveling & milestone streak badges</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "var(--gold)", fontWeight: 800 }}>✓</span>
                    <span>Custom mood photo uploads (Neon Postgres)</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "var(--gold)", fontWeight: 800 }}>✓</span>
                    <span>Browser deadline audio & notifications</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "var(--gold)", fontWeight: 800 }}>✓</span>
                    <span>CSV / JSON multi-format export</span>
                  </li>
                </ul>
              </div>

              <div>
                <Link
                  href="/dashboard"
                  className="btn-primary"
                  style={{
                    textDecoration: "none",
                    display: "block",
                    textAlign: "center",
                    padding: "12px 18px",
                    background: "linear-gradient(155deg, var(--gold), #D89B00)",
                  }}
                >
                  Open Personal Hub →
                </Link>
                <div style={{ textAlign: "center", fontSize: 11, color: "var(--muted)", marginTop: 8 }}>
                  Requires Clerk Sign-in &bull; Cross-device sync
                </div>
              </div>
            </div>

            {/* TIER 3: Organization & Agency */}
            <div className="tier-card" style={{ borderColor: "var(--leaf)" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="tier-badge agency">Section 3 &bull; Teams & Orgs</span>
                  <span style={{ fontSize: 24 }}>🏢</span>
                </div>

                <h3 style={{ fontFamily: "Fraunces, serif", fontSize: 24, margin: "4px 0 10px", color: "var(--ink)" }}>
                  Agencies & Orgs
                </h3>
                <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.5, margin: "0 0 18px" }}>
                  Built for companies, creative agencies, and startups that want shared habit accountability, client sprints, and team streak leaderboards.
                </p>

                <ul style={{ padding: 0, margin: "0 0 24px", listStyle: "none", display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "var(--leaf)", fontWeight: 800 }}>✓</span>
                    <span>Shared team sprint challenges</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "var(--leaf)", fontWeight: 800 }}>✓</span>
                    <span>Client & project-tagged task tracking</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "var(--leaf)", fontWeight: 800 }}>✓</span>
                    <span>Live team streak & XP leaderboard</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "var(--leaf)", fontWeight: 800 }}>✓</span>
                    <span>Role permissions: Admin, Member & Client</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "var(--leaf)", fontWeight: 800 }}>✓</span>
                    <span>Agency timesheet & CSV reports</span>
                  </li>
                </ul>
              </div>

              <div>
                <Link
                  href="/organization"
                  className="btn-primary"
                  style={{
                    textDecoration: "none",
                    display: "block",
                    textAlign: "center",
                    padding: "12px 18px",
                    background: "linear-gradient(155deg, var(--leaf), #5E7A33)",
                  }}
                >
                  Explore Agency Portal →
                </Link>
                <div style={{ textAlign: "center", fontSize: 11, color: "var(--muted)", marginTop: 8 }}>
                  Multi-member workspaces &bull; Team analytics
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT MOSAMBI DOES: 6 KEY PILLARS */}
        <section id="features" style={{ marginTop: 80 }}>
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <span style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--peel)" }}>
              Core Capabilities
            </span>
            <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 32, margin: "6px 0 10px", color: "var(--ink)" }}>
              What Mosambi Does For You
            </h2>
            <p style={{ color: "var(--muted)", maxWidth: 560, margin: "0 auto", fontSize: 14 }}>
              Traditional to-do apps are boring checklists. Mosambi is engineered around behavioral psychology, urgency, and game mechanics.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-box">⏰</div>
              <h4 style={{ fontFamily: "Fraunces, serif", fontSize: 17, margin: "0 0 8px", color: "var(--ink)" }}>
                Time-Blocked Daily Tasks
              </h4>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, margin: 0 }}>
                Set exact time tags for your tasks. The day sorts latest-first so your most pressing commitments stay front and center.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">🏆</div>
              <h4 style={{ fontFamily: "Fraunces, serif", fontSize: 17, margin: "0 0 8px", color: "var(--ink)" }}>
                Multi-Day Habit Challenges
              </h4>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, margin: 0 }}>
                Commit to 7, 21, 45, 75, 100, or 120-day endurance challenges. Segmented visual bars fill up as you build unbreakable streaks.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">⚡</div>
              <h4 style={{ fontFamily: "Fraunces, serif", fontSize: 17, margin: "0 0 8px", color: "var(--ink)" }}>
                XP Levels & Milestone Badges
              </h4>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, margin: 0 }}>
                Earn +10 XP for daily tasks and +25 XP for challenge check-ins. Advance from Seedling to Citrus Master and unlock coveted trophies.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">🎨</div>
              <h4 style={{ fontFamily: "Fraunces, serif", fontSize: 17, margin: "0 0 8px", color: "var(--ink)" }}>
                Mood-Adaptive Flow
              </h4>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, margin: 0 }}>
                Switch atmospheres instantly: Happy, Calm, Focused, Energetic, or upload your own personal photo backdrop stored in Postgres.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">🔔</div>
              <h4 style={{ fontFamily: "Fraunces, serif", fontSize: 17, margin: "0 0 8px", color: "var(--ink)" }}>
                Deadline Alerts & Clock Ticker
              </h4>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, margin: 0 }}>
                Browser notifications trigger 5 minutes before task times, backed by audio chimes and a ticking urgency quote bar.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">📤</div>
              <h4 style={{ fontFamily: "Fraunces, serif", fontSize: 17, margin: "0 0 8px", color: "var(--ink)" }}>
                Zero Lock-In Portability
              </h4>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, margin: 0 }}>
                Your data is yours forever. Export all your tasks, challenges, and check-in history to clean JSON or CSV format in a single click.
              </p>
            </div>
          </div>
        </section>

        {/* FEATURE COMPARISON TABLE */}
        <section id="compare" style={{ marginTop: 80 }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <span style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--peel)" }}>
              Side-by-Side
            </span>
            <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 32, margin: "6px 0 10px", color: "var(--ink)" }}>
              Compare The 3 Sections
            </h2>
          </div>

          <div className="comparison-wrap">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th style={{ width: "35%" }}>Feature</th>
                  <th style={{ width: "22%" }}>⚡ Normal (Instant)</th>
                  <th style={{ width: "22%" }}>👤 Personal (Auth)</th>
                  <th style={{ width: "21%" }}>🏢 Organization / Agency</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Account & Authentication</strong></td>
                  <td><span style={{ color: "var(--orange-2)", fontWeight: 700 }}>Zero Login Required</span></td>
                  <td>Clerk Sign-in</td>
                  <td>Team / Agency Single Sign-on</td>
                </tr>
                <tr>
                  <td><strong>Data Storage</strong></td>
                  <td>Private LocalStorage</td>
                  <td>Neon Serverless Postgres</td>
                  <td>Postgres + Team Workspaces</td>
                </tr>
                <tr>
                  <td><strong>Daily Tasks & Reminders</strong></td>
                  <td>✓ Included</td>
                  <td>✓ Included</td>
                  <td>✓ Client & Project Tagged</td>
                </tr>
                <tr>
                  <td><strong>Multi-Day Habit Challenges</strong></td>
                  <td>Starter Preview</td>
                  <td>✓ 7 to 120 Days Full</td>
                  <td>✓ Shared Team Sprints</td>
                </tr>
                <tr>
                  <td><strong>XP Gamification & Badges</strong></td>
                  <td>Basic Tracker</td>
                  <td>✓ 9 Level Titles + Badges</td>
                  <td>✓ Team XP Leaderboard</td>
                </tr>
                <tr>
                  <td><strong>Mood Flow & Photo Uploads</strong></td>
                  <td>Color Presets</td>
                  <td>✓ Custom Photo Uploads</td>
                  <td>✓ Brand Mood Themes</td>
                </tr>
                <tr>
                  <td><strong>Team Collaboration & Roles</strong></td>
                  <td>—</td>
                  <td>—</td>
                  <td>✓ Admin, Member, Client</td>
                </tr>
                <tr>
                  <td><strong>Export Formats</strong></td>
                  <td>JSON Download</td>
                  <td>JSON & CSV</td>
                  <td>JSON, CSV & Timesheet</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section
          style={{
            marginTop: 70,
            background: "linear-gradient(135deg, rgba(255, 106, 24, 0.15), rgba(242, 183, 5, 0.18))",
            border: "1.5px solid var(--orange-2)",
            borderRadius: 24,
            padding: "44px 24px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 10 }}>🍊</div>
          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 30, margin: "0 0 12px", color: "var(--ink)" }}>
            Start Squeezing Today
          </h2>
          <p style={{ color: "var(--muted)", maxWidth: 500, margin: "0 auto 24px", fontSize: 14.5, lineHeight: 1.6 }}>
            No credit card. No mandatory signup. Choose Instant mode for quick focus, or log in for life-changing habit streaks.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/try" className="btn-primary" style={{ textDecoration: "none", fontSize: 15, padding: "12px 24px" }}>
              ⚡ Start in Instant Mode
            </Link>
            <Link href="/sign-up" className="btn-ghost" style={{ textDecoration: "none", fontSize: 15, padding: "11px 22px" }}>
              Create Free Personal Account
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
