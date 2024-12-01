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
        const postData = {
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
    <motion.main initial={{y: -300}} animate={{y: 0}} exit={{y: -300}} transition={{duration: 0.3}} className="flex w-full">
      <header className="flex justify-between w-full p-2">
        <div className="p-2 rounded-full bg-muted flex justify-center items-center w-12 h-12" onClick={() => setPage({
            open: false,
            component: "default"
            })}>
          <IoClose className="text-xl fill-black dark:fill-white"/>
        </div>
        <label htmlFor="image" className=" p-2 rounded-full bg-muted flex justify-center items-center w-12 h-12">
          <FaImage className="text-xl fill-black dark:fill-white"/>
          <input disabled={loading} type="file" accepts="image/*, audio/*, video/*" id="image" onChange={async (e) => {
          const data = await toBase64(e.target.files[0]);
          setImage(data);} } hidden/>
        </label>
      </header>
      <Card className="w-full flex flex-col gap-3 items-center">
        <CardContent className="flex flex-col gap-2 items-center w-full">
          {image&&<img src={image} className="h-60 w-full rounded p-1 object-cover" />}
          <Textarea className="w-full" placeholder="Type a status" onChange={(e) => setStatusText(e.target.value)} />
        </CardContent>
        <CardFooter>
          <Button disabled={loading || !(statusText || image)} onClick={post}>{loading ? <AiOutlineLoading className="animate-spin text-md"/> : "Post"}</Button>
        </CardFooter>
      </Card>
    </motion.main>
  )
}