import { Header } from "./chat-components/header";
import { Input } from "@/components/ui/input";
import { Messages } from "./chat-components/messages";
import { useUID, usePage } from "@/store";
import { getChats } from "@/utils";
import { useState, useEffect } from "react";

export function Chats() {
  const uid = useUID(state => state.uid);
  const page = usePage(state => state.page);
  const [ filteredFriends, setFilteredFriends ] = useState([]);
  const [ friends, setFriends ] = useState([]);
  useEffect(() => {
    if(uid){
      getChats(uid, setFriends);
    }
  }, [uid, page]);
  useEffect(() => {
    setFilteredFriends([...friends]);
  }, [friends]);
  return (
    <main className="flex flex-col w-screen gap-3 p-2">
      <Header />
      <h1 className="font-extrabold text-2xl">Chats</h1>
      <Input placeholder="Search..." onChange={(e) => {
        if(!e.target.value) setFilteredFriends([...friends])
      setFilteredFriends(friends.filter(x => x.name.toLowerCase().includes(e.target.value.toLowerCase())))}
      }/>
      {filteredFriends&&filteredFriends.sort((a,b) => a.lastMessage.timestamp - b.lastMessage.timestamp).map((doc, i) => <Messages key={i} doc={doc}/>)}
    </main>
  )
}