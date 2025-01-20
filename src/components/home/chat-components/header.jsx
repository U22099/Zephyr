import { RiCheckDoubleLine } from "react-icons/ri";
import { FaCamera } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Users } from "@/components/home/people-components/users";
import { AIChat } from "@/components/ai/ai-chat";
import { HiSparkles } from "react-icons/hi2";
import { AiOutlineLoading } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { usePage, useUID, useNav } from "@/store";
import { postStatus, uploadFileAndGetURL, toBase64 } from "@/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function Header() {
  const { toast } = useToast();
  const setPage = usePage(state => state.setPage);
  const setNav = useNav(state => state.setNav);
  const uid = useUID(state => state.uid);
  const [loading, setLoading] = useState(false);
  const post = async (e) => {
    try {
      setLoading(true);
      if (e.target.files[0].size > (5 * 1024 * 1024)) {
        toast({
          description: "Image size is too large, image size must not be larger than 5mb"
        });
        return;
      } else if (["video", "audio", "pdf"].some(x => e.target.files[0].type.includes(x))) {
        toast({
          description: "You can only post images or texts"
        });
      }
      const data = await toBase64(e.target.files[0]);
      const url = await uploadFileAndGetURL(data, "posts", "image");
      if (url && url.secure_url) {
        const postData = {
          type: "image",
          content: url,
          timestamp: Date.now(),
          likes: []
        }
        await postStatus(uid, postData);
        setNav(0);
      }
    } catch (err) {
      console.error(err, err.message, "post");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="sticky top-0 left-0 w-full grid grid-cols-10 grid-gap-2 backdrop-blur-sm relative py-4 border-b z-10">
      <div className="col-span-1 p-1 rounded-full bg-primary flex justify-center items-center w-8 h-8 cursor-pointer" onClick={() => setPage({
        open: true,
        component: "profile"
      })}>
        <FaUser className="text-xl fill-white"/>
      </div>
      <h3 className="col-span-6 w-full flex justify-center items-center text-center font-bold text-lg">Chats</h3>
      <div className="col-span-1 p-1 rounded-full bg-muted flex justify-center items-center w-8 h-8 cursor-pointer">
        <Drawer>
          <DrawerTrigger asChild> 
            <HiSparkles className="text-xl fill-black dark:fill-white"  />
          </DrawerTrigger>
          <DrawerContent className="flex flex-col p-2 h-[90vh]">
            <DrawerHeader>
              <DrawerTitle className="text-primary">Zephyr AI
              </DrawerTitle>
              <DrawerDescription>
               Powered by google gemini model
              </DrawerDescription>
            </DrawerHeader>
            <AIChat />
          </DrawerContent>
        </Drawer>
      </div>
      <label htmlFor="image-post" className="col-span-1 p-1 rounded-full bg-muted flex justify-center items-center w-8 h-8 cursor-pointer">
        {loading ? <AiOutlineLoading className="animate-spin text-md"/> : <FaCamera className="text-xl fill-black dark:fill-white"/>}
      </label>
      <input disabled={loading} type="file" accept=".jpg, .png, .jpeg" id="image-post" onChange={post} hidden/>
      <div className="col-span-1 p-1 rounded-full bg-primary flex justify-center items-center w-8 h-8 cursor-pointer">
        <Drawer>
          <DrawerTrigger asChild><FaPlus className="text-xl fill-white"/></DrawerTrigger>
          <DrawerContent className="h-[85vh] flex flex-col p-2">
            <DrawerHeader>
              <DrawerTitle>New Chat
              </DrawerTitle>
            </DrawerHeader>
            <section className="overflow-y-scroll h-full scrollbar">
              <Users />
            </section>
          </DrawerContent>
        </Drawer>
      </div>
    </main>
  )
}