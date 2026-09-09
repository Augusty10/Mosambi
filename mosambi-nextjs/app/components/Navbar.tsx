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

        <div className="nav-actions">
          <SignedOut>
            <Link
              href="/sign-up"
              className="btn-primary"
              style={{
                textDecoration: "none",
                padding: "10px 20px",
                fontSize: 14,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
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
              Get Started →
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
