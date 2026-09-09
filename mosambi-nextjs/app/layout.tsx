import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mosambi — Tasks, Challenges & Reminders",
  description: "A juicy daily tracker with streaks, XP, challenges and reminders.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#FF6A18",
          colorText: "#3A2417",
          borderRadius: "12px",
        },
      }}
    >
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,800;1,9..144,500;1,9..144,600&family=Inter:wght@400;500;600;700;800&display=swap"
            rel="stylesheet"
          />
        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
