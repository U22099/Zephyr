import { SignUp } from "@/components/forms/sign-up-form";
import { OTP } from "@/components/forms/otp";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SignUp />
    </main>
  );
}
