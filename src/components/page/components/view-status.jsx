import { motion } from "framer-motion";
import{
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

export default function ViewStatus() {
  return(
    <motion.main initial={{y: -300}} animate={{y: 0}} exit={{y: -300}} transition={{duration: 0.3}}>
    </motion.main>
  )
}

function PostViewCard({ userData, post, likeAction }){
  return(
    <Card>
      <CardHeader>
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
      <CardContent>
        {post.type === "image" ? 
        (post.textContent ?
        <div>
         <img src={post.content.secure_url} className="h-60 w-full rounded object-cover" />
         <p className="text-md font-semibold">{post.textContent}</p>
        </div> : 
        <img src={post.content.secure_url} className="h-60 w-full rounded object-cover" />)
        : <h3 className="text-xl font-bold">{post.textContent}</h3>}
      </CardContent>
    </Card>
  )
}