"use client";
import { UserProfile } from "@/components/profile/userProfile";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { storage, auth } from "@/firebase";
import { updateProfile } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks";

export default function Home() {
  const router = useRouter();
  const [user, userLoading, userError] = useAuthState(auth);
  const [image, setImage] = useState();
  const [imageUrl, setImageUrl] = useState(user.photoURL);
  const [username, setUsername] = useState(user.displayName);
  const [gender, setGender] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const updateUserProfile = async () => {
    setLoading(true);
    let newImageUrl;
    if(!image || !username || !gender){
      setError("invalid inputs")
      return;
    }
    if (image) {
      try{
        newImageUrl = await uploadImage(image);
      } catch(err) {
        setError(err?.code || err?.message || "try again, an error occured");
        console.log(err);
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
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
  const uploadImage = async (image) => {
  const uploadTask = storage.ref(`images/${image.name}`).put(image);
  const snapshot = await uploadTask;
  return snapshot.ref.getDownloadURL();
}
  useEffect(() => {
    if (userError) {
      router.push("/");
    } else {
      setUsername(user.displayName);
      setImageUrl(user.photoURL);
    }
  }, [user]);
  return (
    <main>
      <UserProfile imageUrl={imageUrl} setUsername={setUsername} username={username} setImage={setImage} loading={loading} error={error} updateUserProfile={updateUserProfile} gender={gender} setGender={setGender}/>
    </main>
  )
}