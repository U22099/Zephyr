"use client";
import { UserProfile } from "@/components/profile/userProfile";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebase";
import { updateProfile } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { deleteSession } from "@/lib/utility/index";
import axios from "axios";

export default function Home() {
  const router = useRouter();
  const [user, userLoading, userError] = useAuthState(auth);
  const [image, setImage] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [imageBase64String, setImageBase64String] = useState();
  const [username, setUsername] = useState();
  const [gender, setGender] = useState();
  const [bio, setBio] = useState();
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
        const newImageObj = await axios.post("/api/file-upload", {file: imageBase64String, folder: "images"});
        newImageUrl = newImageObj?.secure_url;
        console.log(newImageObj)
      } catch (err) {
        setError(err?.code || err?.message || "try again, an error occured");
        console.log(err, "image url");
      }
    }
    try {
      await updateProfile(user, {
        displayName: username,
        photoURL: newImageUrl.fileURL || imageUrl
      });
      await db.collections("users").doc(user.uid).set({
        username,
        imageURL: newImageUrl.fileURL || imageUrl,
        gender,
        bio,
      })
      router.push("/home");
    } catch (err) {
      setError(err?.code || err?.message || "try again, an error occured");
      console.log(err, "updateProfile");
    } finally {
      setLoading(false);
    }
  }
  const updateImage = async () => {
    const data = await toBase64(image);
    setImageBase64String(data);
  }
  const getUserData = async () => {
    try{
      const dbUser = await db.collections("users").doc(user.uid).get();
      const userData = dbUser.data();
      console.log(userData);
      setUsername(userData?.username);
      setImageUrl(userData?.image);
      setGender(userData?.gender);
      setBio(userData?.bio);
    } catch(err) {
      console.log(err, "updateVariables");
    }
  }
  useEffect(() => {
    if (userError) {
      router.push("/");
    } else {
      getUserData();
    }
  }, [user, getUserData, router]);
  useEffect(() => {
    if(image){
      console.log(image);
      updateImage();
    }
  }, [image, updateImage]);
  useEffect(() => {
    //deleteSession();
    //console.log("done");
  })
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <UserProfile 
      bio={bio}
      setBio={setBio}
      imageBase64String={imageBase64String}  
      imageUrl={imageUrl} 
      setUsername={setUsername} 
      username={username} 
      setImage={setImage} 
      loading={loading} 
      error={error} 
      updateUserProfile={updateUserProfile} 
      gender={gender} 
      setGender={setGender}/>
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