import { motion } from "framer-motion";
import { usePage, useSocket, useUID, useUserData } from "@/store";
import { FaChevronLeft } from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { HiOutlinePhone } from "react-icons/hi";
import { IoVideocamOutline } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { sendMessage, getMessages, convertToTimeString, uploadFileAndGetURL, toBase64 } from "@/utils";
import { useToast } from "@/hooks/use-toast";

export function Chat() {
  const component = useRef(false);
  const main = useRef();
  const { toast } = useToast();
  const uid = useUID(state => state.uid);
  const userData = useUserData(state => state.userData);
  const { setPage, page } = usePage();
  const [ msg, setMsg ] = useState([]);
  const [ input, setInput ] = useState("");
  const socket = useSocket(state => state.socket);
  const scrollDown = () => {
    //if((page.data.type === "group") && (msg&&msg[msg?.length-1]?.senderId != uid)) return;
    const body = document.getElementById("scroll");
    body.scrollIntoView({
      behavior: "smooth"
    })
  }
  const sendMsg = async (arg = null) => {
    try {
      let msgData
      if(!arg){
        msgData = {
          content: input,
          read: false,
          type: "text",
          senderId: uid,
          timestamp: Date.now(),
        }
      } else if (arg.type === "raw-file"){
        msgData = {
          content: arg.data,
          read: false,
          type: arg.type,
          senderId: uid,
          timestamp: Date.now(),
        }
      } else {
        try{
          setMsg([...msg, {
            content: "uploading...",
            type: "upload",
            senderId: uid,
          }]);
          const fileUrl = await uploadFileAndGetURL(arg.data, "files", arg.type);
          msgData = {
            content: fileUrl,
            read: false,
            type: arg.data.split(",")[0].split(";")[0].split(":")[1].split("/")[0],
            senderId: uid,
            timestamp: Date.now(),
          }
          setMsg(msg.filter(x => x.type != "upload"));
        } catch(err){
          console.log(err.message);
          return;
        }
      }
      setInput("");
      if(page.data.type === "group"){
        msgData.senderName = userData.username;
        msgData.read = [uid];
      }
      setMsg([...msg, msgData]);
      await sendMessage(uid, page.data.uid, msgData);
      if(page.data.type === "group"){
        socket.emit("group-send-message", {
          groupId: page.data.uid,
          data: msgData,
        })
      } else {
        socket.emit("send-message", {
          to: page.data.uid,
          from: uid,
          data: msgData
        });
      }
    } catch (err) {
      console.log(err, err.message, "send message");
    }
  } 
  useEffect(() => {
    if(msg.length > 1){
      scrollDown();
    }
  }, [msg]);
  useEffect(() => {
    if(page.data.type === "group"){
      socket.emit("join-group", page.data.uid);
      socket.on("group-recieve-message", data => {
        setMsg([...msg, data]);
      })
    } else {
      socket.on("recieve-message", data => {
        if(data.senderId === page.data.uid){
          setMsg([...msg, data]);
        }
      });
    }
  }, [socket]);
  useEffect(() => {
    const fetchMsgs = async () => {
      try{
        const result = (await getMessages(uid, page.data.uid, page.data.type)) || [];
        setMsg([...result.sort((a, b) => a.timestamp - b.timestamp)]);
      } catch(err){
        console.log(err, err.message, "fetchMsgs")
      }
    }
    if(!component.current){
      fetchMsgs();
      component.current = true;
    }
  }, []);
  return (
    <motion.main className="w-full h-full flex flex-col" initial={{x: 300}} animate={{x: 0}} exit={{x: 300}} transition={{duration: 0.3}}>
      <header className="sticky top-0 left-0 w-full flex gap-3 px-2 backdrop-blur-sm pb-2 border-b z-10 items-center text-center pt-1 justify-start">
        <FaChevronLeft className="self-center dark:fill-white fill-black w-7 h-7" onClick={() => setPage({open: false, component: 'default'})}/>
        <section className="flex items-center gap-2 max-w-[70%]">
          <Avatar className="w-12 h-12">
            <AvatarImage className="w-12 h-12 object-cover rounded-full" src={page.data.image} alt="profile-image"/>
            <AvatarFallback className="text-3xl text-primary">{page.data.name ? page.data.name[0] : "Z"}</AvatarFallback>
          </Avatar>
          <section className="py-1 h-full flex flex-col items-start justify-start gap-1 w-full active:text-muted-foreground" onClick={() => setPage({open: true, component: "chat-profile", data: {...page.data}})}>
              <h1 className="text-xl font-bold truncate w-32">{page.data.name}</h1>
              <p className="text-sm text-muted-foreground truncate w-40">{page.data.type === "personal" ? (page.data.active === "online" ? "online" : `last seen at ${convertToTimeString(page.data.active)}`) : page.data.members.join(",")}</p>
          </section>
        </section>
        <HiOutlinePhone className="self-center dark:stroke-white stroke-black w-8 h-8"/>
        <IoVideocamOutline className="self-center dark:stroke-white stroke-black w-10 h-10"/>
      </header>
      <main className="flex flex-col gap-2 w-full p-2 mb-16 h-full overflow-y-scroll scrollbar">
        {msg&&msg.map((doc, i) => <Message key={i} m={doc} type={page.data.type} uid={uid}/>)}
        {/*For scrolling*/}
        <div id="scroll"></div>
      </main>
      <footer className="flex items-center gap-2 fixed bottom-0 backdrop-blur-sm pt-2 border-t z-10 w-full mx-auto p-3">
        <label htmlFor="file">
          <FaPlus className="fill-primary text-xl" />
        </label>
        <input type="file" accept=".png, .jpg, .jpeg, .mp4, .mov, .wav, .mp3, .pdf" hidden id="file" onChange={async (e) => {if(e.target.files[0]){
          if(e.target.files[0].size > (20 * 1024 * 1024)){
            toast({
              description: "File size is too large, pick a file less than 20mb"
            });
            return;
          }
          const data = await toBase64(e.target.files[0]);
          const dataType = data.split(",")[0].split(";")[0].split(":")[1].split("/")[0];
          const isRawFile = !["image", "video", "audio"].includes(dataType);
          const isNotAudio = ["image", "video"].includes(dataType);
          if(isRawFile && e.target.files[0].size > (5 * 1024 * 1024)){
            toast({
              description: "Raw files' sizes must be less than 5mb"
            });
            return;
          }
          await sendMsg({
            data,
            type: isRawFile ? "raw-file" : isNotAudio ? dataType : "video",
          });
        }}}/>
        <Input placeholder="Type in message" value={input} onChange={(e) => setInput(e.target.value)}/>
        <Button onClick={async () => {if(input){await sendMsg()}}}><IoSend /></Button>
      </footer>
    </motion.main>
  )
}

