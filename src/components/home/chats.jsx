import { Header } from "./chat-components/header";
import { Input } from "@/components/ui/input";
import { Messages } from "./chat-components/messages";
import { useUID, useUserData } from "@/store";
import { getData } from "@/utils";
import { useState, useEffect } from "react";

export function Chats() {
  const userData = useUserData(state => state.userData);
  const uid = useUID(state => state.uid);
  return (
    <main className="flex flex-col w-screen gap-3 p-2">
      <Header />
      <h1 className="font-extrabold text-2xl">Chats</h1>
      <Input placeholder="Search..."/>
      {userData.friendsData&&userData.friendsData.map((x, i) => <Messages key={i} username={x.username} lastMessage={x.lastMessage} time={x.timeStamp} image={x.image}/>)}
    </main>
  )
}