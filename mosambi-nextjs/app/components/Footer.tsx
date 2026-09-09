import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer-wrap">
      <div className="footer-inner">
        <div className="footer-col">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "radial-gradient(circle at 32% 28%, #FFD8A8 0%, var(--orange-1) 45%, var(--orange-2) 78%, var(--peel) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                color: "#fff",
              }}
            >
              🍊
            </div>
            <span style={{ fontFamily: "Fraunces, serif", fontWeight: 800, fontSize: 18, color: "var(--ink)" }}>
              Mosambi
            </span>
          </div>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, maxWidth: 320, margin: "0 0 16px" }}>
            The citrus-fresh daily productivity OS. Build unbreakable streaks, conquer multi-day challenges, and squeeze the full potential out of every day.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--peel)", fontWeight: 600 }}>
            <span>⏱️</span>
            <span>&ldquo;Every second counts.&rdquo;</span>
          </div>
        </div>

        <div className="footer-col">
          <h4>3 App Sections</h4>
          <ul>
            <li>
              <Link href="/try">
                ⚡ <strong>Normal Use (Instant)</strong>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>No login required &bull; 100% private</div>
              </Link>
            </li>
            <li>
              <Link href="/dashboard">
                👤 <strong>Personal Use (Auth)</strong>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>XP, multi-day challenges & cloud sync</div>
              </Link>
            </li>
            <li>
              <Link href="/organization">
                🏢 <strong>Agencies & Orgs</strong>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>Team sprints, shared streaks & projects</div>
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Core Features</h4>
          <ul>
            <li><Link href="/#features">Daily Time-Blocking</Link></li>
            <li><Link href="/#features">7 to 120-Day Challenges</Link></li>
            <li><Link href="/#features">XP Levels & Milestone Badges</Link></li>
            <li><Link href="/#features">Mood-Adaptive Color Schemes</Link></li>
            <li><Link href="/#features">Browser Deadline Alerts</Link></li>
            <li><Link href="/#compare">Feature Comparison</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Productivity Shortcuts</h4>
          <ul style={{ fontSize: 12, color: "var(--muted)" }}>
            <li>
              <span style={{ background: "var(--line)", padding: "2px 6px", borderRadius: 6, fontFamily: "monospace", color: "var(--ink)" }}>Enter</span> Add quick task
            </li>
            <li>
              <span style={{ background: "var(--line)", padding: "2px 6px", borderRadius: 6, fontFamily: "monospace", color: "var(--ink)" }}>Space</span> Check off item
            </li>
            <li>
              <span style={{ background: "var(--line)", padding: "2px 6px", borderRadius: 6, fontFamily: "monospace", color: "var(--ink)" }}>Export</span> JSON / CSV backup
            </li>
            <li>
              <span style={{ background: "var(--line)", padding: "2px 6px", borderRadius: 6, fontFamily: "monospace", color: "var(--ink)" }}>Offline</span> LocalStorage synced
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div>
          &copy; {new Date().getFullYear()} Mosambi. Crafted with zest for maximum focus and daily momentum.
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <Link href="/try" style={{ color: "var(--muted)", textDecoration: "none" }}>Try Instant Mode</Link>
          <Link href="/sign-in" style={{ color: "var(--muted)", textDecoration: "none" }}>Sign In</Link>
          <Link href="/sign-up" style={{ color: "var(--muted)", textDecoration: "none" }}>Sign Up</Link>
        </div>
      </div>
    </footer>
  );
}
