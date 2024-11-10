"use client";

import { SignIn } from "@/components/forms/sign-in-form";
import { useState } from "react";
import { motion } from "framer-motion";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useSignInWithGoogle, useSignInWithGithub } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();


  const [signInWithGoogle] = useSignInWithGoogle(auth);
  const [signInWithGithub] = useSignInWithGithub(auth);

  const credentialsLogin = async () => {
    if (!email || !password) {
      setError("invalid inputs");
      return false;
    }
    try {
      setLoading(true);
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log(user, "here");
      //if(user) router.push("/home");
      return true;
    } catch (err) {
      console.log(err);
      if(err.code.includes("invalid-credential")){
        try{
          const user = await createUserWithEmailAndPassword(auth, email, password);
          console.log(user, "here");
          //if(user) router.push("/home");
          return true;
        } catch(err) {
          console.log(err);
          setError(err?.code);
          return false;
        }
      } else {
        setError(err?.code);
        return false;
      }
    } finally {
      setLoading(false);
    }
  }

  const googleLogin = async () => {
    try {
      setLoading(true);
      const user = await signInWithGoogle();
      //if(user) router.push("/home");
      return true;
    } catch (err) {
      console.log(err);
      setError(err?.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  const githubLogin = async () => {
    try {
      setLoading(true);
      const user = await signInWithGithub();
      //if(user) router.push("/home");
      return true;
    } catch (err) {
      console.log(err);
      setError(err?.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  const signIn = async (type) => {
    switch (type) {
      case "credentials":
        return await credentialsLogin();
      case "google":
        return await googleLogin();
      case "github":
        return await githubLogin();
    }
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <SignIn setEmail={setEmail} setPassword={setPassword} signIn={signIn} loading={loading} error={error}/>
    </main>
  );
}