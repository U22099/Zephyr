import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { usePage, useUID } from "@/store";
import { convertToTimeString, getPosts } from "@/utils";
import { FaPlus } from "react-icons/fa";
import { FaVideo } from "react-icons/fa6";
import { AiFillAudio } from "react-icons/ai";
import { useEffect, useState } from "react";

export function Posts() {
  const [posts, setPosts] = useState([]);
  const [userPost, setUserPost] = useState();
  const [postsFilter, setPostsFilter] = useState([]);
  const uid = useUID(state => state.uid);
  const setPage = usePage(state => state.setPage);
  useEffect(() => {
    if (uid) {
      getPosts(uid, setPosts)
    }
  }, [uid]);
  useEffect(() => {
    if (posts) {
      setUserPost(posts.find(x => x.uid === uid));
      setPostsFilter([
        ...posts
          .filter(x => x.uid !== uid && x.lastPost.timestamp)
      ]);
    }
  }, [posts]);
  return (
    <main className="flex flex-col gap-2 w-full overflow-y-scroll scrollbar">
      <Input placeholder="Search..." onChange={(e) => {
        if(!e.target.value){
          setPostsFilter([
            ...posts
              .filter(x => x.uid !== uid && x.lastPost.timestamp)
          ]);
          return;
        }
        setPostsFilter([            ...posts
            .filter(x => x.uid !== uid && x.lastPost.timestamp && x.name?.toLowerCase()?.includes(e.target.value.toLowerCase()))
        ]);
      }}/>
      <section className="flex flex-wrap gap-2 w-full justify-center">
        {userPost&&<PostCard data={{
          ...userPost,
          name: "Add Status"
        }} action={() => setPage({
          open: true,
          component: "add-status"
        })} />}
        {userPost&&<PostCard data={userPost} action={() => setPage({
          open: true,
          component: "view-status",
          data: {
            ...userPost,
          }
        })} />}
        {postsFilter
          .sort((a, b) => b.lastPost.timestamp - a.lastPost.timestamp)
          .map((post,i) => <PostCard key={i} data={post} action={() => setPage({
              open: true,
              component: "view-status",
              data: {
                ...post,
              }
            })
          }/>
        )}
      </section>
    </main>
  )
}

function PostCard({ data, action }) {
  return (
    <Card className="backdrop-blur-sm flex justify-center items-center w-20 h-36 overflow-hidden cursor-pointer md:w-52 md:h-60 select-none" onClick={action}>
      <CardContent className="flex flex-col items-start justify-between p-2 w-20 h-36 md:w-52 md:h-60 relative">
        {data.name === "Add Status" ? 
         <div className="p-2 rounded-full bg-primary flex justify-center items-center w-10 h-10">
          <FaPlus className="text-xl fill-white"/>
        </div> : <Avatar className="w-10 h-10">
          <AvatarImage className="w-10 h-10 object-cover rounded-full" src={data?.image} alt="profile-image"/>
          <AvatarFallback className="text-md text-primary">{
          data?.name ? data.name[0] : "Z"
          }</AvatarFallback>
        </Avatar>}
        <section className={(!data.lastPost.type === "image" ? "bg-transparent p-1 break-words text-center": "" ) + " absolute top-0 left-0 w-full h-full z-[-1] flex justify-center items-center"}>
          {data.lastPost.type === "text" ? 
          <p className="text-sm truncate">{data.lastPost.content}</p> : 
          data.lastPost.type === "image" ? 
          <img className="rounded-lg h-full w-full object-cover" src={data.lastPost.content?.secure_url || data.image} /> : 
          data.lastPost.type === "video" ? 
          <div className="flex flex-wrap gap-2"> <FaVideo/> Video</div> : 
          data.lastPost.type === "audio" ? 
          <div className="flex flex-wrap gap-2"> <AiFillAudio/> Audio</div> : null}
        </section>
        <h2 className="text-center self-end text-sm font-semibold w-16 md:w-48 truncate text-white">{data.name}</h2>
      </CardContent>
    </Card>
  )
}