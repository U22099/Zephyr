import { motion } from "framer-motion";
import { usePage } from "@/store";
import { FaChevronLeft } from "react-icons/fa";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { FiPhone } from "react-icons/fi";
import { IoVideocamOutline } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Chat() {
  const { setPage, page } = usePage();
  return (
    <motion.main initial={{x: 300}} animate={{x: 0}} exit={{x: 300}} transition={{duration: 0.3}} onClick={() => setPage({open: false, component: "default"})}>
      <header className="sticky top-0 left-0 w-full grid grid-cols-12 backdrop-blur-sm pb-2 border-b z-10">
        <FaChevronLeft className="self-start dark:fill-white fill-black w-6 h-6 col-span-2" onClick={() => setPage({open: false, component: 'default'})}/>
        <section className="flex gap-2 col-span-6">
          <Avatar className="w-16 h-16">
            <AvatarImage className="w-16 h-16 object-cover rounded-full" src={image} alt="profile-image"/>
            <AvatarFallback className="text-3xl text-primary">{username ? username[0] : "Z"}</AvatarFallback>
          </Avatar>
          <section className="py-1 h-full flex flex-col items-start justify-center gap-1 w-full">
              <h1 className="text-xl font-bold">{username}</h1>
              <p className="text-sm text-muted-foreground">last seen at 8pm</p>
          </section>
        </section>
        <FiPhone className="self-start dark:fill-white fill-black w-6 h-6 col-span-2"/>
        <IoVideocamOutline className="self-start dark:fill-white fill-black w-6 h-6 col-span-2"/>
      </header>
      <main>
      </main>
      <footer className="flex gap-2 fixed bottom-2 backdrop-blur-sm pt-2 border-t z-10">
        <Input placeholder="type in message"/>
        <Button><IoSend /></Button>
      </footer>
    </motion.main>
  )
}