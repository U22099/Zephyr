import { Header } from "./chat-components/header";
import { Input } from "@/components/ui/input";
import { Messages } from "./chat-components/messages";
import { useUID, usePage, useSocket } from "@/store";
import { getChats } from "@/utils";
import { useState, useEffect, useMemo } from "react";

export function Chats() {
  const socket = useSocket(state => state.socket);
  const uid = useUID(state => state.uid);
  const page = usePage(state => state.page);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFriendsMemo = useMemo(() => {
    if (!searchQuery) {
      return friends;
    } else {
      return friends.filter(x => x.name?.toLowerCase()?.includes(searchQuery.toLowerCase()));
    }
  }, [friends, searchQuery]);

  const handleRecieveMessage = (data) => { setFriends(prev => prev.map(x => x.uid === data.senderId && x.type === "personal" ? { ...x, lastMessage: data } : x)); }

  const handleGroupRecieveMessage = (data) => { setFriends(prev => prev.map(x => x.uid === data.groupId && x.type === "group" ? { ...x, lastMessage: data } : x)); }

  const handleTypingStatusOn = (data) => {
    setFriends(prev => prev.map(x => {
      if ((x.type === "personal" && data.from === x.uid) || (x.type === "group" && data.to === x.uid)) {
        if (x.type === "group") {
          return { ...x, typing: data.name + " is typing" };
        } else {
          return { ...x, typing: "typing..." };
        }
      } else return x;
    }));
  }

  const handleTypingStatusOff = (data) => {
    setFriends(prev => prev.map(x => {
      if ((x.type === "personal" && data.from === x.uid) || (x.type === "group" && data.to === x.uid)) {
        if (x.type === "group") {
          return { ...x, typing: "" };
        } else {
          return { ...x, typing: "" };
        }
      } else return x;
    }));
  }

  useEffect(() => {
    if (uid) {
      getChats(uid, setFriends);
    }
  }, [uid, page]);

  useEffect(() => {
    setFilteredFriends(filteredFriendsMemo);
  }, [filteredFriendsMemo, searchQuery]);

  useEffect(() => {
    if (friends) {
      friends.forEach(x => {
        if (x.type === "group") {
          socket.emit("join-group", x.uid);
        }
      })
    }
  }, [friends]);

  useEffect(() => {
    if (socket) {
      socket.on("recieve-message", handleRecieveMessage);
      socket.on("group-recieve-message", handleGroupRecieveMessage);
      socket.on("typing-status-on", handleTypingStatusOn);
      socket.on("typing-status-off", handleTypingStatusOff);
      return () => {
        socket.off("group-recieve-message", handleGroupRecieveMessage);
        socket.off("recieve-message", handleRecieveMessage);
      };
    }
  }, [socket]);

  return (
    <main className="flex flex-col w-screen gap-3 p-2 mb-12">
      <Header />
      <h1 className="font-extrabold text-2xl">Chats</h1>
      <Input placeholder="Search..." onChange={(e) => setSearchQuery(e.target.value)}/>
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