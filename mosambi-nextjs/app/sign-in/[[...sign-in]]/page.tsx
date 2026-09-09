import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" forceRedirectUrl="/dashboard" />
    </main>
  );
}
