"use client";

import { SignIn } from "@/components/forms/sign-in-form";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchSignInMethodsForEmail, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { useSignInWithGoogle, useSignInWithGithub } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { storeSession, getSession } from "@/lib/utility/index";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("logged"))) {
      router.push("/home");
    }
  }, [router]);
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resend, setResend] = useState(false);


  const [signInWithGoogle] = useSignInWithGoogle(auth);
  const [signInWithGithub] = useSignInWithGithub(auth);

  const resendVerificationLink = async (user) => {
    try {
      await sendEmailVerification(user);
      await signOut(auth);
      toast({
        title: "Email Verification",
        description: "Check your email/spam folder to verify your account"
      });
      localStorage.removeItem("visited");
      localStorage.setItem("registered", JSON.stringify(true));
      setResend(false);
      return;
    } catch (err) {
      console.log(err);
      setError(err?.code || err?.message || "try again, an error occured");
      return;
    } finally {
      setLoading(false);
    }
  }


  const credentialsLogin = async () => {
    if (!email || !password) {
      setError("invalid inputs");
      return;
    } else if (password.length < 6) {
      setError("password is too short");
      return;
    }
    try {
      setLoading(true);
      const existUser = await fetchSignInMethodsForEmail(auth, email);
      let user;
      if (existUser?.length) {
        user = (await signInWithEmailAndPassword(auth, email, password))?.user;
        if (!user.emailVerified && !resend) {
          await signOut(auth);
          toast({
            title: "Email Verification",
            description: "Please verify your email address to login",
            variant: "destructive"
          });
          setResend(true);
          setLoading(false);
          return;
        } else if (resend) {
          await resendVerificationLink(user);
          return;
        }
      } else {
        user = (await createUserWithEmailAndPassword(auth, email, password))?.user;
        await sendEmailVerification(user);
        await signOut(auth);
        toast({
          title: "Email Verification",
          description: "Check your email to verify your account"
        });
        localStorage.removeItem("visited");
        localStorage.setItem("registered", JSON.stringify(true));
        setLoading(false);
        return;
      }
      if (user) {
        try {
          if (JSON.parse(localStorage.getItem("registered"))) {
            await setDoc(doc(db, "users", user.uid), {
              username: user.displayName,
              imageURL: user.photoURL,
              type: "personal"
            }, { merge: true });
            localStorage.setItem("logged", JSON.stringify(true));
            storeSession({
              uid: Math.floor(Math.random() * 253637)
            });
            localStorage.removeItem("registered");
            router.push("/profile");
          } else if (existUser?.length) {
            storeSession({
              uid: Math.floor(Math.random() * 25363727363)
            });
            localStorage.setItem("logged", JSON.stringify(true));
            router.push("/home");
            return;
          }
        } catch (err) {
          console.log(err, err.message, "Doc");
        }
      }
      return;
    } catch (err) {
      console.log(err);
      setError(err?.code || err?.message || "try again, an error occured");
      return;
    }
  }

  const googleLogin = async () => {
    try {
      setLoading(true);
      const user = (await signInWithGoogle())?.user;
      if (user) {
        const exists = await getDoc(doc(db, "users", user.uid));
        if (exists.exists()) {
          storeSession({
            uid: Math.floor(Math.random() * 253637)
          });
          router.push("/home");
          return true;
        }
        await setDoc(doc(db, "users", user.uid), {
          username: user.displayName,
          imageURL: user.photoURL,
          type: "personal"
        }, { merge: true });
        router.push("/profile");
      }
      return true;
    } catch (err) {
      console.log(err);
      setError(err?.code || err?.message || "try again, an error occured");
      return false;
    }
  }

  const githubLogin = async () => {
    try {
      setLoading(true);
      const user = (await signInWithGithub())?.user;
      if (user) {
        const exists = await getDoc(doc(db, "users", user.uid));
        if (exists.exists()) {
          storeSession({
            uid: Math.floor(Math.random() * 253637)
          });
          router.push("/home");
          return true;
        }
        await setDoc(doc(db, "users", user.uid), {
          username: user.displayName,
          imageURL: user.photoURL,
          type: "personal"
        }, { merge: true });
        storeSession({
          uid: Math.floor(Math.random() * 253637)
        });
        router.push("/profile");
      }
      return true;
    } catch (err) {
      console.log(err);
      setError(err?.code || err?.message || "try again, an error occured");
      return false;
    }
  }

  const signIn = async (type) => {
    setError("");
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
      <SignIn resend={resend} setEmail={setEmail} setPassword={setPassword} signIn={signIn} loading={loading} error={error}/>
    </main>
  );
}