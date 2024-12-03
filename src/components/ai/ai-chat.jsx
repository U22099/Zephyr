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
import { AiOutlineClear } from "react-icons/ai";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { sendAIMessage, getAIMessages, convertToTimeString, toBase64 } from "@/utils";
import { useToast } from "@/hooks/use-toast";
import { Remarkable } from 'remarkable';
import hljs from "highlight.js";
import 'highlight.js/styles/github.css';

export function AIChat() {
  const component = useRef(false);
  const main = useRef();
  const { toast } = useToast();
  const uid = useUID(state => state.uid);
  const userData = useUserData(state => state.userData);
  const [msg, setMsg] = useState([]);
  const [input, setInput] = useState("");
  const socket = useSocket(state => state.socket);
  const scrollDown = () => {
    if((msg[msg.length - 1]?.role === "model")&&!component.current){
      return;
    }
    const body = document.getElementById("scroll");
    body.scrollIntoView({
      behavior: "smooth"
    })
  }
  const sendMsg = async () => {
    try {
      const msgData = {
        parts: [{text: input}],
        role: "user",
      }
      const loading = {
        content: "Processing...",
        role: "loading"
      }
      const updatedMsg = [...msg, msgData, loading];
      setMsg([...updatedMsg]);
      setInput("");
      const response = await sendAIMessage(uid, userData.username, msgData);
      const filtered = updatedMsg.filter(x => x.role != "loading") || [];
      setMsg([...filtered, response]);
    } catch (err) {
      console.log(err, err.message, "send message");
    }
  }
  const clear = async () => {
    try {
      const updatedMsg = [...msg, {
        content: "Clearing Messages...",
        role: "loading"
      }];
      setMsg([...updatedMsg]);
      setInput("");
      const response = await clearAIMessages(uid);
      if(response){
        setMsg([]);
        toast({
          description: "AI chat cleared"
        });
      } else {
        const filtered = updatedMsg.filter(x => x.role != "loading") || [];
        setMsg([...filtered, {
          role: "model",
          parts: [{text: "An error occured, please try again"}]
        }]);
      }
    } catch (err) {
      console.log(err, err.message, "send message");
    }
  }
  useEffect(() => {
    if (msg.length > 1) {
      scrollDown();
      component.current = false;
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
  if(!component.current){
    return <p className="text-primary animate-pulse justify-center items-center h-full font-bold w-full text-center">Initialising...</p>
  }
  return (
    <main className="w-full h-full flex flex-col items-center">
      <main className="flex flex-col gap-2 w-full p-2 mt-5 mb-20 h-full overflow-y-scroll scrollbar">
        {msg&&msg.map((doc, i) => <Message key={i} m={doc}/>)}
        {/*For scrolling*/}
        <div id="scroll"></div>
      </main>
      <footer className="flex items-center gap-2 sticky bottom-0 backdrop-blur-sm pt-2 border-t z-10 w-full mx-auto p-3">
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
        <AiOutlineClear className="text-xl" onClick={clear}/>
        <Input placeholder="Ask Zephyr AI" value={input} onChange={(e) => setInput(e.target.value)}/>
        <Button onClick={async () => {if(input){await sendMsg()}}}><IoSend /></Button>
      </footer>
    </main>
  )
}

const Message = ({ m }) => {
  const md = new Remarkable({
    html: true,
    xhtmlOut: true,
    breaks: true,
    typographer: true,
    highlight: function(str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value;
        } catch (e) { console.log(e) }
      }
      try {
        return hljs.highlightAuto(str).value;
      } catch (e) { console.log(e) }
      return '';
    }
  });
  return (
    <main className={"flex w-full items-center " + (m.role === "user" ? "justify-end text-end" : "justify-start text-start")}>
      <Card className="flex flex-col gap-1 w-fit justify-center items-start p-2 min-w-[20%]">
        <CardContent className="flex justify-start items-left p-0.5 w-fit h-fit text-left">
          {m.role === "loading" ?
          <p className="text-primary animate-pulse font-bold">{m.content}</p> :
          /*m.type === "text" ? */
          <div className="ai-display break-words max-w-[80vw] md:max-w-[40vw] text-left" dangerouslySetInnerHTML={{__html: md.render(m.parts[0].text)}} /> /*: null
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