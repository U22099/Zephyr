"use client";
import { UserProfile } from "@/components/profile/user-profile";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { getUserData, toBase64, uploadFileAndGetURL } from "@/utils"
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
    if (!username || !gender) {
      setError("username and gender must be specified");
      setLoading(false);
      return;
    }
    if (imageBase64String) {
      try {
        newImageUrl = await uploadFileAndGetURL(imageBase64String, "images", "image");
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
        photoURL: newImageUrl.secure_url || imageUrl
      });

      await setDoc(doc(db, "users", user.uid), {
        username,
        imageURL: newImageUrl.secure_url || imageUrl,
        imagePublicId: newImageUrl.public_id,
        gender: gender || null,
        bio: bio || null,
      }, { merge: true });
      
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
      getUserData(user, setUsername, setImageUrl, setGender, setBio);
    }
  }, [user]);
  
  useEffect(() => {
    if (image) {
      updateImage(setImageBase64String, image);
    }
  }, [image]);
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
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
        setGender={setGender}
      />
    </main>
  )
}
const updateImage = async (setImageBase64String, image) => {
  const data = await toBase64(image);
  setImageBase64String(data);
}