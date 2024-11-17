import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export const getUserData = async (user, setUsername, setImageUrl, setGender, setBio) => {
  try {
    const dbUser = await getDoc(doc(db, "users", user.uid));
    const userData = dbUser.data();
    console.log(userData);
    setUsername(userData?.username);
    setImageUrl(userData?.imageURL);
    setGender(userData?.gender);
    setBio(userData?.bio);
  } catch (err) {
    console.log(err, "updateVariables");
  }
}
export const uploadFileAndGetURL = async (file, folder, type) => {
  const newImageObj = (await axios.post("/api/file-upload",
  {
    file,
    folder,
    type
  })).data;
  console.log(newImageObj);
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