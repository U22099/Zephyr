import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { usePage, useUID } from "@/store";
import { convertToTimeString } from "@/utils";
import { FaImage, FaVideo, FaFile } from "react-icons/fa6";
import { AiFillAudio } from "react-icons/ai";

export function Messages({ doc }){
  const uid = useUID(state => state.uid);
  const setPage = usePage(state => state.setPage);
  const time = convertToTimeString(doc.lastMessage.timeStamp);
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
          <p className={!doc.lastMessage.read&&doc.lastMessage.senderId != uid ? "text-primary font-bold text-sm" : "text-sm"}>{time}</p>
        </header>
        {doc.lastMessage.type === "text" ? <p className={(!doc.lastMessage.read&&doc.lastMessage.senderId != uid ? "text-primary font-bold " : "") + "truncate text-sm text-muted-foreground"}>{doc.type === "group" ? doc.lastMessage.senderName+": " : doc.senderId === uid ? "You: " : ""}{doc.lastMessage.content}</p>
        : ["image", "audio", "video", "file"].includes(doc.lastMessage.type) ? 
        <div className={(!doc.lastMessage.read&&doc.lastMessage.senderId != uid ? "text-primary fill-primary font-bold " : "text-muted-foreground ") + "text-sm flex gap-1"}>
            {doc.type === "group" ? doc.lastMessage.senderName+": " : doc.senderId === uid ? "You: " : ""}{doc.lastMessage.type === "image" ? <FaImage/> : doc.lastMessage.type === "audio" ? <AiFillAudio /> : doc.lastMessage.type === "video" ? <FaVideo /> : <FaFile />}
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