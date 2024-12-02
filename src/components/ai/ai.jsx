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
import { sendAIMessage, getAIMessages, convertToTimeString, toBase64 } from "@/utils";
import { useToast } from "@/hooks/use-toast";

export function Chat() {
  const component = useRef(false);
  const main = useRef();
  const { toast } = useToast();
  const uid = useUID(state => state.uid);
  const userData = useUserData(state => state.userData);
  const [msg, setMsg] = useState([]);
  const [input, setInput] = useState("");
  const socket = useSocket(state => state.socket);
  const scrollDown = () => {
    const body = document.getElementById("scroll");
    body.scrollIntoView({
      behavior: "smooth"
    })
  }
  const sendMsg = async () => {
    try {
      let msgData = {
        parts: [{text: input}],
        model: "user",
      }
      setInput("");
      setMsg([...msg, msgData, {
        content: "Processing...",
        model: "loading",
      }]);
      const response = await sendAIMessage(uid, userData.username, msgData);
      setMsg([...msg.filter(x => x.model === "loading"), response]);
    } catch (err) {
      console.log(err, err.message, "send message");
    }
  }
  useEffect(() => {
    if (msg.length > 1) {
      scrollDown();
    }
  }, [msg]);
  useEffect(() => {
    const fetchMsgs = async () => {
      try {
        const result = (await getAIMessages(uid)) || [];
        setMsg([...result]);
      } catch (err) {
        console.log(err, err.message, "fetchMsgs")
      }
    }
    if (!component.current) {
      fetchMsgs();
      component.current = true;
    }
  }, []);
  return (
    <motion.main className="w-full h-full flex flex-col" initial={{x: 300}} animate={{x: 0}} exit={{x: 300}} transition={{duration: 0.3}}>
      <main className="flex flex-col gap-2 w-full p-2 mb-16 h-full overflow-y-scroll scrollbar">
        {msg&&msg.map((doc, i) => <Message key={i} m={doc}/>)}
        {/*For scrolling*/}
        <div id="scroll"></div>
      </main>
      <footer className="flex items-center gap-2 fixed bottom-0 backdrop-blur-sm pt-2 border-t z-10 w-full mx-auto p-3">
        {/*<label htmlFor="file">
          <FaPlus className="fill-primary text-xl" />
        </label>
        <input type="file" accept=".png, .jpg, .jpeg, .mp4, .mov, .wav, .mp3, .pdf" hidden id="file" onChange={async (e) => {if(e.target.files[0]){
          if(e.target.files[0].size > (5 * 1024 * 1024)){
            toast({
              description: "File size is too large, pick a file less than 5mb"
            });
            return;
          }
          const data = await toBase64(e.target.files[0]);
          const dataType = data.split(",")[0].split(";")[0].split(":")[1].split("/")[0];
          await sendMsg({
            data,
            type: dataType === "application" ? "pdf" : dataType
          });
        }}}/>*/}
        <Input placeholder="Ask Zephyr AI" value={input} onChange={(e) => setInput(e.target.value)}/>
        <Button onClick={async () => {if(input){await sendMsg()}}}><IoSend /></Button>
      </footer>
    </motion.main>
  )
}

const Message = ({ m }) => {
  return (
    <main className={"flex w-full items-center " + (m.model === "user" ? "justify-end text-end" : "justify-start text-start")}>
      <Card className="flex flex-col gap-1 w-fit justify-center items-start p-2 min-w-[20%]">
        <CardContent className="flex justify-start items-center p-0.5 w-fit h-fit">
          {m.model === "loading" ?
          <p className="text-primary animate-pulse font-bold">{m.content}</p> :
          /*m.type === "text" ? */
          <p>{m.parts.text}</p> /*: null
          m.type === "image" ? 
          <img className="rounded h-60 w-60 object-cover" src={m.content} /> : 
          m.type === "video" ? 
          <video className="rounded h-60 w-60 object-cover" controls src={m.content} /> : 
          m.type === "audio" ? 
          <audio controls src={m.content} /> : 
          m.type === "pdf" ? 
          <embed onClick={() => {
            const linkTag = document.createElement("a");
            linkTag.href = m.content;
            linkTag.target = "_blank";
            linkTag.click();
          }} className="rounded h-60 w-60 object-cover" src={m.content} /> : null*/}
        </CardContent>
        {/*<CardFooter className="flex p-0 justify-end">
          <p className="text-xs text-muted-foreground">{(m.type != "loading")&&convertToTimeString(m.timestamp)}</p>
        </CardFooter>*/}
      </Card>
    </main>
  )
}