import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export const getUserData = async (uid) => {
  try {
    const dbUser = await getDoc(doc(db, "users", uid));
    return dbUser.data();
  } catch (err) {
    console.log(err, err.message, "getUserData")
  }
}
export const updateVariables = async (uid, setUsername, setImageUrl, setGender, setBio, setImagePublicId, setUserData) => {
  try {
    const dbUser = await getDoc(doc(db, "users", uid));
    const userData = dbUser.data();
    setUsername(userData?.username);
    setImageUrl(userData?.imageURL);
    setGender(userData?.gender);
    setBio(userData?.bio);
    setImagePublicId(userData?.imagePublicId);
    setUserData({
      username: userData?.username,
      imageURL: userData?.imageURL,
      imagePublicId: userData?.imagePublicId,
      gender: userData?.gender,
      bio: userData?.bio,
      theme: userData?.theme,
    });
  } catch (err) {
    console.log(err, err.message, "updateVariables");
  }
}
export const uploadFileAndGetURL = async (file, folder, type) => {
  const newImageObj = (await axios.post("/api/file",
  {
    file,
    folder,
    type
  })).data;
  return newImageObj.fileURL;
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