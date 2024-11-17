import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
export const getUserData = async (user, setUserData) => {
  const dbUser = await getDoc(doc(db, "users", user.uid));
  const userData = dbUser.data();
  setUserData({
    username: userData?.username,
    imageURL: userData?.imageURL,
    imagePublicId: userData?.imagePublicId,
    gender: userData?.gender,
    bio: userData?.bio,
    theme: userData?.theme,
  });
  return userData;
}
export const updateVariables = async (user, setUsername, setImageUrl, setGender, setBio, setImagePublicId, setUserData) => {
  try {
    const userData = await getUserData(user, setUserData);
    setUsername(userData?.username);
    setImageUrl(userData?.imageURL);
    setGender(userData?.gender);
    setBio(userData?.bio);
    setImagePublicId(userData?.imagePublicId);
  } catch (err) {
    console.log(err, "updateVariables");
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