import { db, auth } from "@/firebase";
import {
  collection,
  query,
  limit,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { signOut, deleteUser } from "firebase/auth";
import { saveData } from "@/storage";
import { v4 } from "uuid";
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

export const createNewGroup = async (uid, groupData) => {
  try {
    const data = await uploadFileAndGetURL(groupData.image, "images", "image");
    if (data?.secure_url || !groupData.image) {
      const id = v4();
      await setDoc(doc(db, "users", id), {
        name: groupData.name,
        imageURL: data?.secure_url || null,
        imagePublicId: data?.public_id || null,
        type: "group",
        admin: uid,
        description: groupData.description,
        members: groupData.members,
      });
      await addDoc(collection(db, "chats"), {
        groupId: id,
        type: "group",
        participants: [...groupData.participants]
      });
      return {
        uid: id,
        name: groupData.name,
        imageURL: data?.secure_url || null,
        imagePublicId: data?.public_id || null,
        type: "group",
        admin: uid,
        members: groupData.members.join(","),
        description: groupData.description,
        participants: [...groupData.participants]
      }
    }
  } catch (err) {
    console.log(err, err.message, "createNewGroup");
  }
}

export const updateGroupMembers = async (groupId, group) => {
  try {
    await setDoc(doc(db, "chats", groupId), {
      ...group
    }, { merge: true });
    return true;
  } catch (err) {
    console.log(err, err.message);
    return;
  }
}

export const getPeople = async (uid, setData) => {
  try {
    const data = await getDocs(query(collection(db, "users"), where("type", "==", "personal"), limit(1000)));
    let result = [];
    data.forEach(doc => {
      const docData = doc.data();
      result.push({
        uid: doc.id,
        image: docData.imageURL,
        name: docData.username,
        bio: docData.bio,
        type: docData.type,
      });
    });
    console.log(result);
    setData(result?.filter(x => x.uid != uid) || []);
  } catch (err) {
    console.log(err, err.message, "getPeople");
    return;
  }
}

export const getAllUsers = async (uid, setData) => {
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
        active: docData.active || docData.members,
      });
    });
    console.log(result);
    setData(result?.filter(x => x.uid != uid) || []);
  } catch (err) {
    console.log(err, err.message, "getAllUsers");
    return;
  }
}
export const getChats = async (userId, setData) => {
  try {
    const documents = await getDocs(query(collection(db, "chats"),
      where("participants", "array-contains", userId)
    ));
    let result = [];
    if (!documents?.empty && documents) {
      await Promise.all(documents.docs.map(async document => {
        let id = "";
        if (document.data().type === "personal") {
          id = document.data().participants.find(x => x != userId);
        } else if (document.data().type === "group") {
          id = document.data().groupId;
        }
        const docData = await getDoc(doc(db, "users", id));
        if (docData.exists()) {
          const userData = docData.data();
          const data = {
            uid: docData.id,
            name: userData.username || userData.name,
            image: userData.imageURL,
            bio: userData.bio || userData.description,
            type: userData.type,
            active: userData.active,
            admin: userData.admin,
            members: userData.members?.join(","),
            lastMessage: document.data().lastMessage || {}
          }
          result.push(data);
        }
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

async function findFriend(userId, friendId) {
  return (await getDocs(query(collection(db, "chats"),
    where("participants", "array-contains-any", [userId, friendId]),
  ))).docs.find(d => areArraysEqual([userId, friendId], d.data().participants) || d.data().groupId === friendId)
}

export const getMessages = async (userId, friendId, type) => {
  try {
    const chatDoc = await findFriend(userId, friendId);
    let result = [];
    if (chatDoc?.exists()) {
      if (chatDoc.data().lastMessage && chatDoc.data().lastMessage.senderId !== userId) {
        await updateDoc(doc(db, "chats", chatDoc.id), {
          "lastMessage.read": true,
        });
      }
      const msg = await getDocs(collection(chatDoc.ref, "messages"));
      if (!msg?.empty) {
        msg.docs.forEach(doc =>
        {
          if (doc.exists()) {
            return result.push(doc.data())
          }
        });
      }
    } else {
      await addDoc(collection(db, "chats"), {
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
    const chatDoc = await findFriend(userId, friendId);
    if (chatDoc?.exists()) {
      await updateDoc(doc(db, "chats", chatDoc.id), {
        lastMessage: {
          ...msgData
        }
      });
      await addDoc(collection(chatDoc.ref, "messages"), {
        ...msgData
      });
      return true;
    }
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
export const deleteConversation = async (userId, friendId) => {
  const chatDoc = await findFriend(userId, friendId);
  await deleteDoc(chatDoc.ref);
}
export const leaveGroup = async (userId, groupId, name) => {
  const chatDoc = await findFriend(userId, groupId);
  await updateDoc(chatDoc.ref, {
    participants: [...chatDoc.data().participants.filter(x => x != userId)],
    members: [...chatDoc.data().members.filter(x => x != name)]
  });
}
export const logOut = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully.");
  } catch (error) {
    console.error("Error signing out:", error);
  }
}
export const deleteAccount = async (uid, name) => {
  try {
    const user = auth.currentUser;
    if (user) {
      await deleteUser(user);
      await deleteDoc(doc(db, "users", uid));
      const docs = await getDocs(query(collection(db, "chats"), where("participants", "array-contains", uid)));
      await Promise.all(docs.docs.map(async doc => {
        if (doc.data().type === "personal") {
          await deleteDoc(doc.ref);
        } else {
          await updateDoc(doc.ref, {
            participants: [
              ...doc.data().participants.filter(x => x != uid)
            ],
            members: [
              ...doc.data().members.filter(x => x != name)
            ]
          })
        }
      }));
      console.log("User deleted successfully.");
    } else {
      console.error("No user is currently signed in.");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
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
  const fileObj = (await axios.post("/api/file",
  {
    file,
    folder,
    type
  })).data;
  return fileObj.fileURL;
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
  const aDay = 24 * 60 * 60 * 1000;
  const diff = Date.now() - timestamp;

  if (diff > aDay) {
    if (diff < 2 * aDay) {
      return "Yesterday";
    } else if (diff < 7 * aDay) {
      return new Date(timestamp).toLocaleString("en-UK", { weekday: "long" });
    } else {
      return new Date(timestamp).toLocaleDateString("en-UK", { day: "numeric", month: "numeric", year: "2-digit" });
    }
  } else {
    return new Date(timestamp).toLocaleTimeString("en-UK", { hour12: true, hour: "numeric", minute: "numeric" });
  }
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