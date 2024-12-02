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
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function Messages({ docData }){
  //Trying to create a deep copy of docData
  const doc = JSON.parse(JSON.stringify(docData));
  
  const { toast } = useToast();
  const uid = useUID(state => state.uid);
  const socket = useSocket(state => state.socket);
  const setPage = usePage(state => state.setPage);
  const time = convertToTimeString(doc.lastMessage.timestamp);
  useEffect(() => {
    if (doc.type === "group") {
      socket.emit("join-group", doc.uid);
      socket.on("group-recieve-message", data => {
        doc.lastMessage = {
          ...data
        }
        toast({
          title: doc.name,
          description: `~${data.senderName}: ${data.type === "text" ? data.content : data.type}`
        });
      })
    } else {
      socket.on("recieve-message", data => {
        if (data.senderId === doc.uid) {
          doc.lastMessage = {
            ...data
          }
          toast({
            title: doc.name,
            description: `${data.type === "text" ? data.content : data.type}`
          });
        }
      });
    }
  }, [socket])
  return(
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
      <section className="py-1 h-full flex flex-col justify-center border-b gap-1 w-full">
        <header className="flex gap-1 items-center justify-between">
          <h1 className="text-xl font-bold">{doc.name}</h1>
          {doc.lastMessage&&<p className={(doc.type === "group" ? !doc.lastMessage.read.includes(uid) : !doc.lastMessage.read)&&doc.lastMessage.senderId != uid ? "text-primary font-bold text-sm" : "text-sm"}>{time}</p>}
        </header>
        {doc.lastMessage.type === "text" ? <p className={((doc.type === "group" ? !doc.lastMessage.read.includes(uid) : !doc.lastMessage.read)&&doc.lastMessage.senderId != uid ? "text-primary font-bold " : "") + "w-full truncate text-sm text-muted-foreground"}>{(doc.type === "group")&&!(doc.lastMessage.senderId === uid) ? doc.lastMessage.senderName+": " : (doc.lastMessage.senderId === uid) ? "You: " : ""}{doc.lastMessage.content || ""}</p>
        : ["image", "audio", "video", "raw-file"].includes(doc.lastMessage.type) ? 
        <div className={((doc.type === "group" ? !doc.lastMessage.read.includes(uid) : !doc.lastMessage.read)&&doc.lastMessage.senderId != uid ? "text-primary fill-primary font-bold " : "text-muted-foreground ") + "text-sm flex gap-1 items-center"}>
            {(doc.type === "group")&&!(doc.lastMessage.senderId === uid) ? doc.lastMessage.senderName+": " : (doc.lastMessage.senderId === uid) ? "You: " : ""}{doc.lastMessage.type === "image" ? <FaImage/> : doc.lastMessage.type === "audio" ? <AiFillAudio /> : doc.lastMessage.type === "video" ? <FaVideo /> : <FaFile />}
            <p className="truncate">
              {doc.lastMessage.type === "image" ? "Image" : doc.lastMessage.type === "audio" ? "Audio" : doc.lastMessage.type === "video" ? "Video" : "Document"}
            </p>
          </div> 
          : null
        }
      </section>
    </main>
  )
}