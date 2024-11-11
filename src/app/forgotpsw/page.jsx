"use client";

import { ForgotPSW } from "@/components/forms/forgotpsw-form";
import { useState } from "react";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const sendCode = async () => {
    if (!email) {
      setError("invalid inputs");
      return false;
    }
    try {
      setLoading(true);
      const existUser = await fetchSignInMethodsForEmail(auth, email);
      let user;
      if (existUser?.length) {
        
      } else {
        setError("email does not have an account");
        return false;
      }
      return true;
    } catch (err) {
      console.log(err);
      setError(err?.code || err?.message || "try again, an error occured");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <ForgotPSW setEmail={setEmail} sendCode={sendCode} loading={loading} error={error}/>
    </main>
  );
}