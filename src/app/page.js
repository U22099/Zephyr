import { SignIn } from "@/components/forms/sign-in-form";
import { OTP } from "@/components/forms/otp";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <SignIn />
    </main>
  );
}
