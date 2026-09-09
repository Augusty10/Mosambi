import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" forceRedirectUrl="/dashboard" />
    </main>
  );
}
