import { Header } from "./chat-components/header";
import { Input } from "@/components/ui/input";
import { Messages } from "./chat-components/messages";
import { useUID, usePage, useSocket } from "@/store";
import { getChats } from "@/utils";
import { useState, useEffect } from "react";

export function Chats() {
  //const socket = useSocket(state => state.socket);
  const uid = useUID(state => state.uid);
  const page = usePage(state => state.page);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [friends, setFriends] = useState([]);
  useEffect(() => {
    if (uid) {
      getChats(uid, setFriends);
    }
  }, [uid, page]);
  useEffect(() => {
    setFilteredFriends([...friends]);
  }, [friends]);
  /*useEffect(() => {
  const updateFriendLastMessage = (data) => {
    setFriends((prev) => prev.map((x) => {
      if ((x.uid === data.senderId || x.uid === data.groupId) && (x.type === "personal" || x.type === "group")) {
        x.lastMessage = { ...data };
        return x;
      } else {
        return x;
      }
    }));
  };

  socket.on("recieve-message", updateFriendLastMessage);
  socket.on("group-recieve-message", updateFriendLastMessage);

  return () => {
    socket.off("recieve-message", updateFriendLastMessage);
    socket.off("group-recieve-message", updateFriendLastMessage);
  };
}, [socket]);*/
  return (
    <main className="flex flex-col w-screen gap-3 p-2 mb-12">
      <Header />
      <h1 className="font-extrabold text-2xl">Chats</h1>
      <Input placeholder="Search..." onChange={(e) => {
        if(!e.target.value) setFilteredFriends([...friends])
      setFilteredFriends(friends.filter(x => x.name.toLowerCase().includes(e.target.value.toLowerCase())))}
      }/>
      {filteredFriends&&filteredFriends.sort((a,b) => (b.lastMessage.timestamp || 0) - (a.lastMessage.timestamp || 0)).map((doc, i) => <Messages key={i} docData={doc}/>)}
    </main>
  )
}