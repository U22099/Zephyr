"use client";

import { SignIn } from "@/components/forms/sign-in-form";
import { useState } from "react";
import { motion } from "framer-motion";
import { fetchSignInMethodsForEmail, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useSignInWithGoogle, useSignInWithGithub } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { storeSession } from "@/lib/utility/index";

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
    } else if (password.length < 6) {
      setError("password is too short");
      return false;
    }
    try {
      setLoading(true);
      const existUser = await fetchSignInMethodsForEmail(auth, email);
      let user;
      if (existUser?.length) {
        user = await signInWithEmailAndPassword(auth, email, password);
      } else {
        user = await createUserWithEmailAndPassword(auth, email, password);
      }
      if (user) {
        try{
          await setDoc(doc(db, "users", user.uid), {
            username: user.displayName,
            image: user.photoURL,
            gender: "",
            bio: "",
          }, { merge: true });
        } catch(err) {
          console.log(err);
        }
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

  const googleLogin = async () => {
    try {
      setLoading(true);
      const user = await signInWithGoogle();
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          username: user.displayName,
          image: user.photoURL,
          gender: "",
          bio: "",
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

  const githubLogin = async () => {
    try {
      setLoading(true);
      const user = await signInWithGithub();
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          username: user.displayName,
          image: user.photoURL,
          gender: "",
          bio: "",
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