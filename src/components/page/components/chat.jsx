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
import { sendMessage, getMessages, readLastMessage, convertToTimeString, uploadFileAndGetURL, toBase64 } from "@/utils";
import { useToast } from "@/hooks/use-toast";

export function Chat() {
  const component = useRef(false);
  const main = useRef();
  const { toast } = useToast();
  const uid = useUID(state => state.uid);
  const userData = useUserData(state => state.userData);
  const { setPage, page } = usePage();
  const [msg, setMsg] = useState([]);
  const [input, setInput] = useState("");
  const socket = useSocket(state => state.socket);
  const [status, setStatus] = useState();
  const [typing, setTyping] = useState();
  const [ongoingCall, setOngoingCall] = useState({
    confirm: false,
    data: null
  });

  const scrollDown = () => {
    //if ((page.data.type === "group") && (msg && msg[msg?.length - 1]?.senderId !== uid)) return;
    const body = document.getElementById("scroll");
    body.scrollIntoView({
      behavior: "smooth"
    })
  }
  const sendMsg = async (arg = null) => {
    try {
      let msgData;
      if (!arg) {
        msgData = {
          content: input,
          type: "text",
          senderId: uid,
          timestamp: Date.now(),
        }
      } else if (arg.type === "raw-file") {
        msgData = {
          content: arg.data,
          type: arg.type,
          senderId: uid,
          timestamp: Date.now(),
        }
      } else {
        try {
          setMsg([...msg, {
            content: "uploading...",
            type: "upload",
            senderId: uid,
          }]);
          const fileUrl = await uploadFileAndGetURL(arg.data, "files", arg.type);
          msgData = {
            content: fileUrl,
            type: arg.data.split(",")[0].split(";")[0].split(":")[1].split("/")[0],
            senderId: uid,
            timestamp: Date.now(),
          }
          setMsg(msg.filter(x => x.type !== "upload"));
        } catch (err) {
          console.log(err.message);
          return;
        }
      }
      setInput("");
      if (page.data.type === "group") {
        msgData.senderName = userData.username;
        msgData.read = [uid];
      } else {
        msgData.read = false;
      }
      setMsg([...msg, msgData]);
      await sendMessage(uid, page.data.uid, msgData);
      if (page.data.type === "group") {
        socket.emit("group-send-message", {
          groupId: page.data.uid,
          name: page.data.name,
          data: msgData,
        });
      } else {
        socket.emit("send-message", {
          to: page.data.uid,
          from: uid,
          name: page.data.name,
          data: msgData
        });
      }
    } catch (err) {
      console.log(err, err.message, "send message");
    }
  }
  const handleRecieveUserActiveStatus = (data) => {
    if (data === page.data.uid) {
      setStatus("Online");
    } else {
      setStatus("Offline");
    }
  };

  const handleIncomingVoiceCall = (data) => {
    setPage({
      open: true,
      component: "voice-call",
      data: {
        ...data,
        doc: page.data,
        incoming: true,
      }
    });
  };

  const handleIncomingVideoCall = (data) => {
    setPage({
      open: true,
      component: "video-call",
      data: {
        ...data,
        doc: page.data,
        incoming: true,
      }
    });
  };

  const handleOngoingCall = (data) => {
    if ((page.data.type === "personal" && data.from === page.data.uid) || (page.data.type === "group" && data.to === page.data.uid)) {
      setOngoingCall({
        confirm: true,
        data,
      });
    } else console.log("Mistake Ongoing call")
  };

  const handleGroupRecieveMessage = (data) => {
    setMsg((prev) => [...prev, data]);
  };

  const handleRecieveMessage = (data) => {
    if (data.senderId === page.data.uid) {
      setMsg((prev) => [...prev, data]);
    }
  };

  const handleTypingStatusOn = (data) => {
    if ((page.data.type === "personal" && data.from === page.data.uid) || (page.data.type === "group" && data.to === page.data.uid)) {
      if (page.data.type === "group") {
        setTyping(data.name + " is typing");
      } else {
        setTyping("typing");
      }
    }
  }

  const handleTypingStatusOff = (data) => {
    if ((page.data.type === "personal" && data.from === page.data.uid) || (page.data.type === "group" && data.to === page.data.uid)) {
      setTyping("");
    } else console.log("Mistake")
  }

  useEffect(() => {
    if (msg.length > 1) {
      scrollDown();
    }
  }, [msg]);

  useEffect(() => {
    const markAsRead = async () => {
      try {
        await readLastMessage(uid, page.data.uid, page.data.type);
      } catch (err) {
        console.log(err, "markAsRead");
      }
    }
    const lastMessage = msg&&msg.length > 0 ? msg[msg.length - 1] : null;
    if (lastMessage && lastMessage.senderId !== uid && ((page.data.type === "personal" && lastMessage.read === false) || (page.data.type === "group" && !lastMessage.read.includes(uid)))) {
      markAsRead();
    }
  }, [msg]);

  useEffect(() => {
    if (page.data.type === "personal") {
      socket.emit("ongoing-call-check", uid);
      socket.emit("get-user-active-status", { id: page.data.uid });
      socket.on("recieve-message", handleRecieveMessage);
      socket.on("recieve-user-active-status", handleRecieveUserActiveStatus);
      socket.on("incoming-voice-call", handleIncomingVoiceCall);
      socket.on("incoming-video-call", handleIncomingVideoCall);
    } else {
      socket.emit("ongoing-call-check", page.data.uid);
      socket.emit("join-group", page.data.uid);
      socket.on("group-recieve-message", handleGroupRecieveMessage);
      socket.on("group-incoming-voice-call", handleIncomingVoiceCall);
      socket.on("group-incoming-video-call", handleIncomingVideoCall);
    }
    socket.on("ongoing-call-confirmed", handleOngoingCall);
    socket.on("typing-status-on", handleTypingStatusOn);
    socket.on("typing-status-off", handleTypingStatusOff);
    return () => {
      if (page.data.type === "personal") {
        socket.off("recieve-user-active-status", handleRecieveUserActiveStatus);
        socket.off("incoming-voice-call", handleIncomingVoiceCall);
        socket.off("incoming-video-call", handleIncomingVideoCall);
        socket.off("recieve-message", handleRecieveMessage);
      } else {
        socket.off("group-incoming-voice-call", handleIncomingVoiceCall);
        socket.off("group-incoming-video-call", handleIncomingVideoCall);
        socket.off("group-recieve-message", handleGroupRecieveMessage);
      }
      socket.off("ongoing-call-confirmed", handleOngoingCall);
      socket.off("typing-status-on", handleTypingStatusOn);
      socket.off("typing-status-off", handleTypingStatusOff);
    };
  }, [socket, page.data.uid, page.data.type]);
  useEffect(() => {
    const fetchMsgs = async () => {
      try {
        const result = (await getMessages(uid, page.data.uid, page.data.type)) || [];
        if (result && result[0]?.permissiondenied) {
          toast({
            title: "Permission Denied",
            description: "You can only be added to a group by the admin",
            variant: "destructive"
          });
          setPage({
            open: false,
            component: "default"
          });
          return;
        } else setMsg([...result.sort((a, b) => a.timestamp - b.timestamp)]);
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
    <motion.main className="w-full h-full flex flex-col justify-start items-center" initial={{x: 300}} animate={{x: 0}} exit={{x: 300}} transition={{duration: 0.3}}>
      <header className="sticky top-0 left-0 md:right-0 w-full flex gap-3 px-2 backdrop-blur-sm pb-2 border-b z-10 items-center text-center pt-1 justify-start">
        <FaChevronLeft className="self-center dark:fill-white fill-black w-7 h-7" onClick={() => setPage({open: false, component: 'default'})}/>
        <section className="flex items-center gap-2 max-w-[70%]">
          <Avatar className="w-12 h-12">
            <AvatarImage className="w-12 h-12 object-cover rounded-full" src={page.data.image} alt="profile-image"/>
            <AvatarFallback className="text-3xl text-primary">{page.data.name ? page.data.name[0] : "Z"}</AvatarFallback>
          </Avatar>
          <section className="py-1 h-full flex flex-col items-start justify-start gap-1 w-full active:text-muted-foreground" onClick={() => setPage({open: true, component: "chat-profile", data: {...page.data, status}})}>
              <h1 className="text-xl font-bold truncate w-32 flex justify-start">{page.data.name}</h1>
              <p className="text-sm text-muted-foreground truncate w-40 flex justify-start">{typing ? typing : page.data.type === "personal" ? status || "" : page.data.members?.join(",")}</p>
          </section>
        </section>
        {ongoingCall.confirm ? <Button className="animate-pulse" onClick={() => {
          if(callType === "voice"){
            handleIncomingVoiceCall(ongoingCall.data);
          } else handleIncomingVideoCall(ongoingCall.data);
        }}>Join</Button> : 
        <HiOutlinePhone className="self-center dark:stroke-white stroke-black w-8 h-8" onClick={() => setPage({
            open: true,
            component: "voice-call",
            data: {
              ...page.data,
              incoming: false
            }
        })}/>}
        {!ongoingCall.confirm&&<IoVideocamOutline className="self-center dark:stroke-white stroke-black w-10 h-10" 
        onClick={() => setPage({
            open: true,
            component: "video-call",
            data: {
              ...page.data,
              incoming: false
            }
        })}/>}
      </header>
      <section className="flex flex-col gap-2 w-full p-2 mb-16 h-full overflow-y-scroll scrollbar">
        {msg&&msg.map((doc, i) => <Message key={i} m={doc} type={page.data.type} uid={uid}/>)}
        {/*For scrolling*/}
        <div id="scroll"></div>
      </section>
      <footer className="flex items-center gap-2 fixed bottom-0 left-0 md:right-0 backdrop-blur-sm pt-2 border-t z-10 w-full mx-auto md:mx-none p-3">
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
        <Input 
        onBlur={() => {
          socket.emit("typing-status-off", {
            to: page.data.uid, 
            from: uid, 
            type: page.data.type
          });
        }} 
        placeholder="Type in message" 
        value={input} 
        onChange={(e) => {
          socket.emit("typing-status-on", {
            to: page.data.uid,
            from: uid,
            name: userData.username,
            type: page.data.type
          });
        setInput(e.target.value)}}/>
        <Button onClick={async () => {if(input){await sendMsg()}}}><IoSend /></Button>
      </footer>
    </motion.main>
  )
}

const Message = ({ m, type, uid }) => {
  return (
    <main className={"flex w-full items-center " + (m.senderId === uid ? "justify-end text-end" : "justify-start text-start")}>
      <Card className="flex flex-col gap-1 w-fit max-w-[70vw] md:max-w-[60vw] justify-center items-start p-2 min-w-[20%]">
        {type === "group" && <CardHeader className="w-full flex p-0">
          <p className={"text-muted-foreground text-sm w-24 truncate flex p-0 " + (m.senderId === uid ? "self-end text-end justify-end" : "justify-start text-start self-start")}>~{m.senderName}</p>
        </CardHeader>}
        <CardContent className="flex justify-start items-center p-0.5 w-fit h-fit text-left">
          {m.type === "upload" ? 
          <p className="text-primary font-bold animate-pulse text-left">{m.content}</p> : 
          m.type === "text" ? 
          <p className="text-left">{m.content}</p> : 
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