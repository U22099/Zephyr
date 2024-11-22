import { motion } from "framer-motion";
import { usePage, useMsg } from "@/store";
import { FaChevronLeft } from "react-icons/fa";
import {
  Card,
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
import { socket } from "@/socket-connection";
import { useState } from "react";

export function Chat() {
  const { setPage, page } = usePage();
  const { setMsg, msg } = useMsg();
  const [ input, setInput ] = useState("");
  socket.on("chat-message", message => {
    setMsg([
      ...msg,
      {
        data: message.data,
        time: message.time,
        me: false
      }
    ]);
  });
  return (
    <motion.main initial={{x: 300}} animate={{x: 0}} exit={{x: 300}} transition={{duration: 0.3}}>
      <header className="sticky top-0 left-0 w-full grid grid-cols-12 backdrop-blur-sm pb-2 border-b z-10 text-center items-center justify-center">
        <FaChevronLeft className="self-center dark:fill-white fill-black w-8 h-8 col-span-2 ml-2" onClick={() => setPage({open: false, component: 'default'})}/>
        <section className="flex items-center gap-2 col-span-6">
          <Avatar className="w-12 h-12">
            <AvatarImage className="w-12 h-12 object-cover rounded-full" src={page.data.image} alt="profile-image"/>
            <AvatarFallback className="text-3xl text-primary">{page.data.username ? page.data.username[0] : "Z"}</AvatarFallback>
          </Avatar>
          <section className="py-1 h-full flex flex-col items-start justify-center gap-1 w-full">
              <h1 className="text-xl font-bold">{page.data.username}</h1>
              <p className="text-sm text-muted-foreground">last seen at 8pm</p>
          </section>
        </section>
        <HiOutlinePhone className="self-center dark:stroke-white stroke-black w-8 h-8 col-span-2"/>
        <IoVideocamOutline className="self-center dark:stroke-white stroke-black w-8 h-8 col-span-2 text-lg"/>
      </header>
      <main className="flex flex-col gap-2 w-full p-3">
        {msg.map((m,i) => {
          return (<Card key={i} className={"flex flex-col gap-1" + (m.me ? "self-end" : "self-start")}>
            <CardContent className="flex justify-center items-center p-2">
              <p>{m.data}</p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <p className="text-xs text-muted-foreground">{m.time}</p>
            </CardFooter>
          </Card>)
        })}
      </main>
      <footer className="flex gap-2 fixed bottom-2 backdrop-blur-sm pt-2 border-t z-10 w-full mx-auto p-3">
        <Input placeholder="Type in message" value={input} onChange={(e) => setInput(e.target.value)}/>
        <Button onClick={() => {
        const currentTime = new Date();
        const time = currentTime.toLocaleTimeString('en-UK', {
          hour12: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        });
        setMsg([
          ...msg,
          {
            data: input,
            time,
            me: true,
          }
        ]);
        setInput("");
        socket.emit("chat-message", {
          data: input,
          time,
        })}}><IoSend /></Button>
      </footer>
    </motion.main>
  )
}