import { Header } from "./chat-components/header";
import { Input } from "@/components/ui/input";
import { Messages } from "./chat-components/messages";
import { useUID, usePage, useSocket } from "@/store";
import { getChats } from "@/utils";
import { useState, useEffect } from "react";

export function Chats() {
  const socket = useSocket(state => state.socket);
  const uid = useUID(state => state.uid);
  const page = usePage(state => state.page);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [friends, setFriends] = useState([]);

  const handleRecieveMessage = (data) => { setFriends(prev => prev.map(x => x.uid === data.senderId && x.type === "personal" ? { ...x, lastMessage: data } : x)); }

  const handleGroupRecieveMessage = (data) => { setFriends(prev => prev.map(x => x.uid === data.groupId && x.type === "group" ? { ...x, lastMessage: data } : x)); }

  useEffect(() => {
    if (uid) {
      getChats(uid, setFriends);
    }
  }, [uid, page]);

  useEffect(() => {
    console.log(friend);
    setFilteredFriends([...friends]);
  }, [friends]);

  useEffect(() => {
    console.log(filteredFriends);
  }, [filteredFriends]);

  useEffect(() => {
    if(friends){
      friends.forEach(x => {
        if(x.type === "group"){
          socket.emit("join-group", x.uid);
        }
      })
    }
  }, [friends]);
  
  useEffect(() => {
    socket.on("recieve-message", handleRecieveMessage);
    socket.on("group-recieve-message", handleGroupRecieveMessage);

    return () => {
      socket.off("group-recieve-message", handleGroupRecieveMessage);
      socket.off("recieve-message", handleRecieveMessage);
    };
  }, [socket]);

  return (
    <main className="flex flex-col w-screen gap-3 p-2 mb-12">
      {/*<Header />
      <h1 className="font-extrabold text-2xl">Chats</h1>
      <Input placeholder="Search..." onChange={(e) => {
        if(!e.target.value) { setFilteredFriends([...friends]);
        } else {
          setFilteredFriends([...friends.filter(x => x.name?.toLowerCase()?.includes(e.target.value.toLowerCase()))]);
        }} 
      }/>*/}
      <section className="flex flex-col w-full gap-1">
        {filteredFriends&&filteredFriends.sort((a,b) => {
              const tA = a.lastMessage?.timestamp || 0;
              const tB = b.lastMessage?.timestamp || 0;
              return tB-tA;
            }).map((doc, i) => <Messages key={i} doc={doc}/>)}
      </section>
    </main>
  )
}