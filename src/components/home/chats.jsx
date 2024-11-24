import { Header } from "./chat-components/header";
import { Input } from "@/components/ui/input";
import { Messages } from "./chat-components/messages";
import { useUID } from "@/store";
import { getChats } from "@/utils";
import { useState, useEffect } from "react";

export function Chats() {
  const [ friends, setFriends ] = useState([]);
  const uid = useUID(state => state.uid);
  useEffect(() => {
    if(uid){
      getChats(uid, setFriends);
    }
  }, [uid]);
  return (
    <main className="flex flex-col w-screen gap-3 p-2">
      <Header />
      <h1 className="font-extrabold text-2xl">Chats</h1>
      <Input placeholder="Search..."/>
      {friends&&friend.map((doc, i) => <Messages key={i} doc={doc}/>)}
    </main>
  )
}