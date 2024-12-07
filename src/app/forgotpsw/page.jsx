"use client";

import { ForgotPSW } from "@/components/forms/forgotpsw-form";
import { useState, useEffect } from "react";
import { fetchSignInMethodsForEmail, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { getSession } from "@/lib/utility/index";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (getSession()) {
      router.push("/home");
    }
  }, [router]);
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const { toast } = useToast();

  const passwordReset = async () => {
    if (!email) {
      setError("invalid inputs");
      return false;
    }
    try {
      setLoading(true);
      const existUser = await fetchSignInMethodsForEmail(auth, email);
      if (existUser?.length) {
        try {
          await sendPasswordResetEmail(auth, email);
          toast({
            description: "Email sent successfully, check your email to reset password.",
          });
        } catch (err) {
          setError("An error occured, please try again");
          console.log(err, err?.message);
          return false;
        }
      } else {
        setError("Email does not have an account");
        return false;
      }
      return true;
    } catch (err) {
      setError(err?.code || err?.message || "try again, an error occured");
      console.log(err, err?.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <ForgotPSW setEmail={setEmail} passwordReset={passwordReset} loading={loading} error={error}/>
    </main>
  );
}