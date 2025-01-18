import { motion } from "framer-motion";
import { usePage } from "@/store";
import { IoClose } from "react-icons/io5";
import { FaImage } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AiOutlineLoading } from "react-icons/ai";
import { useState } from "react";
import { toBase64, uploadFileAndGetURL, postStatus } from "@/utils";
import { useUID } from "@/store";
import { useToast } from "@/hooks/use-toast";

export function AddStatus() {
  const uid = useUID(state => state.uid);
  const { toast } = useToast();
  const { page, setPage } = usePage();
  const [image, setImage] = useState();
  const [loading, setLoading] = useState();
  const [statusText, setStatusText] = useState();
  const post = async (e) => {
    try {
      if (!navigator.onLine) {
        toast({
          title: "No internet connection",
          description: "Internet connection offline",
          variant: "destructive"
        });
        return;
      }
      setLoading(true);
      let postData;
      if (image) {
        const url = await uploadFileAndGetURL(image, "posts", "image");
        if (url && url.secure_url) {
          postData = {
            type: "image",
            content: url,
            textContent: statusText || null,
            timestamp: Date.now(),
            likes: []
          }
        }
      } else {
        postData = {
          type: "text",
          content: statusText,
          timestamp: Date.now(),
          likes: []
        }
      }
      await postStatus(uid, postData);
      toast({
        description: "Status posted"
      });
      setPage({
        open: false,
        component: "default"
      })
    } catch (err) {
      console.error(err, err.message, "post");
    } finally {
      setLoading(false);
    }
  }
  return (
    <motion.main initial={{y: 300}} animate={{y: 0}} exit={{y: 300}} transition={{duration: 0.3}} className="flex flex-col w-full gap-1">
      <header className="flex justify-between w-full p-2">
        <div className="p-2 rounded-full bg-muted flex justify-center items-center w-12 h-12 cursor-pointer" onClick={() => setPage({
            open: false,
            component: "default"
            })}>
          <IoClose className="text-xl fill-black dark:fill-white"/>
        </div>
        <label htmlFor="image-status" className=" p-2 rounded-full bg-muted flex justify-center items-center w-12 h-12 cursor-pointer">
          <FaImage className="text-xl fill-black dark:fill-white"/>
          <input disabled={loading} type="file" accept=".png, .jpg, .jpeg" id="image-status" onChange={async (e) => {
          if (e.target.files[0].size > (5 * 1024 * 1024)) {
            toast({
              description: "Image size is too large, image size must not be larger than 5mb"
            });
            return;
          } else if(["video", "audio", "pdf"].some(x => e.target.files[0].type.includes(x))){
            toast({
              description: "You can only post images or texts"
            });
          }
          const data = await toBase64(e.target.files[0]);
          setImage(data);} } hidden/>
        </label>
      </header>
      <Card className="w-full flex flex-col gap-2 items-center">
        <CardContent className="flex flex-col gap-2 items-center w-full p-2">
          {image&&<img src={image} className="h-60 w-full rounded p-1 object-cover" />}
          <Textarea className="w-full mt-1" placeholder="Type a status" onChange={(e) => setStatusText(e.target.value)} />
        </CardContent>
        <CardFooter className="w-full">
          <Button className="w-full" disabled={loading || !(statusText || image)} onClick={post}>{loading ? <AiOutlineLoading className="animate-spin text-md"/> : "Post"}</Button>
        </CardFooter>
      </Card>
    </motion.main>
  )
}