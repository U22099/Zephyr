import { motion } from "framer-motion";
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
import { Button } from "@/components/ui/button";
import { IoClose } from "react-icons/io5";
import { AiOutlineLoading } from "react-icons/ai";
import { useUID, usePage } from "@/store";
import { likeStatus, deleteStatus, getStatus, convertToTimeString } from "@/utils";
import { useState, useEffect } from "react";
import { ImBin } from "react-icons/im";

export function ViewStatus() {
  const [posts, setPosts] = useState([]);
  const { page, setPage } = usePage();
  const viewImage = (image) => {
    setPage({ 
      open: true,
      component: "picture",
      data: { ...page.data, previousPage: "view-status", imageDataToView: image }
    });
  }
  useEffect(() => {
    setPosts([]);
    getStatus(page.data.uid, setPosts);
  }, [page.data.uid]);
  return (
    <motion.main initial={{y: 300}} animate={{y: 0}} exit={{y: 300}} transition={{duration: 0.3}} className="flex flex-col w-full p-2 justify-start gap-2 h-screen overflow-y-scroll scrollbar">
      <header className="flex justify-start w-full p-2">
        <div className="p-2 rounded-full bg-muted flex justify-center items-center w-12 h-12 cursor-pointer" onClick={() => setPage({
            open: false,
            component: "default"
            })}>
          <IoClose className="text-xl fill-black dark:fill-white"/>
        </div>
      </header>
      <div className="flex flex-col md:flex-row w-full p-2 justify-center gap-2 flex-wrap select-none">
      {posts ? posts.sort((a,b) => b.timestamp - a.timestamp).map((post,i) => <PostViewCard key={i} post={post} setPosts={setPosts} userData={page.data} viewImage={viewImage}/>) :
        <h3 className="text-2xl font-bold text-center">No Posts</h3>
      }
      </div>
    </motion.main>
  )
}

function PostViewCard({ userData, post, setPosts, viewImage }) {
  const uid = useUID(state => state.uid);
  const [likes, setLikes] = useState(post.likes.length);
  const [loading, setLoading] = useState(false);
  const [deleteloading, setDeleteLoading] = useState(false);

  const addLikes = async () => {
    if (!navigator.onLine) {
      toast({
        title: "No internet connection",
        description: "Internet connection offline",
        variant: "destructive"
      });
      return;
    }
    try {
      setLoading(true);
      await likeStatus(userData.uid, post.statusId, uid);
      setLikes(likes + 1);
    } catch (err) {
      console.error(err, err.message, "addLikes");
    } finally {
      setLoading(false);
    }
  }

  const deletePost = async () => {
    if (!navigator.onLine) {
      toast({
        title: "No internet connection",
        description: "Internet connection offline",
        variant: "destructive"
      });
      return;
    }
    try {
      setDeleteLoading(true);
      await deleteStatus(userData.uid, post.statusId, uid);
      setPosts(posts => posts.filter(x => x.statusId !== post.statusId));
    } catch (err) {
      console.error(err, err.message, "addLikes");
    } finally {
      setDeleteLoading(false);
    }
  }
  return (
    <Card className="flex gap-2 flex-col w-full md:w-[40%]">
      <CardContent className="flex flex-col gap-2 w-full">
        <header className="mt-2 flex justify-between w-full">
          <section className="flex gap-1">
            <Avatar className="w-10 h-10">
              <AvatarImage className="w-10 h-10 object-cover rounded-full" src={userData?.image} alt="profile-image"/>
              <AvatarFallback className="text-md text-primary">{
              userData?.name ? userData.name[0] : "Z"
              }</AvatarFallback>
            </Avatar>
            <section className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold w-28 truncate">{userData?.name}</h2>
              <p className="text-sm text-muted-foreground w-32 truncate">{convertToTimeString(post.timestamp)}</p>
            </section>
          </section>
          {userData.uid === uid&&
            (deleteloading ? <AiOutlineLoading className="animate-spin text-md"/> : <ImBin onClick={async () => await deletePost()} disabled={deleteloading} className="text-xl fill-black dark:fill-white cursor-pointer"/>)}
        </header>
        <section className="flex w-full flex-col gap-1">
          {post.type === "image" ? 
          (post.textContent ?
          <div className="flex flex-col gap-1 w-full">
           <img onClick={() => viewImage(post.content?.secure_url)} src={post.content.secure_url} className="h-60 w-full rounded object-cover" />
           <p className="text-md font-semibold">{post.textContent}</p>
          </div> : 
          <img onClick={() => viewImage(post.content?.secure_url)} src={post.content.secure_url} className="h-60 w-full rounded object-cover cursor-pointer" />)
          : <h2 className="text-xl font-bold">{post.content}</h2>}
        </section>
      </CardContent>
      <CardFooter className="w-full">
        <Button className="w-full" disabled={loading || post.likes.includes(uid) || likes > post.likes.length} onClick={async () => await addLikes()}>Likes {likes || 0}</Button>
      </CardFooter>
    </Card>
  )
}