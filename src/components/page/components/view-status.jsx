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
import { useUID, usePage } from "@/store";
import { likeStatus, getStatus } from "@/utils";
import { useState, useEffect } from "react";

export default function ViewStatus() {
  const [ posts, setPosts ] = useState([]);
  const { page, setPage } = usePage();
  useEffect(() => {
    getStatus(page.data.uid, setPosts);
  }, []);
  return (
    <motion.main initial={{y: -300}} animate={{y: 0}} exit={{y: -300}} transition={{duration: 0.3}}>
      <header>
      </header>
      {posts&&posts.sort((a,b) => a.timestamp - b.timestamp).map(post => <PostViewCard post={post} userData={page.data} />)}
    </motion.main>
  )
}

function PostViewCard({ userData, post }) {
  const uid = useUID(state => state.uid);
  const [ likes, setLikes ] = useState(post.likes.length);
  const [loading, setLoading] = useState(false);
  const addLikes = async () => {
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
  return (
    <Card className="flex gap-2 flex-col">
      <CardHeader className="flex w-full justify-start gap-1">
        <Avatar className="w-10 h-10">
          <AvatarImage className="w-10 h-10 object-cover rounded-full" src={userData?.image} alt="profile-image"/>
          <AvatarFallback className="text-md text-primary">{
          userData?.name ? userData.name[0] : "Z"
          }</AvatarFallback>
        </Avatar>
        <section>
          <h2 className="text-xl font-semibold w-[160px] truncate">{userData?.name}</h2>
          <p className="text-sm text-muted-foreground w-[140px] truncate">{convertToTimeString(post.timestamp)}</p>
        </section>
      </CardHeader>
      <CardContent className="flex w-full flex-col gap-1">
        {post.type === "image" ? 
        (post.textContent ?
        <div>
         <img src={post.content.secure_url} className="h-60 w-full rounded object-cover" />
         <p className="text-md font-semibold">{post.textContent}</p>
        </div> : 
        <img src={post.content.secure_url} className="h-60 w-full rounded object-cover" />)
        : <h3 className="text-xl font-bold">{post.textContent}</h3>}
      </CardContent>
      <CardFooter>
        <Button disabled={loading || post.likes.include(uid)} onClick={addLikes}>Likes {likes || 0}</Button>
      </CardFooter>
    </Card>
  )
}