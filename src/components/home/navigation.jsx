import { CircleDotDashed } from 'lucide-react';
import { Users } from 'lucide-react';
import { MessageCircle } from 'lucide-react';
import { Cog } from 'lucide-react';
import { motion } from "framer-motion";

export function Navigation({nav, setNav}){
  return(
    <motion.main initial={{x: -300}} animate={{x: 0}} className="fixed bottom-0 flex justify-around py-1 bg-transparent backdrop-blur-md p-2 w-full py-2 border-t">
      <div className="flex flex-col justify-center items-center text-center">
        <CircleDotDashed className={"text-lg " + (nav === 0 ? "fill-violet-800" : "text-muted")} onClick={() => setNav(0)} id="updates"/>
        <label htmlFor="updates" className="text-sm font-semibold">Updates</label>
      </div>
      <div className="flex flex-col justify-center items-center text-center">
        <Users className={"text-lg " + (nav === 1 ? "fill-violet-800" : "text-muted")} onClick={() => setNav(1)} id="people"/>
        <label htmlFor="people" className="text-sm font-semibold">People</label>
      </div>
      <div className="flex flex-col justify-center items-center text-center">
        <MessageCircle className={"text-lg " + (nav === 2 ? "fill-violet-800" : "text-muted")} onClick={() => setNav(2)} id="chats"/>
        <label htmlFor="chats" className="text-sm font-semibold">Chats</label>
      </div>
      <div className="flex flex-col justify-center items-center text-center">
        <Cog className={"text-lg " + (nav === 3 ? "fill-violet-800" : "text-muted")} onClick={() => setNav(3)} id="settings"/>
        <label htmlFor="settings" className="text-sm font-semibold">Settings</label>
      </div>
    </motion.main>
  )
}
