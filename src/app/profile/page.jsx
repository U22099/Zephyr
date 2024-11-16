"use client";
import { UserProfile } from "@/components/profile/userProfile";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
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
    setError("");
    let newImageUrl;
    console.log(image, username, gender)
    if (!username || !gender) {
      setError("username and gender must be specified");
      setLoading(false);
      return;
    }
    if (imageBase64String) {
      try {
        const newImageObj = (await axios.post("/api/file-upload", 
        { 
          file: imageBase64String, 
          folder: "images", 
          type: "image"
        })).data.fileURL;
        newImageUrl = newImageObj?.secure_url;
        console.log(newImageObj)
      } catch (err) {
        setError(err?.code || err?.message || "try again, an error occured");
        console.log(err, "image url");
        setLoading("false");
        return;
      }
    }
    try {
      
      await updateProfile(user, {
        displayName: username,
        photoURL: newImageUrl || imageUrl
      });
      
      await setDoc(doc(db, "users", user.uid), {
        username,
        imageURL: newImageUrl || imageUrl,
        gender,
        bio,
      }, { merge: true });
      
      localStorage.setItem("file", JSON.stringify(newImageObj));
      
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
    try {
      const dbUser = await getDoc(doc(db, "users", user.uid));
      const userData = dbUser.data();
      console.log(userData);
      setUsername(userData?.username);
      setImageUrl(userData?.image);
      setGender(userData?.gender);
      setBio(userData?.bio);
    } catch (err) {
      console.log(err, "updateVariables");
    }
  }
  useEffect(() => {
    if (userError) {
      router.push("/");
    } else {
      getUserData();
    }
  }, [user]);
  useEffect(() => {
    if (image) {
      updateImage();
    }
  }, [image]);
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
  return data;
}