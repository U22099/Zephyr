"use client";

import { SignUp } from "@/components/forms/sign-up-form";
import { useState } from "react";
import { useSignInWithEmailAndPassword, useSignInWithGoogle, useSignInWithGithub } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";

export default function Home() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const [signInWithGoogle] = useSignInWithGoogle(auth);
  const [signInWithGithub] = useSignInWithGithub(auth);

  const credentialsSignUp = async () => {
    if (!email || !password) {
      setError("invalid inputs");
      return false;
    }
    try {
      setLoading(true);
      const user = await signInWithEmailAndPassword(email, password);
      if (user) router.push("/signup/profile");
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  const googleSignUp = async () => {
    try {
      setLoading(true);
      const user = await signInWithGoogle();
      if (user) router.push("/signup/profile");
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  const githubSignUp = async () => {
    try {
      setLoading(true);
      const user = await signInWithGithub();
      if (user) router.push("/signup/profile");
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  const signUp = async (type) => {
    switch (type) {
      case "credentials":
        return await credentialsSignUp();
      case "google":
        return await googleSignUp();
      case "github":
        return await githubSignUp();
    }
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <SignUp setUsername={setUsername} setEmail={setEmail} setPassword={setPassword} signUp={signUp} loading={loading} error={error}/>
    </main>
  );
}