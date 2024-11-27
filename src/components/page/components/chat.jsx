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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { sendMessage, getMessages, convertToTimeString } from "@/utils";

export function Chat() {
  const uid = useUID(state => state.uid);
  const userData = useUserData(state => state.userData);
  const { setPage, page } = usePage();
  const [ msg, setMsg ] = useState([]);
  const [ input, setInput ] = useState("");
  const socket = useSocket(state => state.socket);
  const sendMsg = async () => {
    try {
      const msgData = {
        content: input,
        type: "text",
        senderId: uid,
        timestamp: Date.now(),
      }
      console.log(msgData);
      if(page.data.type === "group"){
        msgData.senderName = userData.username;
      }
      setMsg([...msg, msgData]);
      await sendMessage(uid, page.data.uid, msgData);
      socket.emit("send-message", {
        to: page.data.uid,
        from: uid,
        data: msgData
      });
    } catch (e) {
      throw e
    }
  } 
  useEffect(() => {
    socket.on("recieve-message", data => {
      if(data.senderId === page.data.uid) setMsg([...msg, data]);
    });
  }, [socket]);
  useEffect(() => {
    const fetchMsgs = async () => {
      const result = await getMessages(uid, page.data.uid, page.data.type);
      setMsg([...result?.sort((a, b) => a.timestamp - b.timestamp)] || []);
    }
    fetchMsgs();
  });
  return (
    <motion.main initial={{x: 300}} animate={{x: 0}} exit={{x: 300}} transition={{duration: 0.3}}>
      <header className="sticky top-0 left-0 w-full grid grid-cols-12 backdrop-blur-sm pb-2 border-b z-10 text-center items-center justify-center">
        <FaChevronLeft className="self-center dark:fill-white fill-black w-8 h-8 col-span-2 ml-2" onClick={() => setPage({open: false, component: 'default'})}/>
        <section className="flex items-center gap-2 col-span-6">
          <Avatar className="w-12 h-12">
            <AvatarImage className="w-12 h-12 object-cover rounded-full" src={page.data.image} alt="profile-image"/>
            <AvatarFallback className="text-3xl text-primary">{page.data.name ? page.data.name[0] : "Z"}</AvatarFallback>
          </Avatar>
          <section className="py-1 h-full flex flex-col items-start justify-center gap-1 w-full">
              <h1 className="text-xl font-bold">{page.data.name}</h1>
              <p className="text-sm text-muted-foreground">{page.data.active || page.data.members}</p>
          </section>
        </section>
        <HiOutlinePhone className="self-center dark:stroke-white stroke-black w-8 h-8 col-span-2"/>
        <IoVideocamOutline className="self-center dark:stroke-white stroke-black w-8 h-8 col-span-2 text-lg"/>
      </header>
      <main className="flex flex-col gap-2 w-full p-3">
        {msg.map((doc, i) => <Message key={i} m={doc} type={page.data.type} />)}
      </main>
      <footer className="flex gap-2 fixed bottom-2 backdrop-blur-sm pt-2 border-t z-10 w-full mx-auto p-3">
        <Input placeholder="Type in message" value={input} onChange={(e) => setInput(e.target.value)}/>
        <Button onClick={sendMsg}><IoSend /></Button>
      </footer>
    </motion.main>
  )
}

const Message = ({ key, m, type }) => {
  return(
    <Card key={key} className={"flex flex-col gap-1 w-fit justify-center items-start" + (m.senderId === uid ? "self-end" : "self-start")}>
      {type === "group" && <CardHeader>
        <p className="truncate text-muted-foreground text-sm">~{m.senderName}</p>
      </CardHeader>}
      <CardContent className="flex justify-center items-center p-2 w-fit h-fit">
        {m.type === "text" ? 
        <p>{m.content}</p> : 
        m.type === "image" ? 
        <img className="rounded h-40 w-40 object-cover" src={m.content} /> : 
        m.type === "video" ? 
        <video className="rounded h-40 w-40 object-cover" controls src={m.content} /> : 
        m.type === "file" ? 
        <embed className="rounded h-40 w-40 object-cover" src={m.content} /> : null}
      </CardContent>
      <CardFooter className="flex justify-end">
        <p className="text-xs text-muted-foreground">{convertToTimeString(m.timestamp)}</p>
      </CardFooter>
    </Card>
  )
}