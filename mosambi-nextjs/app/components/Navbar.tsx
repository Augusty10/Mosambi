import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <header className="navbar-wrap">
      <div className="navbar-inner">
        <Link href="/" className="brand-logo">
          <div className="brand-icon">🍊</div>
          <span>Mosambi</span>
        </Link>

        <nav className="nav-links">
          <Link href="/try" className="nav-link">
            ⚡ Instant Mode <span style={{ fontSize: 11, background: "var(--gold-soft)", color: "#8A6A00", padding: "2px 7px", borderRadius: 999, fontWeight: 700, marginLeft: 4 }}>No Login</span>
          </Link>
          <Link href="/dashboard" className="nav-link">
            👤 Personal Hub
          </Link>
          <Link href="/organization" className="nav-link">
            🏢 For Agencies & Orgs
          </Link>
          <Link href="/#features" className="nav-link">
            Features
          </Link>
          <Link href="/#compare" className="nav-link">
            Compare Tiers
          </Link>
        </nav>

        <div className="nav-actions">
          <SignedOut>
            <Link
              href="/try"
              className="btn-ghost"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                borderColor: "var(--orange-2)",
                color: "var(--peel)",
              }}
            >
              <span>⚡</span>
              <span>Try Instant</span>
            </Link>
            <Link
              href="/sign-in"
              className="btn-ghost"
              style={{ textDecoration: "none" }}
            >
              Log in
            </Link>
            <Link
              href="/sign-up"
              className="btn-primary"
              style={{ textDecoration: "none" }}
            >
              Get Started
            </Link>
          </SignedOut>

          <SignedIn>
            <Link
              href="/dashboard"
              className="btn-primary"
              style={{
                textDecoration: "none",
                fontSize: 13,
                padding: "8px 16px",
              }}
            >
              Go to Dashboard →
            </Link>
            <UserButton
              afterSignOutUrl="/"
              appearance={{ elements: { avatarBox: { width: 36, height: 36 } } }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
