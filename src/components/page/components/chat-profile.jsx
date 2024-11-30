import { motion } from "framer-motion";
import { FaChevronLeft } from "react-icons/fa";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AiOutlineLoading } from "react-icons/ai";
import { usePage, useUID } from "@/store";
import { useState } from "react";
/*import {  } from "@/utils";*/

export function ChatProfile() {
  const { page, setPage } = usePage();
  const uid = useUID(state => state.uid);
  const [ loading, setLoading ] = useState(false);
  return (
    <motion.main initial={{x: 300}} animate={{x: 0}} exit={{x: 300}} transition={{duration: 0.3}} className="flex h-screen flex-col items-center justify-start w-full gap-1 p-2">
      <header className="sticky top-0 left-0 w-full flex justify-start text-center items-center backdrop-blur-sm pb-2 border-b z-10">
        <FaChevronLeft 
        onClick={() => setPage({open: true, component: 'chat', data: {...page.data}})}
        className="self-start dark:fill-white fill-black w-6 h-6"/>
      </header>
      <section className="flex w-full justify-center flex-col items-center mt-10">
        <Avatar className="w-28 h-28">
          <AvatarImage src={page.data.image} className="object-cover rounded-full" />
          <AvatarFallback className="text-2xl text-primary">{page.data.name ? page.data.name[0] : "Z"}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold">{page.data.name}</h2>
      </section>
      <section className="flex flex-col items-center justify-center gap-1 break-words mb-10">
        <h4 className="text-lg text-muted-foreground font-semibold">{page.data.bio || page.data.description}</h4>
        <p className="text-md text-muted-foreground font-semibold">{page.data.active || page.data.members}</p>
      </section>
      <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" className="w-full">{loading ? <AiOutlineLoading className="animate-spin text-md"/> : page.data.type === "group" ? (page.data.admin === uid ? "Delete Group" : "Leave Group") : "Delete Conversation"}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure about this?</DialogTitle>
              <DialogDescription>
                Hit the button below to confirm
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
              disabled={loading}
              onClick={
              async () => {
                setLoading(true);
                
                setLoading(false);
                setPage({
                  open: false,
                  component: "default"
                })
              }}
              type="submit"
              variant="destructive">{loading ? <AiOutlineLoading className="animate-spin text-md"/> : "Continue"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </motion.main>
  )
}