"use client";

import { SignIn } from "@/components/forms/sign-in-form";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchSignInMethodsForEmail, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useSignInWithGoogle, useSignInWithGithub } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { storeSession, getSession } from "@/lib/utility/index";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (getSession()) {
      router.push("/home");
    }
  }, [router]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const [signInWithGoogle] = useSignInWithGoogle(auth);
  const [signInWithGithub] = useSignInWithGithub(auth);


  const credentialsLogin = async () => {
    if (!email || !password) {
      setError("invalid inputs");
      return false;
    } else if (password.length < 6) {
      setError("password is too short");
      return false;
    }
    try {
      setLoading(true);
      const existUser = await fetchSignInMethodsForEmail(auth, email);
      let user;
      if (existUser?.length) {
        user = (await signInWithEmailAndPassword(auth, email, password))?.user;
      } else {
        user = (await createUserWithEmailAndPassword(auth, email, password))?.user;
      }
      if (user) {
        try {
          if (existUser?.length) {
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
        } catch (err) {
          console.log(err, err.message, "Doc");
        }
        storeSession({
          uid: Math.floor(Math.random() * 253637)
        });
        if (existUser?.length) router.push("/profile");
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
    } finally {
      setLoading(false);
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
    } finally {
      setLoading(false);
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
      <SignIn setEmail={setEmail} setPassword={setPassword} signIn={signIn} loading={loading} error={error}/>
    </main>
  );
}