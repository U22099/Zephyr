import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { usePage, useUID, useSocket } from "@/store";
import { convertToTimeString } from "@/utils";
import { FaImage, FaVideo, FaFile } from "react-icons/fa6";
import { AiFillAudio } from "react-icons/ai";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

export function Messages({ docData }) {
  //Trying to create a deep copy of docData
  const doc = JSON.parse(JSON.stringify(docData));
  const [ lastMessage, setLastMessage ] = useState({
    ...doc.lastMessage
  });
  const { toast } = useToast();
  const uid = useUID(state => state.uid);
  const socket = useSocket(state => state.socket);
  const setPage = usePage(state => state.setPage);
  const time = doc.lastMessage ? convertToTimeString(doc.lastMessage.timestamp) : "";
  useEffect(() => {
  const handleIncomingVoiceCall = (data) => {
    if(data.from === doc.uid){
      setPage({ 
        open: true, 
        component: "voice-call", 
        data: {
        ...data,
        doc,
        incoming: true,
      }});
    }
  };

  const handleIncomingVideoCall = (data) => {
    if(data.from === doc.uid){
      setPage({ 
        open: true, 
        component: "video-call", 
        data: {
        ...data,
        doc,
        incoming: true,
      }});
    }
  };

  const handleGroupRecieveMessage = (data) => {
    setLastMessage({ ...data });
    toast({
      title: doc.name,
      description: `~${data.senderName}: ${data.type === "text" ? (data.content.length > 70 ? `${data.content.slice(0, 70)}...` : data.content) : data.type}`,
    });
  };

  const handleRecieveMessage = (data) => {
    if (data.senderId === doc.uid) {
      setLastMessage({ ...data });
      toast({
        title: doc.name,
        description: `${data.type === "text" ? (data.content.length > 70 ? `${data.content.slice(0, 70)}...` : data.content) : data.type}`,
      });
    }
  };

  socket.on("incoming-voice-call", handleIncomingVoiceCall);
  socket.on("incoming-video-call", handleIncomingVideoCall);
  socket.on("group-incoming-voice-call", handleIncomingVoiceCall);
  socket.on("group-incoming-video-call", handleIncomingVideoCall);

  if (doc.type === "group") {
    socket.emit("join-group", doc.uid);
    socket.on("group-recieve-message", handleGroupRecieveMessage);
  } else {
    socket.on("recieve-message", handleRecieveMessage);
  }

  return () => {
    socket.off("incoming-voice-call", handleIncomingVoiceCall);
    socket.off("incoming-video-call", handleIncomingVideoCall);
    socket.off("group-incoming-voice-call", handleIncomingVoiceCall);
    socket.off("group-incoming-video-call", handleIncomingVideoCall);
    socket.off("group-recieve-message", handleGroupRecieveMessage);
    socket.off("recieve-message", handleRecieveMessage);
  };
}, [socket, doc.uid, doc.type]);
  return (
    <main className="flex gap-2 active:bg-gray-800 w-full" onClick={() => setPage({
      open: true,
      component: "chat",
      data: {
        ...doc
      }
    })}>
      <Avatar className="w-16 h-16">
        <AvatarImage className="w-16 h-16 object-cover rounded-full" src={doc.image} alt="profile-image"/>
        <AvatarFallback className="text-3xl text-primary">{doc.name ? doc.name[0] : "Z"}</AvatarFallback>
      </Avatar> 
      <section className="py-1 h-full flex flex-col justify-center border-b gap-1 w-full" >
    <header className="flex gap-1 items-center justify-between">
          <h1 className="text-xl font-bold w-48 truncate">{doc.name}</h1>
          { (lastMessage != {}) &&<p className={(doc.type === "group" ? !lastMessage.read.includes(uid) : !lastMessage.read)&&lastMessage.senderId != uid ? "text-primary font-bold text-sm" : "text-sm"}>{time}</p>}
        </header>
    {lastMessage != {} && (
      lastMessage.type === "text" ? <p className={((doc.type === "group" ? !lastMessage.read.includes(uid) : !lastMessage.read)&&lastMessage.senderId != uid ? "text-primary font-bold " : "") + "w-48 truncate text-sm text-muted-foreground"}>{(doc.type === "group")&&!(lastMessage.senderId === uid) ? lastMessage.senderName+": " : (lastMessage.senderId === uid) ? "You: " : ""}{lastMessage.content || ""}</p> :
        ["image", "audio", "video", "raw-file"].includes(lastMessage.type) ?
        <div className={((doc.type === "group" ? !lastMessage.read.includes(uid) : !lastMessage.read)&&lastMessage.senderId != uid ? "text-primary fill-primary font-bold " : "text-muted-foreground ") + "text-sm flex gap-1 items-center"}>
            {(doc.type === "group")&&!(lastMessage.senderId === uid) ? lastMessage.senderName+": " : (lastMessage.senderId === uid) ? "You: " : ""}{lastMessage.type === "image" ? <FaImage/> : lastMessage.type === "audio" ? <AiFillAudio /> : lastMessage.type === "video" ? <FaVideo /> : <FaFile />}
            <p className="truncate">
              {lastMessage.type === "image" ? "Image" : lastMessage.type === "audio" ? "Audio" : lastMessage.type === "video" ? "Video" : "Raw File"}
            </p>
          </div> :
        null)
    }
    </section> 
  </main>
  )
}