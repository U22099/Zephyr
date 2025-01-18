import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { usePage, useUID, useDraft } from "@/store";
import { convertToTimeString } from "@/utils";
import { FaImage, FaVideo, FaFile } from "react-icons/fa6";
import { AiFillAudio } from "react-icons/ai";
import { useEffect, useState } from "react";

export function Messages({ doc }) {
  const uid = useUID(state => state.uid);
  const draft = useDraft(state => state.draft);
  const setPage = usePage(state => state.setPage);
  const [messageDraft, setMessageDraft] = useState(
      draft.find(x => x.uid === doc.uid.slice(-6)) || null
    )
  const [time, setTime ] = useState(
    doc.lastMessage.timestamp ? convertToTimeString(doc.lastMessage.timestamp) : "New");
    
    
  useEffect(() => {
    setMessageDraft(draft.find(x => x.uid === doc.uid.slice(-6)) || null);
  }, [draft]);
  
  useEffect(() => {
    setTime(doc.lastMessage.timestamp ? convertToTimeString(doc.lastMessage.timestamp) : "New");
  }, [doc.lastMessage.time]);

  return (
    <main className="flex gap-2 active:bg-muted w-full p-1 rounded cursor-pointer" onClick={() => setPage({
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
          { (doc.lastMessage !== {}) &&<p className={(doc.type === "group" ? !doc.lastMessage.read.includes(uid) : !doc.lastMessage.read)&&doc.lastMessage.senderId !== uid ? "text-primary font-bold text-sm" : "text-sm"}>{time}</p>}
        </header>
    {!(messageDraft&&messageDraft.content) ? doc.lastMessage !== {} && ( 
      doc.lastMessage.type === "text" ? <p className={((doc.type === "group" ? !doc.lastMessage.read.includes(uid) : !doc.lastMessage.read)&&doc.lastMessage.senderId !== uid ? "text-primary font-bold " : doc.typing ? "italic " : "") + "w-48 truncate text-sm text-muted-foreground"}>{doc.typing ? doc.typing : (doc.type === "group")&&!(doc.lastMessage.senderId === uid) ? doc.lastMessage.senderName+": " : (doc.lastMessage.senderId === uid) ? "You: " : ""}{!doc.typing ? doc.lastMessage.content || "" : ""}</p> :
        ["image", "audio", "video", "raw-file"].includes(doc.lastMessage.type) ?
        <div className={((doc.type === "group" ? !doc.lastMessage.read.includes(uid) : !doc.lastMessage.read)&&doc.lastMessage.senderId !== uid ? "text-primary fill-primary font-bold " : "text-muted-foreground ") + "text-sm flex gap-1 items-center"}>
            {(doc.type === "group")&&!(doc.lastMessage.senderId === uid) ? doc.lastMessage.senderName+": " : (doc.lastMessage.senderId === uid) ? "You: " : ""}{doc.lastMessage.type === "image" ? <FaImage/> : doc.lastMessage.type === "audio" ? <AiFillAudio /> : doc.lastMessage.type === "video" ? <FaVideo /> : <FaFile />}
            <p className="truncate">
              {doc.lastMessage.type === "image" ? "Image" : doc.lastMessage.type === "audio" ? "Audio" : doc.lastMessage.type === "video" ? "Video" : "Raw File"}
            </p>
          </div> :
        null) : <div className="flex gap-1.5 items-center text-sm"><span className="text-primary font-bold">Draft:</span><span className="w-40 truncate text-muted-foreground">{messageDraft.content}</span></div>
    }
    </section> 
  </main>
  )
}