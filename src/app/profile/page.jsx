"use client";
import { UserProfile } from "@/components/profile/userProfile";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { storage, auth } from "@/firebase";
import { updateProfile } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import axios from "axios";

export default function Home() {
  const router = useRouter();
  const [user, userLoading, userError] = useAuthState(auth);
  const [image, setImage] = useState();
  const [imageUrl, setImageUrl] = useState(user?.photoURL);
  const [imageBase64String, setImageBase64String] = useState();
  const [username, setUsername] = useState(user?.displayName);
  const [gender, setGender] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const updateUserProfile = async () => {
    setLoading(true);
    let newImageUrl;
    if (!image || !username || !gender) {
      setError("invalid inputs")
      return;
    }
    console.log(image, username, gender)
    if (image) {
      try {
        newImageUrl = await axios.post("/api/file-upload", {file: imageBase64String, folder: "images"});
      } catch (err) {
        setError(err?.code || err?.message || "try again, an error occured");
        console.log(err, "image url");
      }
    }
    try {
      await updateProfile(user, {
        displayName: username,
        photoURL: newImageUrl || imageUrl
      });
      router.push("/home");
    } catch (err) {
      setError(err?.code || err?.message || "try again, an error occured");
      console.log(err, "updateProfile");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (userError) {
      router.push("/");
    } else {
      console.log(user);
      setUsername(user?.displayName);
      setImageUrl(user?.photoURL);
    }
  }, [user]);
  useEffect(() => {
    const data = toBase64(image);
    setImageBase64String(data);
  }, [image]);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <UserProfile imageBase64String={imageBase64String}  imageUrl={imageUrl} setUsername={setUsername} username={username} setImage={setImage} loading={loading} error={error} updateUserProfile={updateUserProfile} gender={gender} setGender={setGender}/>
    </main>
  )
}
export const toBase64 = (file) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  const data = new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });
  return data
}