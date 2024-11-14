"use client";
import { UserProfile } from "@/components/profile/userProfile";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { storage, auth } from "@/firebase";
import { updateProfile } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { uploadFile, toBase64 } from "@/components/cloudinary";

export default function Home() {
  const router = useRouter();
  const [user, userLoading, userError] = useAuthState(auth);
  const [image, setImage] = useState();
  const [imageUrl, setImageUrl] = useState(user?.photoURL);
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
        const imageBase64String = toBase64(image);
        newImageUrl = await uploadFile(imageBase64String, "images");
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
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <UserProfile imageUrl={imageUrl} setUsername={setUsername} username={username} setImage={setImage} loading={loading} error={error} updateUserProfile={updateUserProfile} gender={gender} setGender={setGender}/>
    </main>
  )
}