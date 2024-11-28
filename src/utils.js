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
  setDoc,
  addDoc,
  updateDoc,
} from 'firebase/firestore';
import { saveData } from "@/storage";
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

export const getAllUsers = async (setData) => {
  try {
    const data = await getDocs(query(collection(db, "users"), limit(1000)));
    let result = [];
    data.forEach(doc => {
      const docData = doc.data();
      result.push({
        uid: doc.id,
        image: docData.imageURL,
        name: docData.username || docData.name,
        bio: docData.bio || docData.description,
        type: docData.type,
        active: docData.active || docData.members?.join(","),
      });
    });
    console.log(result);
    setData(result || []);
  } catch (err) {
    console.log(err, err.message, "getAllUsers");
    return;
  }
}
export const getChats = async (userId, setData) => {
  try {
    const docs = await getDocs(query(collection(db, "chats"),
      where("participants", "array-contains", userId)
    ));
    let result = [];
    if (!docs.empty) {
      await Promise.all(docs.forEach(async doc => {
        let id;
        if (doc.type === "one-to-one") {
          id = doc.participants.filter(x => x != userId)[0];
        } else if (doc.type === "group") {
          id = doc.groupId;
        }
        const docData = await getDoc(doc(db, "users", id));
        const userData = docData.data();
        const data = {
          uid: docData.id,
          name: userData.username || userData.name,
          image: userData.imageURL,
          bio: userData.bio || userData.description,
          type: userData.type,
          active: userData.active,
          members: userData.members.join(","),
          lastMessage: {
            ...docData.lastMessage
          }
        }
        result.push(data);
      }));
    }
    setData(result);
  } catch (err) {
    console.error(err, err.message, "getMessages");
  }
}

function areArraysEqual(arr1, arr2) {
  return new Set(arr1).size === new Set(arr2).size &&
         arr1.every(value => new Set(arr2).has(value));
}

export const getMessages = async (userId, friendId, type) => {
  try {
    const doc = (await getDocs(query(collection(db, "chats"),
      where("participants", "array-contains-any", [userId, friendId]),
    ))).docs.find(d => areArraysEqual([userId, friendId], d.data().participants));
    let result = [];
    if (doc.exists()) {
      await updateDoc(doc(db, "chats", doc.id), {
        "lastMessage.read": true,
      });
      const msg = getDocs(collection(doc.ref, "messages"));
      msg.forEach(doc =>
      {
        if (doc.exists()) {
          return result.push(doc.data())
        }
      });
    } else {
      await addDoc(collection(doc.ref, "messages"), {
        type,
        participants: [userId, friendId]
      });
    }
    return result;
  } catch (err) {
    console.error(err, err.message, "getMessages");
  }
}
export const sendMessage = async (userId, friendId, msgData) => {
  try {
    const doc = (await getDocs(query(collection(db, "chats"),
      where("participants", "array-contains-any", [userId, friendId]),
    ))).docs.find(d => areArraysEqual([userId, friendId], d.data().participants));
    if (doc.exists()) {
      await updateDoc(doc(db, "chats", doc.id), {
        lastMessage: {
          ...msgData
        }
      });
      await addDoc(collection(doc.ref, "messages"), {
        ...msgData
      });
    }
    return true;
  } catch (err) {
    console.error(err, err.message, "getMessages");
    return false;
  }
}
export const getUserData = async (uid, setUserData = null) => {
  try {
    const dbUser = await getDoc(doc(db, "users", uid));
    const result = dbUser.data();
    setUserData && setUserData(result);
    console.log(result);
    return result;
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
export function getCurrentTime() {
  const date = new Date();
  return date.toLocaleTimeString('en-UK', {
    hour12: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    weekday: 'short',
  });
}


//Wanted to add pagination but jeez the db structure is getting too complicated already🤦‍️

/*async function getInitialUsers() {
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
    console.log(result);
    return result;
  } catch (err) {
    console.log(err, err.message, "getInitialUsers");
    return;
  }
}
async function getNextUsers(lastuser) {
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
    console.log(result);
    return result;
  } catch (err) {
    console.log(err, err.message, "getNextUsers");
    return;
  }
}
export const getDocWithPropertyEqual = async (collection, property, type, value, setData = null) => {
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