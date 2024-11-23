import { db } from "@/firebase";
import {
  collection,
  query,
  startAfter,
  orderBy,
  limit,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import axios from "axios";

export const getData = async (uid, collection, setData = null) => {
  try {
    const data = await getDoc(doc(db, collection, uid));
    const result = data.data();
    if (setData) return setData(result);
    return result;
  } catch (err) {
    console.log(err, err.message, "getData")
  }
}

export const getAllUsers = async (setData, prevdata = null) => {
  if (!prevdata) {
    const data = await getInitialUsers();
    if (data) return setData(data);
  } else {
    const data = await getNextUsers(prevdata.slice(-1)[0]);
    if (data) return setData(
      [...prevdata, data]
    );
  }
}

function getInitialUsers() {
  try {
    const data = await getDocs(query(collection(db, "users"), limit(20)));
    const result = data.map(doc => {
      const docData = doc.data();
      return {
        uid: docData.id,
        image: docData.imageURL,
        username: docData.username,
        bio: docData.bio
      }
    });
    return result;
  } catch (err) {
    console.log(err, err.message, "getInitialUsers");
    return;
  }
}
function getNextUsers(lastuser) {
  try {
    const data = await getDocs(query(collection(db, "users"), startAfter(lastuser), orderBy("uid"), limit(20)));
    const result = data.map(doc => {
      const docData = doc.data();
      return {
        uid: docData.id,
        image: docData.imageURL,
        username: docData.username,
        bio: docData.bio
      }
    });
    return result;
  } catch (err) {
    console.log(err, err.message, "getNextUsers");
    return;
  }
}
/*export const getDocWithPropertyEqual = async (collection, property, type, value, setData = null) => {
  try {
    const q = query(collectionRef(db, collection), where(property, type , value));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log('No matching documents.');
      return null;
    }
    const doc = querySnapshot.docs[0];
    const result = doc.data();
    if (setData) return setData(result);
    return result;
  } catch (err) {
    console.log(err, err.message, "getData");
    return null;
  }
};
*/

export const getUserData = async (uid, setUserData) => {
  try {
    const dbUser = await getDoc(doc(db, "users", uid));
    const result = dbUser.data();
    setUserData(result);
    console.log(result);
  } catch (err) {
    console.log(err, err.message, "getUserData")
  }
}
export const updateUserData = async (uid, data, merge = true) => {
  try {
    await setDoc(doc(db, "users", uid), data, { merge });
    return true;
  } catch (err) {
    console.log(err, err.message);
    return;
  }
}
export const updateVariables = async (uid, setUsername, setImageUrl, setGender, setBio, setImagePublicId) => {
  try {
    const dbUser = await getDoc(doc(db, "users", uid));
    const userData = dbUser.data();
    setUsername(userData?.username);
    setImageUrl(userData?.imageURL);
    setGender(userData?.gender);
    setBio(userData?.bio);
    setImagePublicId(userData?.imagePublicId);
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
export function convertToTimeString(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-UK', {
    hour12: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
}
export function getCurrentDate() {
  const date = new Date();
  return date.toLocaleTimeString('en-UK', {
    hour12: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
}