const Message = ({ m, type, uid }) => {
  return(
    <main className={"flex w-full items-center " + (m.senderId === uid ? "justify-end text-end" : "justify-start text-start")}>
      <Card className="flex flex-col gap-1 w-fit justify-center items-start p-2 min-w-[20%]">
        {type === "group" && <CardHeader className="w-full flex justify-start p-0">
          <p className="w-24 truncate text-muted-foreground text-sm">~{m.senderName}</p>
        </CardHeader>}
        <CardContent className="flex justify-start items-center p-0.5 w-fit h-fit">
          {m.type === "upload" ? 
          <p className="text-primary font-bold animate-pulse">{m.content}</p> : 
          m.type === "text" ? 
          <p>{m.content}</p> : 
          m.type === "image" ? 
          <img className="rounded h-60 w-60 object-cover" src={m.content?.secure_url} /> : 
          m.type === "video" ? 
          <video className="rounded h-60 w-60 object-cover" controls src={m.content?.secure_url} /> : 
          m.type === "audio" ? 
          <audio controls src={m.content?.url} /> : 
          m.type === "raw-file" ? 
          <embed onClick={() => {
            const linkTag = document.createElement("a");
            linkTag.href = m.content;
            linkTag.target = "_blank";
            linkTag.click();
          }} className="rounded h-60 w-60 object-cover" src={m.content} /> : null}
        </CardContent>
        <CardFooter className="flex p-0 justify-end">
          <p className="text-xs text-muted-foreground">{(m.type === "upload") ? "please wait" : convertToTimeString(m.timestamp)}</p>
        </CardFooter>
      </Card>
    </main>
  )
}