"use client";
import { UserProfile } from "@/components/profile/user-profile";
import { Loading } from "@/components/loading";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { updateVariables, toBase64, uploadFileAndGetURL } from "@/utils";
import { useTheme } from "next-themes";
import { deleteSession, getSession } from "@/lib/utility/index";
import axios from "axios";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("visited"))) {
      router.push("/home");
    } else {
      localStorage.setItem("visited", JSON.stringify(true));
    }
  }, [router]);
  const [pageLoading, setPageLoading] = useState(true);
  const [user, userLoading, userError] = useAuthState(auth);

  const [image, setImage] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [imageBase64String, setImageBase64String] = useState();
  const [imagePublicId, setImagePublicId] = useState();

  const [username, setUsername] = useState();

  const [gender, setGender] = useState(null);

  const [bio, setBio] = useState(null);

  const { theme } = useTheme();

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
        const deleted = await axios.delete("/api/file", { data: { publicId: imagePublicId } });
        if (deleted.status === 200) {
          newImageUrl = await uploadFileAndGetURL(imageBase64String, "images", "image");
        }
      } catch (err) {
        setError(err?.code || err?.message || "try again, an error occured");
        console.log(err, "image url");
        setLoading("false");
        return;
      }
    }
    try {

      await updateProfile(user, {
        displayName: username.trim(),
        photoURL: newImageUrl?.secure_url || imageUrl
      });

      await setDoc(doc(db, "users", user.uid), {
        username: username.trim(),
        imageURL: newImageUrl?.secure_url || imageUrl,
        imagePublicId: newImageUrl?.public_id || imagePublicId,
        gender,
        bio,
        theme,
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
    if (userError || (!user && !userLoading)) {
      deleteSession();
      router.push("/");
    } else {
      if (user) {
        const uid = user.uid === "U2YAfwTchcTNmgZxP4bDsoUUdEk2" ? process.env.NEXT_PUBLIC_UID : user.uid
        updateVariables(uid, setUsername, setImageUrl, setGender, setBio, setImagePublicId, setPageLoading);
      }
    }
  }, [user, userError, userLoading]);

  useEffect(() => {
    if (image) {
      updateImage(setImageBase64String, image);
    }
  }, [image]);

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      { !pageLoading ? <UserProfile 
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
      /> : <Loading /> }
    </main>
  )
}
const updateImage = async (setImageBase64String, image) => {
  const data = await toBase64(image);
  setImageBase64String(data);
}